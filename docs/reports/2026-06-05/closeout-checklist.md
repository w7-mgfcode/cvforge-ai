# Umbrella Closeout Checklist — #6 (E5) → #1

The terminal release-gate sequence that lets umbrella #1 close through `fpat-rollup-gate.yml`.
It is **orchestrator-run**: a #6 sub-issue cannot close its own parent (the rollup gate reopens a
parent closed while a direct sub-issue is still open), so the actual closes happen only after all
five #6 sub-issues (#51–#55) read CLOSED — mirroring how #5 closed after #41–#45.

## Preconditions

- [ ] #51–#55 all CLOSED (and board Status Done).
- [ ] #6 rollup = 5/5 (`subIssuesSummary.completed == total`).
- [ ] Dogfood report committed: `docs/reports/2026-06-05/fpat-umbrella-dogfood.md`.
- [ ] Documentation drift resolved (#51) and guarded in CI (#52, `check-doc-consistency.mjs`).

## #6 acceptance criteria

- [ ] All parallel epics closed (#2–#5 CLOSED) and the A4 dogfood is green (#53 evidence).
- [ ] Dogfood report committed (#54).
- [ ] Umbrella closes only after the rollup gate confirms all sub-issues closed.

## Sequence (orchestrator)

1. [ ] Confirm #6 rollup 5/5.
2. [ ] Edit #6 body: check both acceptance boxes + link the dogfood report.
3. [ ] #6 board Status → Done.
4. [ ] Close #6 (`gh issue close 6 --reason completed`).
5. [ ] Confirm `fpat-rollup-gate.yml` run on the #6 close = success and did **not** reopen #6.
6. [ ] Confirm #1 rollup now 5/5 (E1–E5 all CLOSED).
7. [ ] #1 board Status → Done.
8. [ ] Close #1 (umbrella).
9. [ ] Confirm `fpat-rollup-gate.yml` run on the #1 close = success and did **not** reopen #1
       (its whole sub-tree is closed).

## Verification commands

```bash
# rollups
gh api graphql -f query='{repository(owner:"w7-mgfcode",name:"cvforge-ai"){
  i6:issue(number:6){state subIssuesSummary{total completed}}
  i1:issue(number:1){state subIssuesSummary{total completed}}}}'

# rollup-gate runs (expect conclusion=success, no reopen)
gh run list --repo w7-mgfcode/cvforge-ai --workflow fpat-rollup-gate.yml --limit 3 \
  --json event,conclusion,displayTitle
```

## Outcome

Recorded on #6 and #1 after execution (state, board Status, rollup-gate run id).
