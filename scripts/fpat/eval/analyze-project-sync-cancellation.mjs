// scripts/fpat/eval/analyze-project-sync-cancellation.mjs
// FPAT Umbrella 2 / E3 (#73) — one-time read-only run-event/overlap analysis of the
// fpat-project-sync cancellation population (frozen baseline: 45/162 = 0.278, all 45
// superseded). NOT a sixth eval domain: it parses against the GENERIC DomainReportSchema
// envelope and deliberately adds nothing to lib/schema.mjs or metric-catalog.md.
//
// Hypothesis under test (workflow-reliability `inferred`, "supported, not established"):
// cancellations are GitHub pending-queue collapses. fpat-project-sync.yml serializes per
// issue (`concurrency.group: fpat-project-sync-<issue>`) with `cancel-in-progress: false`
// — GitHub never kills an in-progress run of the group, but at most ONE run may WAIT per
// group, so rapid `labeled` events on the same issue cancel older queued runs.
//
// Attribution ceiling (the reason this can BOUND but not establish causation): the API
// exposes neither a run's concurrency group nor its triggering issue, and queue-cancelled
// runs have no logs. The observable per-run proxy is therefore:
//   consistent-with-queue-collapse :=
//     cancelled AND >=1 OVERLAPPING same-event sibling run AND superseded by a later
//     same-event success (signal-quality's supersession definition).
// Window overlap uses [createdAt, updatedAt]; a queue-collapsed run never starts, so its
// window is its time spent queued (typically short — reported as a duration distribution).
//
// Usage:
//   node scripts/fpat/eval/analyze-project-sync-cancellation.mjs [--until 2026-06-07] [--limit 1000]
//
// Exit code: 0 on success (even if the hypothesis is refuted); non-zero only on tooling error.

import { listRuns } from './lib/gh.mjs';
import { distribution } from './lib/stats.mjs';
import { writeReport } from './lib/report.mjs';
import { DomainReportSchema } from './lib/schema.mjs';

const WORKFLOW = 'fpat-project-sync';

function arg(name, def = undefined) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return def;
  const next = process.argv[i + 1];
  return next && !next.startsWith('--') ? next : true;
}

const rate = (num, den) => (den ? Math.round((num / den) * 1000) / 1000 : null);

const overlaps = (a, b) => a.createdAt <= b.updatedAt && b.createdAt <= a.updatedAt;

const minutesBetween = (startISO, endISO) =>
  Math.round(((new Date(endISO) - new Date(startISO)) / 60000) * 100) / 100;

function analyzeCancelled(run, runs) {
  const siblings = runs.filter((r) => r.databaseId !== run.databaseId);
  const overlapping = siblings.filter((s) => overlaps(run, s));
  const overlappingSameEvent = overlapping.filter((s) => s.event === run.event);
  // Supersession mirrors audit-signal-quality.mjs: a LATER same-event success exists.
  const supersededBy = siblings
    .filter((s) => s.event === run.event && s.conclusion === 'success' && s.createdAt > run.createdAt)
    .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1))[0] ?? null;
  return {
    id: run.databaseId,
    event: run.event,
    window: { createdAt: run.createdAt, updatedAt: run.updatedAt },
    queuedMinutes: minutesBetween(run.createdAt, run.updatedAt),
    overlappingSiblingIds: overlapping.map((s) => s.databaseId),
    overlappingSameEventIds: overlappingSameEvent.map((s) => s.databaseId),
    supersededById: supersededBy?.databaseId ?? null,
    consistentWithQueueCollapse: overlappingSameEvent.length > 0 && supersededBy != null,
  };
}

