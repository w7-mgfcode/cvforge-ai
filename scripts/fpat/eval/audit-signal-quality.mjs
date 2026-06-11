// scripts/fpat/eval/audit-signal-quality.mjs
// FPAT Umbrella 2 — Phase-2 label-coverage / signal-quality audit (domain 8). Read-only.
// SECOND STAGE: consumes the planning-accuracy and workflow-reliability report JSON.
// Raw metrics, no thresholds, no gating. Measures:
//   - label-coverage drift: FPAT-looking work missing `flow-pack` (the #12/#14 case),
//     and flow-pack items missing type:/phase:/area: taxonomy labels
//   - run noise: cancelled/skipped runs superseded by a later success for the same
//     workflow+event (benign-looking) vs not superseded (potentially lost work)
//   - gate false negatives: planning-accuracy violations that merged anyway
//
// "FPAT-looking" is a HEURISTIC (title/branch references FPAT scopes) — candidates are
// reported as `inferred`, never auto-corrected. The Phase-1 flow-pack filter is NOT adjusted.
//
// Usage:
//   node scripts/fpat/eval/audit-signal-quality.mjs \
//     [--planning docs/reports/<date>/planning-accuracy.json] \
//     [--reliability docs/reports/<date>/workflow-reliability.json]
//
// Exit code: 0 on success (even if signal quality is "low"); non-zero only on tooling error.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { listAllIssues, listAllPRs } from './lib/gh.mjs';
import { writeReport, reportDir } from './lib/report.mjs';
import { SignalQualityReportSchema } from './lib/schema.mjs';

// Heuristic per the Phase-2 plan: branch/title references claude-*|github-*|scripts|fpat.
const FPAT_TITLE_RE =
  /\b(fpat|flow[- ]?pack)\b|\((claude-rules|claude-docs|claude-commands|claude-skills|github-workflows|github-projects|scripts)\)/i;
const FPAT_BRANCH_RE =
  /^(feat|fix|docs|chore|refactor|test|ci)\/(claude-rules|claude-docs|claude-commands|claude-skills|github-workflows|github-projects|scripts)-/;
const TAXONOMY_PREFIXES = ['type:', 'phase:', 'area:'];

function arg(name, def = undefined) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return def;
  const next = process.argv[i + 1];
  return next && !next.startsWith('--') ? next : true;
}

const labelNames = (item) => (item.labels || []).map((l) => l.name);
const hasFlowPack = (item) => labelNames(item).includes('flow-pack');
const missingTaxonomy = (item) =>
  TAXONOMY_PREFIXES.filter((p) => !labelNames(item).some((n) => n.startsWith(p)));

function supersession(runsTimeline) {
  const counts = { cancelledSuperseded: 0, cancelledNotSuperseded: 0, skippedSuperseded: 0, skippedNotSuperseded: 0 };
  const notSupersededExamples = [];
  for (const [workflow, runs] of Object.entries(runsTimeline)) {
    for (const run of runs) {
      if (run.conclusion !== 'cancelled' && run.conclusion !== 'skipped') continue;
      const superseded = runs.some(
        (s) => s.conclusion === 'success' && s.event === run.event && s.createdAt >= run.createdAt && s.id !== run.id,
      );
      const key = run.conclusion === 'cancelled' ? 'cancelled' : 'skipped';
      counts[`${key}${superseded ? 'Superseded' : 'NotSuperseded'}`] += 1;
      if (!superseded && notSupersededExamples.length < 20) {
        notSupersededExamples.push({
          workflow, id: run.id, event: run.event, createdAt: run.createdAt, conclusion: run.conclusion,
        });
      }
    }
  }
  return { ...counts, notSupersededExamples };
}

