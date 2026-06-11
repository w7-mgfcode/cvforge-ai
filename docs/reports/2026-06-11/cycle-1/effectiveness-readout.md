# Cycle-1 Effectiveness Readout — windowed vs the 33/21 baseline

> Epic #75 · Umbrella #70 · 2026-06-11. The first legal cycle-over-cycle comparison of the
> FPAT eval suite. **Deltas below are data, not verdicts** — see the
> [No-verdict disclaimer](#no-verdict-disclaimer--carried-notproven) before reading anything
> into a direction.

## Comparison basis (legality preamble)

- **Benchmark**: `metrics.officialBaseline` and the other frozen blocks of
  `docs/reports/2026-06-11/baseline-manifest.json` — **only**. The `historicalEnvelope`
  (37/25) and the stale 56/14/30 run tally are never compared against
  (`comparisonRules[0]`).
- **Instruments**: the identical cycle-0 commands, unmodified
  (`comparisonRules[1]`); cycle-1 outputs live in `docs/reports/2026-06-11/cycle-1/`
  (shipped by #117 / PR #122). Workflow-reliability is compared
  **windowed-to-windowed at stated dates**: baseline `--until 2026-06-07`, cycle-1
  `--until 2026-06-11`.
- **Live-to-live**: both board-consistency runs are non-degraded
  (baseline `access.degraded: false` per the manifest; cycle-1
  `metrics.access.degraded: false` in `cycle-1/board-consistency.json`) — rule
  `comparisonRules[2]` holds.
- **Populations are cumulative**, not disjoint: every audit measures the all-time
  population at its `asOf`. Cycle-0 froze at 2026-06-07/2026-06-11; cycle-1 measures
  the same populations grown by the umbrella-#70 delivery. Deltas (`cycle-1 − baseline`)
  isolate the post-baseline window where arithmetic allows; distribution stats
  (medians, p90s) do **not** subtract and are reported with that caveat.
- **No mid-window mutations**: all three `parkedDecisions` frozen before-values are
  unchanged (verified below), and the 2026-06-11 no-retro-labeling decision stands —
  no dated-mutation split is required (`comparisonRules[5]`), and board membership is
  defined by the **current** `flow-pack` label (`comparisonRules[7]`).

## 1. Throughput

Baseline: `baseline-manifest.json` `metrics.officialBaseline` + `metrics.cycleTimes` ·
Cycle-1: `cycle-1/throughput.json` `metrics.*`

| Metric | Cycle-0 (asOf 2026-06-07) | Cycle-1 (asOf 2026-06-11) | Delta |
|---|---|---|---|
| Closed `flow-pack` issues | 33 | 57 | +24 |
| Merged `flow-pack` PRs | 21 | 47 | +26 |
| Issue/PR ratio | 1.57 | 1.21 | −0.36 |
| byType: sub-issue / epic / umbrella | 27 / 5 / 1 | 47 / 9 / 1 | +20 / +4 / 0 |
| Issue cycle time (h): median / p90 / max | 0.86 / 81.36 / 87.17 (n=33) | 0.64 / 9.93 / 87.17 (n=57) | cumulative — see caveat |
| PR merge time (h): median / p90 / max | 0.02 / 0.27 / 2.30 (n=21) | 0.02 / 0.20 / 2.30 (n=47) | cumulative — see caveat |

Caveat: the cycle-time distributions are computed over the cumulative population, so the
cycle-1 rows mix both eras; the p90 shift reflects 24 fast post-baseline issues diluting the
early outliers, not a re-measurement of the old ones (max is unchanged at 87.17 — same
foundation-era outlier).

## 2. Planning accuracy

Baseline: `baseline-manifest.json` `metrics.planningAccuracy` ·
Cycle-1: `cycle-1/planning-accuracy.json` `metrics.*`

| Contract | Cycle-0 | Cycle-1 | Delta (post-baseline window) |
|---|---|---|---|
| Branch naming | 22/25 (0.88) | 43/52 (0.827) | +21 compliant / +6 violations of +27 PRs |
| Commit format | 26/33 (0.788, **era-mixed**) | 53/60 (0.883) | **era split below** |
| Epic fan-out exactly-5 | 4/6 | 9/11 | +5/+5 — every umbrella-#70 epic (#71–#75) is 5/5 |
| PR linkage `Closes #` | 23/25 (0.92) | 43/52 (0.827) | +20 compliant / +7 violations of +27 PRs |

### Era-split commit-format comparison (`comparisonRules[3]`)

The cycle-1 violation list (`cycle-1/planning-accuracy.json`
`metrics.commitFormat.violations`) is **byte-identical** to the cycle-0 list
(`docs/reports/2026-06-11/planning-accuracy.json`): the same 4 GitHub default merge-commit
subjects (PRs #12, #22, #23, #24) and the same 3 pre-/early-convention product commits.
The FPAT commit convention landed 2026-06-01 in `e14a8f2`
(`chore(scripts): land fpat foundation + context-engineering layer (#2)`).

| Era | Commits | Compliant | Rate |
|---|---|---|---|
| Baseline-era population (frozen, era-mixed) | 33 | 26 | 0.788 |
| Post-baseline window (cycle-1 − cycle-0) | 27 | 27 | 1.00 — zero new violations |
| Cycle-1 cumulative | 60 | 53 | 0.883 |

### New branch/linkage violations are localized

The +6 branch violations (PRs #64–#69) and 6 of the +7 linkage violations are the
inter-umbrella prep work of 2026-06-05..07 (`chore/fpat-phase-2-eval-suite`,
`chore/fpat-baseline-manifest`, `chore/fpat-eval-fixtures`, …) merged from non-issue-linked
branches without closing keywords; the frozen #14/#24/#61/#63 carry-overs are unchanged.
The 7th new linkage violation is PR #103 — an umbrella-#70-window Sourcery-review follow-up
whose body says `Refs #73` deliberately, because its issue (#97) was already closed; its
branch (`fix/scripts-97-arg-validation`) is compliant. All other umbrella-#70 sub-issue PRs
(#82–#122) are fully compliant on both contracts. Counts, not verdicts: see disclaimer.

## 3. Workflow reliability (windowed-to-windowed)

Baseline: `baseline-manifest.json` `metrics.workflowReliability.windowedAggregate`
(`--until 2026-06-07T23:59:59.999Z`) ·
Cycle-1: `cycle-1/workflow-reliability.json` `metrics.windowed.aggregate`
(`--until 2026-06-11T23:59:59.999Z`)

| Windowed aggregate | Cycle-0 | Cycle-1 | Delta |
|---|---|---|---|
| Total runs | 256 | 490 | +234 |
| Success / skipped / cancelled / failure | 154 / 56 / 45 / 1 | 276 / 76 / 137 / 1 | +122 / +20 / +92 / 0 |
| Cancel rate | 45/256 (0.176) | 137/490 (0.280) | +0.104 |
| `fpat-project-sync` cancellations | 45/162 (0.278) | 137/316 (0.434) | +92/+154 (0.597 within the window) |

The cancellation growth is concentrated entirely on `fpat-project-sync` (the other three
workflows remain at 0 cancellations). The E3 one-time analysis
(`docs/reports/2026-06-11/e3-cancellation-analysis/`, 45/45 `bounded-consistent`) covered
the baseline population; the cycle-1 signal-quality decomposition (next section) finds all
137 cancellations superseded by a later same-event success — the same benign-looking
shape, at higher volume from the 36-issue umbrella-#70 burst.

## 4. Signal quality

Baseline: `baseline-manifest.json` `metrics.signalQuality` ·
Cycle-1: `cycle-1/signal-quality.json` `metrics.*`

| Signal | Cycle-0 | Cycle-1 | Delta |
|---|---|---|---|
| FPAT-looking missing `flow-pack` (heuristic) | 2 issues (#29, #30) + 2 PRs (#12, #14) | 2 issues (#29, #30) + 3 PRs (#12, #14, **#64**) | +1 PR candidate |
| `flow-pack` missing taxonomy labels | 12 issues + 1 PR | 13 issues + 6 PRs | +1 issue, +5 PRs |
| Cancelled runs: superseded / not | 45 / 0 | 137 / 0 | +92 / 0 — still none unsuperseded |
| Skipped runs: superseded / not | 28 / 28 | 49 / 27 | +21 / −1 |
| Gate false negatives: branch / linkage / commit | 3 / 2 / 7 | 9 / 9 / 7 | +6 / +7 / 0 |

The gate-false-negative growth mirrors §2 exactly (same PRs #61/#63–#69); commit-format
false negatives are flat at the 7 frozen-era subjects. Heuristic candidates remain
candidates: human confirmation required, never auto-labeled
(`cycle-1/signal-quality.json` `inferred`).

## 5. Board consistency

Baseline: `baseline-manifest.json` `metrics.boardConsistency` ·
Cycle-1: `cycle-1/board-consistency.json` `metrics.*` (live, `access.degraded: false`)

| Check | Cycle-0 | Cycle-1 | Delta |
|---|---|---|---|
| Board items | 53 | 109 | +56 |
| Field catalog: missing / option drift | 0 / 0 | 0 / 0 | 0 |
| Membership: on board / `flow-pack` total | 53/55 | 109/111 | gap **identical**: PRs #22, #23 |
| Label↔field mismatches | 0 | 0 | 0 |
| Labeled-but-unset field values | 55 (kind split **not measured**) | 118 — Issue 0/64 checked, PR 118/45 checked | split is additive E2 capability (#72); baseline stays total-only |
| Closed-not-Done (legal under one-directional sync) | 20 | 46 | +26 |
| Epics missing Score | 2/5 (#2, #3) | 2/10 (#2, #3) | all 5 umbrella-#70 epics carry Score |
| Below ship-gate off Backlog | 0 | 0 | 0 |

Per-kind note: every one of the 118 unset field values sits on PullRequest items —
`fpat-project-sync.yml` triggers on issue events only, so the gap is structural and is the
**data** for the parked PR-event-sync decision, decided nowhere in this cycle
(`cycle-1/board-consistency.json` `inferred`).

## 6. Parked decisions — frozen before-values unchanged

`baseline-manifest.json` `metrics.parkedDecisions` vs cycle-1 measurements:

| Parked decision | Frozen before-value | Cycle-1 value | Mutated? |
|---|---|---|---|
| `extend-project-sync-to-pr-events` | 55 unset | 118 unset (growth from new PRs, not from a sync change) | no |
| `backfill-epic-scores` | missing Score: [#2, #3] | missing Score: [#2, #3] | no |
| `retro-auto-add-early-prs` | off-board: [#23, #22] | off-board: [#23, #22] | no |

No board/label mutation straddles the window; populations are comparable un-split
(`comparisonRules[5]`).

## No-verdict disclaimer & carried notProven

**No improvement verdict is claimed, and none is permitted.** `comparisonRules[6]` and
epic #75's out-of-scope line forbid any "FPAT improved delivery" conclusion: cycle-0 is a
single frozen baseline (n=1) and cycle-1 is the first re-measurement — these tables enable
directional analysis in a *future* cycle; they do not constitute one. Every delta above is
descriptive. Improvement-wording in this section quotes the reports' own guardrails.

Carried `notProven` (verbatim themes from all five cycle-1 reports, each of which restates
"Whether FPAT IMPROVED delivery — single baseline (n=1), no comparison cohort"):

- **throughput**: umbrella-#1 subtree boundary remains a proxy ("all-flow-pack"); timing
  outlier causes not established.
- **workflow-reliability**: root cause of cancellations supported (concurrency
  hypothesis) but not confirmed; harmful-vs-benign decomposed only via supersession
  heuristic.
- **signal-quality**: heuristic label candidates need human confirmation; root cause of
  non-superseded skips not established.
- **board-consistency**: WHY field values drifted is unread (current state only);
  closed-not-Done is the designed one-directional behavior, not proven error.
- Carried `inferred` flags stay attached to their numbers in the per-report JSON — they are
  not re-litigated here.

## What feeds the next cycle

Acting on any of this is **out of scope for #75** (next cycle's `/fpat-continuation`
input): the #64 label candidate, the PR-side field-sync structural gap, the project-sync
cancellation concentration, and the localized #61/#63–#69 contract violations.
