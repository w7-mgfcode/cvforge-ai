// scripts/fpat/eval/audit-planning-accuracy.mjs
// FPAT Umbrella 2 — Phase-2 planning-accuracy audit (domain 5). Read-only. Raw metrics,
// no thresholds, no gating. Measures compliance against the documented FPAT contracts:
//   - branch naming  (.claude/rules/flow-pack-agent-team/branch-naming.md)
//   - commit format  (.claude/rules/flow-pack-agent-team/commit-format.md)
//   - exactly-5 sub-issues per type:epic issue (native hierarchy API)
//   - "Closes #<issue>" linkage in merged PR bodies
//
// Branches are often deleted post-merge, so merged-PR headRefName is the durable
// branch-naming record. Checks span ALL merged PRs / all main commits; violations are
// flagged with flow-pack membership so FPAT vs non-FPAT drift stays distinguishable.
//
// Usage:
//   node scripts/fpat/eval/audit-planning-accuracy.mjs \
//     [--owner w7-mgfcode] [--repo cvforge-ai] [--ref origin/main]
//
// Exit code: 0 on success (even if compliance is "low"); non-zero only on tooling error.

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { listAllIssues, listAllPRs, subIssueCount } from './lib/gh.mjs';
import { writeReport } from './lib/report.mjs';
import { PlanningAccuracyReportSchema } from './lib/schema.mjs';

const BRANCH_RE =
  /^(feat|fix|docs|chore|refactor|test|ci)\/(claude-rules|claude-docs|claude-commands|claude-skills|github-workflows|github-projects|scripts)-\d+-[a-z0-9-]+$/;
const COMMIT_RE = /^(feat|fix|docs|chore|refactor|test|ci)\([a-z-]+\): .+ \(#\d+\)$/;
const CLOSES_RE = /\b(close[sd]?|fix(e[sd])?|resolve[sd]?)\s*:?\s+#\d+/i;

function arg(name, def = undefined) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return def;
  const next = process.argv[i + 1];
  return next && !next.startsWith('--') ? next : true;
}

const hasLabel = (item, name) => (item.labels || []).some((l) => l.name === name);
const rate = (num, den) => (den ? Math.round((num / den) * 1000) / 1000 : null);

