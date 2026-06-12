# Board Cleanup Decision — 2026-06-12 (#127)

**Status:** APPROVED and executed 2026-06-12.
**Scope:** CVForge AI Delivery board (Projects v2 #2, `PVT_kwHOCghNdc4BZZCU`).
**Tracking issue:** #127. **Workflow change PR:** linked from #127 (`Closes #127`).

This is the dated decision record required by `baseline-manifest.json`
`metrics.parkedDecisions[extend-project-sync-to-pr-events].rule`:
*"If approved, date the change and compare pre/post populations separately."*

## Why now

Umbrella #70 closed (rollup-gate verified) and the cycle-1 effectiveness readout shipped
(`docs/reports/2026-06-11/cycle-1/`), so the measurement freeze that parked board mutations
has lifted. The board is public and recruiter-facing; every merged PR was being auto-added
with no Type/Phase/Area values, and six closed issues carried stale Status. Both gaps were
measured signals, not errors — this decision converts them into deliberate, dated fixes.

## Decision 1 — Status backfill (six items, manual, one-directional-legal)

One-directional sync (`board-spec.md` → Sync Direction) makes manual Status updates the
designed mechanism; these closed items simply never received theirs during the close race
documented in the umbrella-2 closeout.

| Item | Kind | Issue state | Status before | Status after |
|---|---|---|---|---|
| #73  | Epic (closed 2026-06-11) | CLOSED | `Ready` | `Done` |
| #117 | Sub-issue | CLOSED | *(unset)* | `Done` |
| #118 | Sub-issue | CLOSED | *(unset)* | `Done` |
| #119 | Sub-issue | CLOSED | *(unset)* | `Done` |
| #120 | Sub-issue | CLOSED | *(unset)* | `Done` |
| #121 | Sub-issue | CLOSED | *(unset)* | `Done` |

Rollback: set #73 back to `Ready`; clear Status on #117–#121.

## Decision 2 — Extend `fpat-project-sync.yml` to `pull_request` events

The formerly parked `extend-project-sync-to-pr-events` decision is hereby approved and
implemented (#127). PRs labeled `flow-pack` + `type:/phase:/area:` now receive the same
Type/Phase/Area field sync as issues, on the same one-directional, label-driven, idempotent,
never-clearing contract. The workflow still never touches Status, Score, Priority, or
Estimate, and never closes/edits issues or PRs. Existing labeled merged PRs were re-synced
once via `workflow_dispatch` after the change merged.

**Why field-sync instead of archiving the PRs:** the Linked-PR ↔ issue ↔ board relationship
is the delivery evidence this portfolio board exists to show; archiving would hide 50 rows of
that evidence, contradict the deliberate `is:issue,pr` auto-add filter, and recur with every
future PR. Field-sync fixes the cause (PRs added field-less), not the symptom.

## Frozen before-values (NOT rewritten — quoted for the pre/post split)

Frozen artifacts under `docs/reports/2026-06-11/` (cycle-0 baseline, cycle-1 measurement set,
`baseline-manifest.json`) are **unchanged** by this decision. The populations split at
2026-06-12; any future cycle compares pre/post separately (`comparisonRules[5]`):

- `labelFieldSync.missingFieldValues`: **55** (cycle-0 frozen) → **118** (cycle-1, all on
  PullRequest items; 45 PR items checked, Issue side fully synced at 0/0).
- `statusCoherence.closedNotDone`: **46** at cycle-1 (includes #73; #117–#121 closed after
  the cycle-1 run).
- Parked-decision table: `cycle-1/effectiveness-readout.md` §6 remains the authoritative
  before-state record.

## What this deliberately does NOT change

- **PR Status stays unset.** The sync mutates Type/Phase/Area only, so merged PRs continue to
  count as `closedNotDone` in `audit-board-consistency.mjs` statusCoherence. That is accepted:
  Status is a workflow column for issues; per-kind reporting (`byKind`) already separates the
  populations.
- The native auto-add filter (`is:issue,pr label:flow-pack`) — untouched.
- The two still-parked decisions: `backfill-epic-scores` (#2/#3) and
  `retro-auto-add-early-prs` (#22/#23) remain parked with their frozen before-values.
- The 2026-06-11 no-retro-labeling decision on historical label gaps (#12/#14) — untouched.

## Post-state verification

Recorded in #127 after execution: read-only `gh` checks confirming the six items read
`Status = Done`, sampled merged PRs carry Type/Phase/Area, and an issue-side re-dispatch
remains a no-op (issue behavior unchanged).