async function main() {
  const dir = reportDir();
  const planningPath = arg('planning', join(dir, 'planning-accuracy.json'));
  const reliabilityPath = arg('reliability', join(dir, 'workflow-reliability.json'));

  const planning = JSON.parse(readFileSync(planningPath, 'utf8'));
  const reliability = JSON.parse(readFileSync(reliabilityPath, 'utf8'));

  const issues = listAllIssues({});
  const prs = listAllPRs({});

  // 1a. FPAT-looking items missing the flow-pack label (heuristic → inferred, never auto-fixed)
  const fpatIssuesMissing = issues
    .filter((i) => !hasFlowPack(i) && FPAT_TITLE_RE.test(i.title))
    .map((i) => ({ number: i.number, title: i.title }));
  const fpatPrsMissing = prs
    .filter((p) => !hasFlowPack(p) && (FPAT_TITLE_RE.test(p.title) || FPAT_BRANCH_RE.test(p.headRefName || '')))
    .map((p) => ({ number: p.number, title: p.title, headRefName: p.headRefName || '' }));

  // 1b. flow-pack items missing type:/phase:/area: taxonomy labels
  const fpIssuesNoTaxonomy = issues
    .filter((i) => hasFlowPack(i) && missingTaxonomy(i).length > 0)
    .map((i) => ({ number: i.number, title: i.title, missing: missingTaxonomy(i) }));
  const fpPrsNoTaxonomy = prs
    .filter((p) => hasFlowPack(p) && missingTaxonomy(p).length > 0)
    .map((p) => ({ number: p.number, title: p.title, missing: missingTaxonomy(p) }));

  // 2. Run noise: superseded vs not-superseded cancelled/skipped runs (from B's timeline)
  const runNoise = supersession(reliability.metrics.runsTimeline || {});

  // 3. Gate false negatives: planning-accuracy violations that merged anyway
  const gateFalseNegatives = {
    mergedBranchNamingViolations: planning.metrics.branchNaming.violations.length,
    mergedLinkageViolations: planning.metrics.prLinkage.violations.length,
    mainCommitFormatViolations: planning.metrics.commitFormat.violations.length,
    note:
      'Each count is contract-violating work that merged to main despite the existing gates ' +
      '(fpat-validate et al.) — i.e. false negatives of the current automation, sourced from ' +
      'the planning-accuracy report. Includes pre-FPAT-era items; see that report for the lists.',
  };

  const report = {
    domain: 'signal-quality',
    schemaVersion: '1.0.0',
    generatedAt: new Date().toISOString(),
    scope: {
      label: 'flow-pack',
      umbrella: 'all-flow-pack',
      note:
        'Second-stage audit decomposing the 33↔37 baseline gap and gate effectiveness. ' +
        '"FPAT-looking" membership is a title/branch heuristic — candidates need human ' +
        'confirmation and are never auto-labeled. The Phase-1 flow-pack filter is not adjusted.',
    },
    inputs: [
      planningPath,
      reliabilityPath,
      'gh issue list --state all --json number,title,state,labels',
      'gh pr list --state all --json number,title,state,labels,headRefName,body,createdAt,mergedAt',
    ],
    metrics: {
      labelCoverage: {
        fpatLookingMissingFlowPack: {
          issues: fpatIssuesMissing,
          prs: fpatPrsMissing,
          issueCount: fpatIssuesMissing.length,
          prCount: fpatPrsMissing.length,
        },
        flowPackMissingTaxonomy: {
          issues: fpIssuesNoTaxonomy,
          prs: fpPrsNoTaxonomy,
          issueCount: fpIssuesNoTaxonomy.length,
          prCount: fpPrsNoTaxonomy.length,
        },
      },
      runNoise,
      gateFalseNegatives,
      sources: { planningReport: planningPath, reliabilityReport: reliabilityPath },
    },
    findings: [
      `Label coverage: ${fpatIssuesMissing.length} FPAT-looking issues + ${fpatPrsMissing.length} FPAT-looking PRs lack the flow-pack label (heuristic candidates).`,
      `Taxonomy gaps on flow-pack items: ${fpIssuesNoTaxonomy.length} issues + ${fpPrsNoTaxonomy.length} PRs missing type:/phase:/area: labels.`,
      `Run noise: cancelled ${runNoise.cancelledSuperseded} superseded vs ${runNoise.cancelledNotSuperseded} not; skipped ${runNoise.skippedSuperseded} superseded vs ${runNoise.skippedNotSuperseded} not.`,
      `Gate false negatives (merged despite contracts): branch ${gateFalseNegatives.mergedBranchNamingViolations}, linkage ${gateFalseNegatives.mergedLinkageViolations}, commit ${gateFalseNegatives.mainCommitFormatViolations}.`,
    ],
    inferred: [
      'Every fpatLookingMissingFlowPack candidate is heuristic — whether it SHOULD carry flow-pack needs human confirmation.',
      'A superseded cancelled run is benign-LOOKING noise; supersession by workflow+event is an approximation of same-trigger re-runs.',
    ],
    proven: [
      'Label coverage and gate effectiveness are quantifiable from durable GitHub state plus the stage-1 reports.',
      'The 33↔37 baseline gap decomposes into noise vs missing-label vs definitional categories (see throughput-mismatch-analysis.md).',
    ],
    notProven: [
      'That any flagged FPAT-looking item should have carried flow-pack (heuristic, needs human confirmation).',
      'Root cause of non-superseded cancellations/skips.',
      'Whether FPAT IMPROVED delivery — single baseline (n=1), no comparison cohort.',
    ],
    confidence: 'low',
  };

  SignalQualityReportSchema.parse(report); // internal-error guard only; never gates on metric values
  const path = writeReport('signal-quality', report);

  console.log(`[signal-quality] wrote ${path}`);
  console.log(`  FPAT-looking missing flow-pack: ${fpatIssuesMissing.length} issues, ${fpatPrsMissing.length} PRs`);
  if (fpatPrsMissing.length) console.log(`    PR candidates: ${fpatPrsMissing.map((p) => `#${p.number}`).join(' ')}`);
  if (fpatIssuesMissing.length) console.log(`    issue candidates: ${fpatIssuesMissing.map((i) => `#${i.number}`).join(' ')}`);
  console.log(`  flow-pack missing taxonomy: ${fpIssuesNoTaxonomy.length} issues, ${fpPrsNoTaxonomy.length} PRs`);
  console.log(`  run noise: cancelled ${runNoise.cancelledSuperseded}+/${runNoise.cancelledNotSuperseded}- | skipped ${runNoise.skippedSuperseded}+/${runNoise.skippedNotSuperseded}-  (+ = superseded by later success)`);
  console.log(`  gate false negatives: branch ${gateFalseNegatives.mergedBranchNamingViolations}, linkage ${gateFalseNegatives.mergedLinkageViolations}, commit ${gateFalseNegatives.mainCommitFormatViolations}`);
}

main().catch((err) => {
  console.error('[signal-quality] INTERNAL ERROR (not a metric failure):', err.message);
  process.exit(1);
});
