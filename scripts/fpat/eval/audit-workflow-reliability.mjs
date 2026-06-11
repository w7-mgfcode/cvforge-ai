// scripts/fpat/eval/audit-workflow-reliability.mjs
// FPAT Umbrella 2 — Phase-2 workflow-reliability audit (domain 3). Read-only. Raw metrics,
// no thresholds, no gating. Per-workflow + aggregate success/skipped/cancelled/failure
// tallies, average run duration, and the project-sync cancellation rate specifically.
//
// Run history is NON-STATIONARY: totals drift as new runs land. The report therefore
// always records `asOf`, and `--until <YYYY-MM-DD|ISO>` additionally pins a reproducible
// windowed tally (runs with createdAt <= cutoff). Raw current tally is always included.
//
// Usage:
//   node scripts/fpat/eval/audit-workflow-reliability.mjs [--until 2026-06-07] [--limit 1000]
//
// Exit code: 0 on success (even if reliability is "low"); non-zero only on tooling error.

import { listRuns } from './lib/gh.mjs';
import { distribution, hoursBetween } from './lib/stats.mjs';
import { writeReport } from './lib/report.mjs';
import { WorkflowReliabilityReportSchema } from './lib/schema.mjs';

const WORKFLOWS = ['fpat-project-sync', 'fpat-blocked-sweep', 'fpat-rollup-gate', 'fpat-validate'];

function arg(name, def = undefined) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return def;
  const next = process.argv[i + 1];
  return next && !next.startsWith('--') ? next : true;
}

const rate = (num, den) => (den ? Math.round((num / den) * 1000) / 1000 : null);

function tally(runs) {
  const counts = { success: 0, skipped: 0, cancelled: 0, failure: 0, other: 0 };
  for (const r of runs) {
    const c = r.conclusion || '';
    if (c in counts) counts[c] += 1;
    else counts.other += 1;
  }
  const durations = distribution(runs.map((r) => hoursBetween(r.createdAt, r.updatedAt)));
  return {
    total: runs.length,
    ...counts,
    cancelRate: rate(counts.cancelled, runs.length),
    avgDurationHours: durations.mean,
  };
}

function tallySet(runsByWorkflow) {
  const perWorkflow = {};
  let all = [];
  for (const [wf, runs] of Object.entries(runsByWorkflow)) {
    perWorkflow[wf] = tally(runs);
    all = all.concat(runs);
  }
  return { perWorkflow, aggregate: tally(all) };
}

