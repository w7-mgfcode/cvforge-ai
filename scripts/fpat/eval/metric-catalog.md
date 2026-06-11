# FPAT Eval Metric Catalog (cycle-0)

One durable reference enumerating every metric across the 5 eval domains —
**throughput, planning-accuracy, workflow-reliability, signal-quality,
board-consistency** — each with its schema location, source report path, and
frozen cycle-0 reference in `docs/reports/2026-06-11/baseline-manifest.json`.

Stance (verbatim from `scripts/fpat/eval/README.md`):

> Read-only, deterministic. Raw metrics only — no thresholds, no pass/fail, never a CI gate.
> All audits exit `0` even on "bad" numbers; non-zero means a tooling error only.

This catalog carries **references, not values**: frozen numbers live only in the
baseline manifest, live numbers only in the dated reports. The **Caveat** column
repeats the qualifiers recorded at freeze time (era-mixed, non-stationary,
heuristic, degraded-null); keep them attached whenever a metric is quoted.

**Maintenance:** rows mirror `scripts/fpat/eval/lib/schema.mjs` and the baseline
manifest. Any change to either must update this catalog in the same change
(lock-step contract formalized in #79; consistency-guard coverage in #80).

## Shared report envelope

Every domain report validates against `DomainReportSchema`
(`scripts/fpat/eval/lib/schema.mjs`): `domain`, `schemaVersion`, `generatedAt`,
`scope`, `inputs`, `metrics`, `findings`, `inferred`, `proven`, `notProven`,
`confidence`. Shared shapes: `DistributionSchema` (count/min/max/mean/median/p90,
unit hours), `WorkflowTallySchema` (total/success/skipped/cancelled/failure/other,
cancelRate, avgDurationHours), `ItemRefSchema` / `BoardItemRefSchema` (item
references). The baseline manifest reuses the same envelope with
`domain: "baseline-manifest"`.

## Domain 1 — throughput

Schema: `ThroughputMetricsSchema` · Source report: `docs/reports/2026-06-07/throughput.json` · Audit: `audit-throughput.mjs`

| Metric (schema field) | Source path | Frozen cycle-0 reference (`baseline-manifest.json`) | Caveat |
|---|---|---|---|
| `closedIssues`, `mergedPRs`, `issueToPrRatio`, `byTypeLabel` | `throughput.json` → `metrics.closedIssues`, `.mergedPRs`, `.issueToPrRatio`, `.byTypeLabel` | `metrics.officialBaseline` (33 / 21 — the only benchmark baseline) | — |
| `issueCycleTimeHours` (Distribution) | `throughput.json` → `metrics.issueCycleTimeHours` | `metrics.cycleTimes.issueCycleTimeHours` | — |
| `prMergeTimeHours` (Distribution) | `throughput.json` → `metrics.prMergeTimeHours` | `metrics.cycleTimes.prMergeTimeHours` | — |
| `epicSubIssueCounts` | `throughput.json` → `metrics.epicSubIssueCounts` | not frozen as its own block — fan-out frozen under `metrics.planningAccuracy.epicFanOut` | — |
| `baselineRecompute` | `throughput.json` → `metrics.baselineRecompute` + `docs/reports/2026-06-07/throughput-mismatch-analysis.md` | `metrics.historicalEnvelope` | NON-BENCHMARK — broader activity envelope only; never compare against it |

## Domain 2 — planning-accuracy

Schema: `PlanningAccuracyMetricsSchema` · Source report: `docs/reports/2026-06-11/planning-accuracy.json` · Audit: `audit-planning-accuracy.mjs`

| Metric (schema field) | Source path | Frozen cycle-0 reference | Caveat |
|---|---|---|---|
| `branchNaming` (total/compliant/rate/violations) | `planning-accuracy.json` → `metrics.branchNaming` | `metrics.planningAccuracy.branchNaming` | merged-PR `headRefName` is the durable branch record (branches deleted post-merge) |
| `commitFormat` (total/compliant/rate/violations) | `planning-accuracy.json` → `metrics.commitFormat` | `metrics.planningAccuracy.commitFormat` | ERA-MIXED — pre-FPAT-convention commits count as violations; split by era before any cycle-over-cycle comparison |
| `epicFanOut` (epicsChecked/exactlyFive/perEpic) | `planning-accuracy.json` → `metrics.epicFanOut` | `metrics.planningAccuracy.epicFanOut` | — |
| `prLinkage` (total/withClosingKeyword/rate/violations) | `planning-accuracy.json` → `metrics.prLinkage` | `metrics.planningAccuracy.prLinkage` | — |

## Domain 3 — workflow-reliability

Schema: `WorkflowReliabilityMetricsSchema` · Source report: `docs/reports/2026-06-11/workflow-reliability.json` · Audit: `audit-workflow-reliability.mjs`

Domain-wide caveat: **NON-STATIONARY** — run history grows; compare only
windowed-to-windowed at a pinned `asOf`/`--until`. The historical 56/14/30 tally
is a stale snapshot, never a benchmark.

| Metric (schema field) | Source path | Frozen cycle-0 reference | Caveat |
|---|---|---|---|
| `asOf`, `until`, `limitPerWorkflow`, `possiblyTruncated` | `workflow-reliability.json` → `metrics.asOf` etc. | `metrics.workflowReliability.asOf`, `.until` | non-stationary (window pin) |
| `raw.aggregate` (WorkflowTally) | `workflow-reliability.json` → `metrics.raw.aggregate` | `metrics.workflowReliability.rawAggregate` | non-stationary |
| `raw.perWorkflow` (WorkflowTally each) | `workflow-reliability.json` → `metrics.raw.perWorkflow` | `metrics.workflowReliability.perWorkflowRaw` | non-stationary |
| `windowed.aggregate` / `windowed.perWorkflow` | `workflow-reliability.json` → `metrics.windowed` | `metrics.workflowReliability.windowedAggregate` (aggregate only frozen) | non-stationary |
| `projectSyncCancellation` (cancelled/total/rate) | `workflow-reliability.json` → `metrics.projectSyncCancellation` | `metrics.workflowReliability.projectSyncCancellation` | cancellation cause analysis is #73's scope — count is data, not a verdict |
| `runsTimeline` (per-run records) | `workflow-reliability.json` → `metrics.runsTimeline` | not frozen — plumbing for the second-stage signal-quality audit, not a baseline metric | non-stationary |

## Domain 4 — board-consistency

Schema: `BoardConsistencyMetricsSchema` · Source report: `docs/reports/2026-06-11/board-consistency.json` · Audit: `audit-board-consistency.mjs`

Domain-wide caveat: **DEGRADED-NULL** — degraded-first design; every
board-derived block is nullable. `null` means *not measured* (no project
access), **never** "zero problems". Never compare a degraded run to a live run.

| Metric (schema field) | Source path | Frozen cycle-0 reference | Caveat |
|---|---|---|---|
| `access` (tokenSource/degraded/probeError) | `board-consistency.json` → `metrics.access` | `metrics.boardConsistency.access` | records the degraded-null precondition itself |
| `board` (number/title/owner/visibility/itemCount/url) | `board-consistency.json` → `metrics.board` | `metrics.boardConsistency.board` | degraded-null |
| `fields` (present/missing/optionDrift) | `board-consistency.json` → `metrics.fields` | `metrics.boardConsistency.fields` | degraded-null |
| `membership` (flowPackTotal/onBoard/flowPackNotOnBoard/boardItemsNotFlowPack) | `board-consistency.json` → `metrics.membership` | `metrics.boardConsistency.membership` | degraded-null; membership uses the CURRENT `flow-pack` label (no-retro-labeling honored by construction) |
| `labelFieldSync` (itemsChecked/mismatches/missingFieldValues) | `board-consistency.json` → `metrics.labelFieldSync` | `metrics.boardConsistency.labelFieldSync` | degraded-null; item-kind split (issue vs PR) NOT measured at cycle-0 — #72's scope, prerequisite to any sync-trigger decision |
| `statusCoherence` (itemsChecked/closedNotDone/doneButOpen) | `board-consistency.json` → `metrics.statusCoherence` | `metrics.boardConsistency.statusCoherence` | degraded-null; closed-not-Done is LEGAL under the designed one-directional sync — not drift |
| `scoreGate` (epicsChecked/missingScore/belowGateOffBacklog) | `board-consistency.json` → `metrics.scoreGate` | `metrics.boardConsistency.scoreGate` | degraded-null; the epic Score ship-gate signal is reported, never enforced — the gate value lives in the board spec, not in this suite |

## Domain 5 — signal-quality

Schema: `SignalQualityMetricsSchema` · Source report: `docs/reports/2026-06-11/signal-quality.json` · Audit: `audit-signal-quality.mjs` (second stage — consumes the planning-accuracy and workflow-reliability reports)

| Metric (schema field) | Source path | Frozen cycle-0 reference | Caveat |
|---|---|---|---|
| `labelCoverage.fpatLookingMissingFlowPack` | `signal-quality.json` → `metrics.labelCoverage.fpatLookingMissingFlowPack` | `metrics.signalQuality.labelCoverage.fpatLookingMissingFlowPack` | HEURISTIC — candidates only; human confirmation required; never auto-acted on |
| `labelCoverage.flowPackMissingTaxonomy` | `signal-quality.json` → `metrics.labelCoverage.flowPackMissingTaxonomy` | `metrics.signalQuality.labelCoverage.flowPackMissingTaxonomy` | foundation-era taxonomy drift left as measured signal (no-retro-labeling) |
| `runNoise` (cancelled/skipped × superseded/not) | `signal-quality.json` → `metrics.runNoise` | `metrics.signalQuality.runNoise` | derived from `runsTimeline` — inherits non-stationary |
| `gateFalseNegatives` (branch/linkage/commit violations that merged) | `signal-quality.json` → `metrics.gateFalseNegatives` | `metrics.signalQuality.gateFalseNegatives` | commit-format component inherits era-mixed |
| `sources` (planningReport/reliabilityReport paths) | `signal-quality.json` → `metrics.sources` | not frozen — provenance pointers, not a metric | — |

## Manifest-only blocks (decisions & rules, not domain metrics)

These live in the baseline manifest's `metrics.*` alongside the frozen values;
they are recorded decisions and comparison discipline, not audit outputs.

| Block | Frozen reference | What it is | Source / refs |
|---|---|---|---|
| `labelGapDecisions` | `metrics.labelGapDecisions` | 2026-06-11 NO-RETRO-LABELING decision: drift is measured, not manually fixed; preserves the official baseline | `eval/README.md` §1–2 · `docs/reports/2026-06-07/throughput-mismatch-analysis.md` §5–6 · `board-consistency.json` `scope.note` |
| `parkedDecisions` | `metrics.parkedDecisions` | 3 parked board mutations with frozen before-values (PR-event sync, epic-score backfill, retro auto-add) | `baseline-manifest.json`; each rule: if approved, date the change and compare pre/post populations separately |
| `comparisonRules` | `metrics.comparisonRules` | The 8 rules any cycle-over-cycle comparison must follow (official-baseline-only, pinned windows, no degraded-vs-live, era split, counts-with-rates, dated mutations, no n=1 claims, current-label membership) | `baseline-manifest.json` |

## What none of this proves

Per `eval/README.md` §2 and the manifest's `notProven`: not that FPAT *improved*
delivery (n=1, no comparison cohort — never claim it), not *why* any frozen
drift value arose, and not that heuristic label candidates should carry
`flow-pack` (human confirmation required).