async function main() {
  const until = arg('until', null);
  const limit = Number(arg('limit', 1000));

  // Date-only cutoffs include the whole day; full ISO strings are used as-is
  // (same convention as audit-workflow-reliability.mjs).
  const cutoff = until
    ? (/^\d{4}-\d{2}-\d{2}$/.test(until) ? `${until}T23:59:59.999Z` : until)
    : null;

  const allRuns = listRuns(`${WORKFLOW}.yml`, { limit });
  const possiblyTruncated = allRuns.length >= limit;
  const runs = cutoff ? allRuns.filter((r) => r.createdAt <= cutoff) : allRuns;

  const cancelled = runs
    .filter((r) => r.conclusion === 'cancelled')
    .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1))
    .map((r) => analyzeCancelled(r, runs));

  const consistent = cancelled.filter((c) => c.consistentWithQueueCollapse);
  const unexplained = cancelled.filter((c) => !c.consistentWithQueueCollapse);
  const summary = {
    runsAnalyzed: runs.length,
    cancelledTotal: cancelled.length,
    cancelRate: rate(cancelled.length, runs.length),
    withOverlap: cancelled.filter((c) => c.overlappingSiblingIds.length > 0).length,
    withSameEventOverlap: cancelled.filter((c) => c.overlappingSameEventIds.length > 0).length,
    superseded: cancelled.filter((c) => c.supersededById != null).length,
    consistentWithQueueCollapse: consistent.length,
    unexplained: unexplained.map(({ id, event, window, overlappingSiblingIds, supersededById }) =>
      ({ id, event, window, overlappingSiblingIds, supersededById })),
  };
  const queuedMinutes = distribution(cancelled.map((c) => c.queuedMinutes), 'minutes');

  // Verdict is data-driven and deliberately capped at "bounded": consistency of every
  // run with the mechanism, never causation (concurrency group is not API-exposed).
  const verdict = cancelled.length === 0
    ? 'no-cancellations-in-window'
    : unexplained.length === 0
      ? 'bounded-consistent'
      : consistent.length === 0
        ? 'refuted-in-window'
        : 'bounded-mixed';

  const generatedAt = new Date().toISOString();
  const report = {
    domain: 'project-sync-cancellation-analysis',
    schemaVersion: '1.0.0',
    generatedAt,
    scope: {
      label: 'flow-pack',
      umbrella: 'all-flow-pack',
      note:
        `One-time read-only overlap analysis of cancelled ${WORKFLOW} runs (#73). ` +
        'Mechanism under test: pending-queue collapse — .github/workflows/fpat-project-sync.yml ' +
        'serializes per issue with cancel-in-progress: false, so GitHub cancels only QUEUED ' +
        'runs, never in-progress ones. Run history is non-stationary and subject to retention; ' +
        'only asOf (and the optional --until window) makes the population reproducible. ' +
        'Not an eval domain: generic envelope, no schema/catalog entry.',
    },
    inputs: [
      `gh run list --workflow ${WORKFLOW}.yml --limit ${limit} --json databaseId,conclusion,status,createdAt,updatedAt,event`,
      '.github/workflows/fpat-project-sync.yml (concurrency block, read-only context)',
    ],
    metrics: {
      asOf: generatedAt,
      until: cutoff,
      limit,
      possiblyTruncated,
      summary,
      verdict,
      queuedMinutes,
      cancelledRuns: cancelled,
    },
    findings: [
      `Window (until ${cutoff ?? 'none — raw history'}): ${summary.cancelledTotal} cancelled of ${summary.runsAnalyzed} runs (rate ${summary.cancelRate}).`,
      `${summary.withSameEventOverlap}/${summary.cancelledTotal} cancelled runs overlap a same-event sibling; ${summary.superseded}/${summary.cancelledTotal} are superseded by a later same-event success.`,
      `${summary.consistentWithQueueCollapse}/${summary.cancelledTotal} cancelled runs are consistent with queue collapse (overlap AND supersession); ${summary.unexplained.length} unexplained.`,
      `Verdict: ${verdict}. Queued-window distribution (minutes): mean ${queuedMinutes.mean}, max ${queuedMinutes.max}.`,
    ],
    inferred: [
      'Consistent-with-queue-collapse runs match the mechanism cancel-in-progress: false permits: ' +
        'rapid same-issue label events queue multiple runs in one concurrency group and GitHub ' +
        'collapses the wait queue. Short queued windows further support never-started cancellation.',
      'Unexplained cancellations (no same-event overlap or no superseder) are NOT evidence against ' +
        'queue collapse elsewhere — they are individually unattributable from run data alone.',
    ],
    proven: [
      'Overlap and supersession relations are exact set computations over the listed run windows (run ids in metrics.cancelledRuns).',
      'The workflow has had cancel-in-progress: false since its original wiring (7feef2e) — cancellations cannot be in-progress kills by GitHub concurrency.',
    ],
    notProven: [
      'Causation: the GitHub API exposes neither a run\'s concurrency group nor its triggering issue, and queue-cancelled runs have no logs — same-event overlap is a proxy, so the verdict is bounded, never established.',
      'That any cancellation lost work (signal-quality measures supersession; this analysis does not re-judge it).',
      'Whether FPAT IMPROVED delivery — single baseline (n=1), no comparison cohort.',
    ],
    confidence: 'medium',
  };

  DomainReportSchema.parse(report); // internal-error guard only; never gates on metric values
  const path = writeReport('project-sync-cancellation', report);

  console.log(`[project-sync-cancellation] wrote ${path}`);
  console.log(`  asOf: ${generatedAt}${cutoff ? `  until: ${cutoff}` : ''}`);
  console.log(`  cancelled: ${summary.cancelledTotal}/${summary.runsAnalyzed} (rate ${summary.cancelRate})`);
  console.log(`  same-event overlap ${summary.withSameEventOverlap} | superseded ${summary.superseded} | consistent ${summary.consistentWithQueueCollapse} | unexplained ${summary.unexplained.length}`);
  console.log(`  verdict: ${verdict}`);
  if (possiblyTruncated) console.log(`  WARNING possibly truncated at --limit ${limit}`);
}

main().catch((err) => {
  console.error('[project-sync-cancellation] INTERNAL ERROR (not a metric failure):', err.message);
  process.exit(1);
});