async function main() {
  const until = arg('until', null);
  const limit = Number(arg('limit', 1000));

  // Date-only cutoffs include the whole day; full ISO strings are used as-is.
  const cutoff = until
    ? (/^\d{4}-\d{2}-\d{2}$/.test(until) ? `${until}T23:59:59.999Z` : until)
    : null;

  const runsByWorkflow = {};
  const possiblyTruncated = [];
  for (const wf of WORKFLOWS) {
    const runs = listRuns(`${wf}.yml`, { limit });
    runsByWorkflow[wf] = runs;
    if (runs.length >= limit) possiblyTruncated.push(wf);
  }

  const raw = tallySet(runsByWorkflow);

  let windowed = null;
  if (cutoff) {
    const windowedRuns = {};
    for (const [wf, runs] of Object.entries(runsByWorkflow)) {
      windowedRuns[wf] = runs.filter((r) => r.createdAt <= cutoff);
    }
    windowed = tallySet(windowedRuns);
  }

  const ps = raw.perWorkflow['fpat-project-sync'] || { cancelled: 0, total: 0 };
  const projectSyncCancellation = {
    cancelled: ps.cancelled,
    total: ps.total,
    rate: rate(ps.cancelled, ps.total),
  };

  const runsTimeline = {};
  for (const [wf, runs] of Object.entries(runsByWorkflow)) {
    runsTimeline[wf] = runs.map((r) => ({
      id: r.databaseId,
      conclusion: r.conclusion || '',
      createdAt: r.createdAt,
      event: r.event,
    }));
  }

  const generatedAt = new Date().toISOString();
  const report = {
    domain: 'workflow-reliability',
    schemaVersion: '1.0.0',
    generatedAt,
    scope: {
      label: 'flow-pack',
      umbrella: 'all-flow-pack',
      note:
        `Per-workflow run reliability for the four FPAT workflows (${WORKFLOWS.join(', ')}). ` +
        'Run history is non-stationary — only the asOf timestamp (and the optional --until window) ' +
        'makes a tally reproducible. The historical 56/14/30 figure is a stale point-in-time ' +
        'snapshot, never a benchmark.',
    },
    inputs: WORKFLOWS.map(
      (wf) => `gh run list --workflow ${wf}.yml --limit ${limit} --json databaseId,conclusion,status,createdAt,updatedAt,event`,
    ),
    metrics: {
      asOf: generatedAt,
      until: cutoff,
      limitPerWorkflow: limit,
      possiblyTruncated,
      raw,
      windowed,
      projectSyncCancellation,
      runsTimeline,
    },
    findings: [
      `Raw aggregate (asOf ${generatedAt}): ${raw.aggregate.success} success / ${raw.aggregate.skipped} skipped / ` +
        `${raw.aggregate.cancelled} cancelled / ${raw.aggregate.failure} failure (total ${raw.aggregate.total}).`,
      `project-sync cancellation rate: ${projectSyncCancellation.cancelled}/${projectSyncCancellation.total} = ${projectSyncCancellation.rate}.`,
      `Cancellations outside fpat-project-sync: ${raw.aggregate.cancelled - projectSyncCancellation.cancelled}.`,
      windowed
        ? `Windowed (createdAt <= ${cutoff}): ${windowed.aggregate.success} success / ${windowed.aggregate.skipped} skipped / ` +
          `${windowed.aggregate.cancelled} cancelled / ${windowed.aggregate.failure} failure (total ${windowed.aggregate.total}).`
        : 'No --until window given; raw tally only.',
    ],
    inferred: [
      'Cancellation concentration on fpat-project-sync is consistent with the concurrency hypothesis; ' +
        'root cause is to be confirmed via run event/overlap analysis (audit C), not assumed here.',
    ],
    proven: [
      'Per-workflow reliability tallies are reproducible from GitHub run history given a pinned asOf/--until.',
    ],
    notProven: [
      'Root cause of cancellations (concurrency supported but not confirmed here).',
      'Whether cancellations are harmful vs benign superseded re-runs (decomposed in the signal-quality audit).',
      'Whether FPAT IMPROVED delivery — single baseline (n=1), no comparison cohort.',
    ],
    confidence: 'medium',
  };

  WorkflowReliabilityReportSchema.parse(report); // internal-error guard only; never gates on metric values
  const path = writeReport('workflow-reliability', report);

  console.log(`[workflow-reliability] wrote ${path}`);
  console.log(`  asOf: ${generatedAt}${cutoff ? `  until: ${cutoff}` : ''}`);
  for (const wf of WORKFLOWS) {
    const t = raw.perWorkflow[wf];
    console.log(`  ${wf}: total ${t.total} | success ${t.success} skipped ${t.skipped} cancelled ${t.cancelled} failure ${t.failure} other ${t.other} | cancelRate ${t.cancelRate} | avg ${t.avgDurationHours}h`);
  }
  console.log(`  aggregate: total ${raw.aggregate.total} | success ${raw.aggregate.success} skipped ${raw.aggregate.skipped} cancelled ${raw.aggregate.cancelled} failure ${raw.aggregate.failure}`);
  if (windowed) {
    console.log(`  windowed aggregate (<= ${cutoff}): total ${windowed.aggregate.total} | success ${windowed.aggregate.success} skipped ${windowed.aggregate.skipped} cancelled ${windowed.aggregate.cancelled} failure ${windowed.aggregate.failure}`);
  }
  if (possiblyTruncated.length) console.log(`  WARNING possibly truncated at --limit ${limit}: ${possiblyTruncated.join(', ')}`);
}

main().catch((err) => {
  console.error('[workflow-reliability] INTERNAL ERROR (not a metric failure):', err.message);
  process.exit(1);
});
