# FPAT Execution Pipeline

Source: `/home/w7-hector/_KB-BASE-BY-w7/JOB/DIA-FLOW/ai_engineering_mermaid_flow_pack/docs/flow-analysis/02-execution-pipeline.md`.

## Purpose

The execution pipeline turns one approved GitHub issue into a review-ready package with exactly five executable subtasks. It is read-only until the user approves GitHub writes.

## Phases

1. Resolve the issue reference.
2. Load issue graph and delivery context.
3. Frame the brief, source of truth, and role-relevant scope.
4. Score and critique candidate directions.
5. Decompose and present exactly five subtasks.

## Subtask Template

Each subtask should include:

- Title
- Purpose
- Scope
- Out of scope
- Dependencies
- Risks / blockers
- Acceptance criteria
- Why it matters now

## Scoring

Use the seven-dimension execution rubric for subtask planning:

- Value
- Risk
- Readiness
- Dependency load
- Validation ease
- Rollback safety
- Evidence strength

This rubric is for shaping work inside a chosen epic. Use the five-dimension continuation rubric for deciding which epics ship.

