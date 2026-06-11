// scripts/fpat/eval/audit-throughput.mjs
// FPAT Umbrella 2 — Phase-1 throughput audit. Read-only. Raw metrics, no thresholds, no gating.
//
// Scope (Decision 1): "all closed flow-pack issues" is used as a PROXY for Umbrella #1.
// The exact Umbrella #1 subtree boundary is NOT proven by this run.
//
// Usage:
//   node scripts/fpat/eval/audit-throughput.mjs \
//     [--label flow-pack] [--owner w7-mgfcode] [--repo cvforge-ai] \
//     [--prior-issues 37] [--prior-prs 25] [--with-subissues]
//
// Exit code: 0 on success (even if metrics are "low"); non-zero only on internal/tooling error.

import { listClosedIssues, listMergedPRs, subIssueCount } from './lib/gh.mjs';
import { distribution, hoursBetween } from './lib/stats.mjs';
import { writeReport } from './lib/report.mjs';
import { ThroughputReportSchema } from './lib/schema.mjs';

function arg(name, def = undefined) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return def;
  const next = process.argv[i + 1];
  return next && !next.startsWith('--') ? next : true;
}

function typeOf(labels) {
  const l = (labels || []).map((x) => x.name);
  if (l.includes('type:umbrella')) return 'umbrella';
  if (l.includes('type:epic')) return 'epic';
  if (l.includes('type:sub-issue')) return 'sub-issue';
  return 'other';
}

async function main() {
  const label = arg('label', 'flow-pack');
  const owner = arg('owner', 'w7-mgfcode');
  const repo = arg('repo', 'cvforge-ai');
  const priorIssues = arg('prior-issues') ? Number(arg('prior-issues')) : null;
  const priorPrs = arg('prior-prs') ? Number(arg('prior-prs')) : null;
  const withSub = arg('with-subissues') === true;

  const issues = listClosedIssues({ label });
  const prs = listMergedPRs({});
  const flowPrs = prs.filter((p) => (p.labels || []).some((x) => x.name === label));

  const byTypeLabel = {};
  for (const it of issues) {
    const t = typeOf(it.labels);
    byTypeLabel[t] = (byTypeLabel[t] || 0) + 1;
  }

  const issueCycle = distribution(issues.map((i) => hoursBetween(i.createdAt, i.closedAt)));
  const prMerge = distribution(flowPrs.map((p) => hoursBetween(p.createdAt, p.mergedAt)));

  let epicSubIssueCounts = [];
  if (withSub) {
    const epics = issues.filter((i) => typeOf(i.labels) === 'epic');
    for (const e of epics) {
      const c = subIssueCount(e.number, owner, repo);
      if (c !== null) epicSubIssueCounts.push({ epic: e.number, title: e.title, subIssueCount: c });
    }
  }

  const recomputedClosedIssues = issues.length;
  const recomputedMergedPRs = flowPrs.length;

  const report = {
    domain: 'throughput',
    schemaVersion: '1.0.0',
    generatedAt: new Date().toISOString(),
    scope: {
      label,
      umbrella: 'all-flow-pack',
      note:
        'PROXY BOUNDARY: scope = all CLOSED issues carrying the flow-pack label, used as a Phase-1 ' +
        'proxy for "Umbrella #1". This is an explicit assumption, not a verified umbrella subtree.',
    },
    inputs: [
      `gh issue list --state closed --label ${label} --json number,title,createdAt,closedAt,labels,milestone,state`,
      'gh pr list --state merged --json number,title,createdAt,mergedAt,headRefName,labels,milestone',
      withSub ? 'gh api graphql (subIssues.totalCount per epic) [best-effort]' : '(sub-issue counts deferred)',
    ],
    metrics: {
      closedIssues: issues.length,
      mergedPRs: flowPrs.length,
      issueToPrRatio: flowPrs.length ? Math.round((issues.length / flowPrs.length) * 100) / 100 : null,
      byTypeLabel,
      issueCycleTimeHours: issueCycle,
      prMergeTimeHours: prMerge,
      epicSubIssueCounts,
      baselineRecompute: {
        priorClaimedClosedIssues: priorIssues,
        priorClaimedMergedPRs: priorPrs,
        recomputedClosedIssues,
        recomputedMergedPRs,
        matchesPriorClaim:
          (priorIssues === null || priorIssues === recomputedClosedIssues) &&
          (priorPrs === null || priorPrs === recomputedMergedPRs),
      },
    },
    findings: [
      `Recomputed ${recomputedClosedIssues} closed flow-pack issues and ${recomputedMergedPRs} merged flow-pack PRs.`,
      `Median issue cycle time ${issueCycle.median ?? 'n/a'}h; median PR merge time ${prMerge.median ?? 'n/a'}h.`,
    ],
    inferred: [
      'The exact Umbrella #1 subtree boundary is NOT proven by this run; "all-flow-pack" is a proxy.',
      withSub ? 'Per-epic sub-issue counts via hierarchy API (best-effort, may be incomplete).'
              : 'Sub-issue counts deferred (not computed in this run).',
    ],
    proven: [
      'Delivery volume and timing for flow-pack work can be recomputed deterministically from GitHub state.',
    ],
    notProven: [
      'Whether FPAT IMPROVED delivery — this is a single baseline (n=1); no comparison cohort exists.',
      'Causes of any timing outliers; root causes are not established here.',
      'The precise Umbrella #1 boundary (board/hierarchy scope intentionally not solved in Phase-1).',
    ],
    confidence: 'medium',
  };

  ThroughputReportSchema.parse(report); // internal-error guard only; never gates on metric values
  const path = writeReport('throughput', report);

  console.log(`[throughput] wrote ${path}`);
  console.log(`  closed flow-pack issues: ${report.metrics.closedIssues}` +
    (priorIssues !== null ? ` (prior claim: ${priorIssues}, match: ${report.metrics.baselineRecompute.matchesPriorClaim})` : ''));
  console.log(`  merged flow-pack PRs:    ${report.metrics.mergedPRs}` +
    (priorPrs !== null ? ` (prior claim: ${priorPrs})` : ''));
  console.log(`  issue/PR ratio: ${report.metrics.issueToPrRatio}`);
  console.log(`  issue cycle (h): median ${issueCycle.median} p90 ${issueCycle.p90} max ${issueCycle.max} (n=${issueCycle.count})`);
  console.log(`  PR merge   (h): median ${prMerge.median} p90 ${prMerge.p90} max ${prMerge.max} (n=${prMerge.count})`);
  console.log(`  byType: ${JSON.stringify(report.metrics.byTypeLabel)}`);
}

main().catch((err) => {
  console.error('[throughput] INTERNAL ERROR (not a metric failure):', err.message);
  process.exit(1);
});
