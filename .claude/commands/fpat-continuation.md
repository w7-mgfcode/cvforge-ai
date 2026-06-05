---
description: Run FPAT V1 to V2 continuation planning in dry-run mode
argument-hint: "<goal>"
---

# FPAT Continuation

## Objective

Turn `$ARGUMENTS` into a baseline-grounded V2 ship list, negotiation list, and defer list
using the FPAT continuation discipline. The command is **read-only**: it plans, it never writes.

## Canonical contract (locked)

These counts and bands are the single source of truth. Any earlier wording that drifts from them
is legacy drift — do not reintroduce it.

- **Process: exactly 8 steps** (below).
- **Research: exactly 3 read-only passes** — Known Issues, Best Practices, Dependencies.
- **Scoring: the 5-dimension continuation rubric** — Value, Risk, Readiness, Complexity, Evidence.
  Reuse the `flow-pack-agent-team-scoring` skill for the rubric and bands.
- **Score bands (verbatim):** `>= 40` ship · `< 36` defer · `36–39` negotiate. These bands are
  owned by the `flow-pack-agent-team-scoring` skill — keep them byte-identical with it.
- **Output: exactly 3 lists** — V2 ship, negotiation, defer — each item carrying its per-item
  5-dimension score, and every defer item carrying an explicit defer reason.

## Steps

1. Capture baseline reality (cite every claim by path or `gh` output):
   - repo
   - docs
   - rules
   - issues
   - current state
2. Freeze the baseline timestamp before drafting V1.
3. Draft V1 as 5-10 unscored candidate items.
4. Critique every V1 item for:
   - weak assumptions
   - scope creep
   - missing evidence
5. Run exactly three read-only research passes:
   - Known Issues
   - Best Practices
   - Dependencies
6. Score every candidate on the 5-dimension rubric (Value, Risk, Readiness, Complexity, Evidence)
   via the `flow-pack-agent-team-scoring` skill.
7. Apply the score bands verbatim:
   - `>= 40`: V2 ship
   - `< 36`: defer
   - `36–39`: negotiate
8. Output the V2 ship list, the negotiation list, and the defer list, using the templates in
   `.claude/docs/flow-pack-agent-team/continuation-discipline.md` (per-item 5-dim scores;
   explicit reason on every defer item).

## Guardrails

- **No GitHub writes.** Do not create, edit, label, close, or comment on issues/PRs, and do not
  touch the Project board (no Status/Score writes).
- **No file writes.** Do not edit files unless the user explicitly switches from planning to
  implementation in a later instruction.
- Cite every repo claim by path or `gh` output.

## Required closing line

End the run with:

```text
This was a read-only continuation pass. No GitHub or file writes were performed.
```
