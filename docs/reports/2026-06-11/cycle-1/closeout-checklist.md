# Umbrella Closeout Checklist — #75 (E5) → #70

The terminal release-gate sequence that lets umbrella #70 close through
`fpat-rollup-gate.yml`. It is **orchestrator-run**: a #75 sub-issue cannot close its own
parent (the rollup gate reopens a parent closed while a direct sub-issue is still open), so
the actual closes happen only after all five #75 sub-issues (#117–#121) read CLOSED —
mirroring how #6 closed after #51–#55 (`docs/reports/2026-06-05/closeout-checklist.md`).

## Preconditions

- [ ] #117–#121 all CLOSED (and board Status Done).
- [ ] #75 rollup = 5/5 (`subIssuesSummary.completed == total`).
- [ ] Cycle-1 reports committed: `docs/reports/2026-06-11/cycle-1/` (five `*.json`, #117).
- [ ] Readout committed: `docs/reports/2026-06-11/cycle-1/effectiveness-readout.md` (#118).
- [ ] Conformance evidence committed:
      `docs/reports/2026-06-11/cycle-1/conformance-evidence.md` (#119).
- [ ] Indexes synced + `check-doc-consistency.mjs` exit 0 (#121).

## #75 acceptance criteria

- [ ] Cycle-1 reports + readout published under `docs/reports/<date>/` (#117, #118).
- [ ] Every comparison honors all 8 `comparisonRules` from the baseline manifest
      (#118; mapped row-by-row in #119's evidence doc).
- [ ] No improvement verdict claimed (readout disclaimer; grep-verified in #119).
- [ ] Closeout checklist completed (this document, executed below).

## Sequence (orchestrator)

1. [ ] Confirm #75 rollup 5/5 (#117–#121 CLOSED).
2. [ ] Edit #75 body: check all four acceptance boxes + link the readout and evidence docs.
3. [ ] #75 board Status → Done (manual — `fpat-project-sync.yml` never touches Status).
4. [ ] Close #75 (`gh issue close 75 --reason completed`).
5. [ ] Confirm `fpat-rollup-gate.yml` run on the #75 close = success and did **not**
       reopen #75.
6. [ ] Confirm #70 rollup now 5/5 (E1–E5 = #71–#75 all CLOSED).
7. [ ] #70 board Status → Done.
8. [ ] Close #70 (umbrella, `gh issue close 70 --reason completed`).
9. [ ] Confirm `fpat-rollup-gate.yml` run on the #70 close = success and did **not**
       reopen #70 (its whole sub-tree is closed).

## Out of scope during execution

The three parked board decisions stay parked (`extend-project-sync-to-pr-events`,
`backfill-epic-scores`, `retro-auto-add-early-prs` — frozen before-values verified
unchanged in the readout §6); no label/board mutation beyond the two manual Status → Done
moves above; no Score recalibration.

## Verification commands

```bash
# rollups
gh api graphql -f query='{repository(owner:"w7-mgfcode",name:"cvforge-ai"){
  i75:issue(number:75){state subIssuesSummary{total completed}}
  i70:issue(number:70){state subIssuesSummary{total completed}}}}'

# rollup-gate runs (expect conclusion=success, no reopen)
gh run list --repo w7-mgfcode/cvforge-ai --workflow fpat-rollup-gate.yml --limit 3 \
  --json event,conclusion,displayTitle
```

## Outcome

Recorded on #75 and #70 after execution (state, board Status, rollup-gate run id).
