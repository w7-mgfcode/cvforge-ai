---
description: Run FPAT V1 to V2 continuation planning in dry-run mode
argument-hint: "<goal>"
---

# FPAT Continuation

## Objective

Turn `$ARGUMENTS` into a baseline-grounded V2 ship list and defer list using the FPAT continuation discipline.

## Steps

1. Capture baseline reality:
   - repo
   - docs
   - rules
   - issues
   - current state
2. Freeze the baseline timestamp.
3. Draft V1 as 5-10 unscored candidate items.
4. Critique every V1 item for:
   - weak assumptions
   - scope creep
   - missing evidence
5. Run exactly three read-only research passes:
   - Known Issues
   - Best Practices
   - Dependencies
6. Score every candidate on Value, Risk, Readiness, Complexity, and Evidence.
7. Apply score bands:
   - `>= 40`: V2 ship
   - `< 36`: defer
   - `36-39`: negotiate
8. Output V2, negotiation, and defer lists.

## Guardrails

- Do not write GitHub state.
- Do not edit files unless the user explicitly switches from planning to implementation.
- Cite every repo claim by path or `gh` output.

