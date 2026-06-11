# E2 live-run evidence — item-kind precondition measured (#89)

First real per-kind `labelFieldSync` measurement (U2-C precondition), produced by
one live run on 2026-06-11 (post-#87/#88, board #2, 81 items):

```bash
FPAT_EVAL_REPORT_DIR=docs/reports/2026-06-11/e2-live-run \
  node scripts/fpat/eval/audit-board-consistency.mjs
```

Token source: `gh-auth` (live, **not** degraded; `access.probeError: null`).

## Why this subdirectory exists

The run date collides with the frozen cycle-0 date. `writeReport` defaults to
`docs/reports/<date>/`, which today is `docs/reports/2026-06-11/` — the frozen
baseline directory. The `FPAT_EVAL_REPORT_DIR` override writes here instead so
the frozen flat files (`baseline-manifest.json`, `board-consistency.json`, …)
are physically untouched. Never compare or merge the two in place: this report
is post-baseline evidence, not a baseline revision.

## The measured split

| Kind | items checked | mismatches | labeled-but-unset |
|---|---|---|---|
| Issue | 49 | 0 | **0** |
| PullRequest | 32 | 0 | **79** |
| total | 81 | 0 | 79 |

**The entire labeled-but-unset population sits on PullRequest items.** Issues
are fully synced (`fpat-project-sync.yml` triggers on issue events); PR-side
field values are structurally unsynced — exactly the report's `inferred` line:
PR gaps are not re-sync candidates, they are the data for the parked decision.

## Comparison rule (restated, binding)

The frozen cycle-0 reference (`metrics.boardConsistency.labelFieldSync`:
53 checked / 55 unset, **total-only by design**) is never pooled with
post-baseline populations like this one (81 checked / 79 unset). Quote either
with its date and era; never difference them as if same-population (board
membership grew between the two runs).

## Parked decision: untouched

This run measures the precondition only. The PR-event-sync decision in
`baseline-manifest.json` → `metrics.parkedDecisions` remains parked, user-gated,
and textually unchanged (verified: zero diff on the frozen manifest in this PR).
No board or label mutation was performed.
