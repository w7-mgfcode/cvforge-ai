# FPAT Decomposition Method

Source: `/home/w7-hector/_KB-BASE-BY-w7/JOB/DIA-FLOW/ai_engineering_mermaid_flow_pack/docs/flow-analysis/01-decomposition.md`.

## Operating Model

FPAT turns one multi-week initiative into GitHub hierarchy data:

```text
one umbrella issue -> phased epics -> executable sub-issues
```

The hierarchy is materialized with GitHub sub-issues, not just markdown references. The Project board should show parent and rollup state where GitHub exposes those native fields.

## Umbrella Contract

An umbrella issue must contain:

- Summary
- Approach
- Decomposition
- Out of scope
- Success criteria
- Risks
- Tracking

For CVForge AI, the first dogfood umbrella is `feat(workflow): adopt flow-pack + agent-team delivery system`.

## Phase Contract

- Foundation: one blocking epic.
- Parallel: independent epics that start after Foundation.
- Release: one release gate that closes only after Parallel epics close.

## Planning Command Flow

The hierarchy is planned and created top-down, one approval-gated layer at a time:

1. `/fpat-continuation "<initiative>"` — scores what ships (read-only).
2. `/fpat-plan-umbrella "<approved initiative>"` — proposes 1 umbrella + 5 epics (1 Foundation,
   3 Parallel, 1 Release) as a read-only creation package
   (`.claude/commands/fpat-plan-umbrella.md`).
3. User approval — create the umbrella + epic issues only, never sub-issues.
4. `/fpat-plan-issue <epic-number>` — decomposes one epic into exactly five sub-issues, epic by
   epic, each behind its own approval.

The full `1 + 5 + 25` tree is never created in one step.

## Sub-Issue Contract

Sub-issues are executable units with:

- Conventional-commit title.
- Parent line: `Sub-issue of #<epic>`.
- `## Purpose`.
- `## Acceptance criteria`.
- Clear area and phase labels.

When `01-decomposition.md` and `02-execution-pipeline.md` disagree on count, use the stricter execution rule: exactly five sub-issues unless a different count is explicitly justified.