async function main() {
  const owner = arg('owner', 'w7-mgfcode');
  const repo = arg('repo', 'cvforge-ai');
  const ref = arg('ref', 'origin/main');

  const prs = listAllPRs({});
  const merged = prs.filter((p) => p.state === 'MERGED');
  const issues = listAllIssues({});

  // 1. Branch naming (durable record: merged-PR headRefName)
  const branchViolations = merged
    .filter((p) => !BRANCH_RE.test(p.headRefName || ''))
    .map((p) => ({ pr: p.number, headRefName: p.headRefName || '', flowPackLabeled: hasLabel(p, 'flow-pack') }));

  // 2. Commit format (squash-merge subjects on main).
  // Fixture mode reads a canned subject list instead of the local git history.
  const fixturesDir = (process.env.FPAT_EVAL_FIXTURES || '').trim();
  const subjects = (fixturesDir
    ? readFileSync(join(fixturesDir, 'git-log-subjects.txt'), 'utf8')
    : execFileSync('git', ['log', '--pretty=format:%s', ref], { encoding: 'utf8' }))
    .split('\n').filter(Boolean);
  const commitViolations = subjects.filter((s) => !COMMIT_RE.test(s));

  // 3. Exactly-5 sub-issues per type:epic (best-effort hierarchy API; null if unavailable)
  const epics = issues.filter((i) => hasLabel(i, 'type:epic'));
  const perEpic = epics.map((e) => ({
    epic: e.number,
    title: e.title,
    subIssueCount: subIssueCount(e.number, owner, repo),
  }));
  const exactlyFive = perEpic.filter((e) => e.subIssueCount === 5).length;

  // 4. "Closes #<issue>" linkage in merged PR bodies (any GitHub closing keyword)
  const linkageViolations = merged
    .filter((p) => !CLOSES_RE.test(p.body || ''))
    .map((p) => ({ pr: p.number, title: p.title, flowPackLabeled: hasLabel(p, 'flow-pack') }));

  const report = {
    domain: 'planning-accuracy',
    schemaVersion: '1.0.0',
    generatedAt: new Date().toISOString(),
    scope: {
      label: 'flow-pack',
      umbrella: 'all-flow-pack',
      note:
        'Compliance is measured over ALL merged PRs and all commits on the main ref (not only ' +
        'flow-pack items); each violation is flagged with flow-pack membership. Contracts: ' +
        '.claude/rules/flow-pack-agent-team/{branch-naming,commit-format}.md + the exactly-5 ' +
        'fan-out rule. Raw data only — compliance rates are never gates.',
    },
    inputs: [
      'gh pr list --state all --json number,title,state,labels,headRefName,body,createdAt,mergedAt',
      'gh issue list --state all --json number,title,state,labels',
      `git log --pretty=format:%s ${ref}`,
      'gh api graphql (subIssues.totalCount per type:epic issue) [best-effort]',
    ],
    metrics: {
      branchNaming: {
        totalMergedPRs: merged.length,
        compliant: merged.length - branchViolations.length,
        complianceRate: rate(merged.length - branchViolations.length, merged.length),
        violations: branchViolations,
      },
      commitFormat: {
        totalCommits: subjects.length,
        compliant: subjects.length - commitViolations.length,
        complianceRate: rate(subjects.length - commitViolations.length, subjects.length),
        violations: commitViolations,
      },
      epicFanOut: {
        epicsChecked: perEpic.length,
        exactlyFive,
        perEpic,
      },
      prLinkage: {
        totalMergedPRs: merged.length,
        withClosingKeyword: merged.length - linkageViolations.length,
        complianceRate: rate(merged.length - linkageViolations.length, merged.length),
        violations: linkageViolations,
      },
    },
    findings: [
      `Branch naming: ${merged.length - branchViolations.length}/${merged.length} merged PRs conform; ${branchViolations.length} violations.`,
      `Commit format: ${subjects.length - commitViolations.length}/${subjects.length} main-ref subjects conform; ${commitViolations.length} violations.`,
      `Epic fan-out: ${exactlyFive}/${perEpic.length} type:epic issues have exactly 5 sub-issues.`,
      `PR linkage: ${merged.length - linkageViolations.length}/${merged.length} merged PRs carry a closing keyword; ${linkageViolations.length} violations.`,
    ],
    inferred: [
      'Sub-issue counts come from the best-effort hierarchy API; null means the count was unavailable, not zero.',
      'Commit subjects predating the FPAT conventions are counted as violations — the rate mixes eras.',
    ],
    proven: [
      'Branch/commit/linkage/fan-out compliance is measurable deterministically from durable git + GitHub state.',
    ],
    notProven: [
      'Intent behind any violation; whether a violation caused downstream harm.',
      'Whether FPAT IMPROVED delivery — single baseline (n=1), no comparison cohort.',
    ],
    confidence: 'high',
  };

  PlanningAccuracyReportSchema.parse(report); // internal-error guard only; never gates on metric values
  const path = writeReport('planning-accuracy', report);

  console.log(`[planning-accuracy] wrote ${path}`);
  console.log(`  branch naming : ${report.metrics.branchNaming.compliant}/${merged.length} compliant (rate ${report.metrics.branchNaming.complianceRate})`);
  console.log(`  commit format : ${report.metrics.commitFormat.compliant}/${subjects.length} compliant (rate ${report.metrics.commitFormat.complianceRate})`);
  console.log(`  epic fan-out  : ${exactlyFive}/${perEpic.length} epics with exactly 5 sub-issues`);
  console.log(`  PR linkage    : ${report.metrics.prLinkage.withClosingKeyword}/${merged.length} with closing keyword (rate ${report.metrics.prLinkage.complianceRate})`);
  if (branchViolations.length) console.log(`  branch violations: ${branchViolations.map((v) => `#${v.pr} ${v.headRefName}`).join(' | ')}`);
  if (linkageViolations.length) console.log(`  linkage violations: ${linkageViolations.map((v) => `#${v.pr}`).join(' ')}`);
}

main().catch((err) => {
  console.error('[planning-accuracy] INTERNAL ERROR (not a metric failure):', err.message);
  process.exit(1);
});
