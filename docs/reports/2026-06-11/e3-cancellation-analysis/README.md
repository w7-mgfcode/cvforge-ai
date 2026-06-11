# E3 cancellation analysis — verdict with run-id evidence (#99)

Dated live run of the #73 analysis, pinned to the frozen window:

```bash
FPAT_EVAL_REPORT_DIR=docs/reports/2026-06-11/e3-cancellation-analysis \
  node scripts/fpat/eval/analyze-project-sync-cancellation.mjs --until 2026-06-07
```

Population check: the pinned window reproduces the frozen baseline **exactly** —
45 cancelled / 162 runs = 0.278 (no retention decay as of 2026-06-11).

## Verdict: `bounded-consistent`

**All 45/45 cancelled runs are consistent with pending-queue collapse; 0 unexplained.**

- 45/45 overlap ≥1 same-event sibling run.
- 45/45 are superseded by a later same-event success (matching the frozen
  signal-quality `cancelledSuperseded: 45 / cancelledNotSuperseded: 0`).
- Queued-window distribution: min 0 / mean 0.02 / max **0.03 minutes** — every
  cancelled run lived ≤ 2 seconds, the never-started signature (a run cancelled
  mid-execution would show a materially longer window).

Sample evidence rows (full 45-row table: `project-sync-cancellation.json` →
`metrics.cancelledRuns`):

| run id | window (UTC) | queued | same-event overlaps | superseded by |
|---|---|---|---|---|
| 26988704085 | 06-05 00:54:17 → :19 | 2s | 8 | 26988704130 |
| 26991261160 | 06-05 02:14:59 → :01 | 2s | 8 | 26991263621 |
| 26994234597 | 06-05 03:51:19 → :20 | 1s | 10 | 27000146343 |

## Mechanism (why "bounded", not "established")

`.github/workflows/fpat-project-sync.yml` serializes per issue
(`concurrency.group: fpat-project-sync-<issue>`) with **`cancel-in-progress:
false`** — unchanged since the original wiring (`7feef2e`). GitHub therefore
never kills an in-progress run of the group, but at most one run may **wait**
per group: rapid `labeled` events on the same issue collapse the pending queue.
The GitHub API exposes neither a run's concurrency group nor its triggering
issue, and queue-cancelled runs have no logs — so same-event overlap +
supersession is a proxy. The verdict is **bounded** (every run consistent with
the mechanism, none contradicting it), never "established"; the causation gap
is filed under the report's `notProven`.

## Contemporaneous observation (outside the pinned window, recorded for context)

Creating the five E3 sub-issues (#96–#100) on 2026-06-11 fired **25**
project-sync runs in ~90 seconds (5 issues × opened + 4×labeled events):
**15 cancelled + 10 success** (18:46Z burst; cancelled ids
27369691965…27369701406). Every issue's Type/Phase/Area fields still synced
correctly — a live reproduction of the collapse-then-supersede pattern the
pinned analysis describes. These runs are **not** in the pinned report and are
never pooled with it.

## Comparison rule (binding) & non-decisions

- The frozen 45/162 population and any later window are different populations;
  quote each with its date, never difference or pool them.
- **No workflow change is proposed.** All 45 cancellations were superseded —
  collapse-then-supersede is benign queue compression here, not lost work.
- The parked PR-event-sync decision (`baseline-manifest.json` →
  `metrics.parkedDecisions`) is untouched by this analysis: zero diff on all
  frozen artifacts (the report lives in this subdirectory precisely because the
  run date collides with the frozen cycle-0 directory — e2-live-run precedent).
