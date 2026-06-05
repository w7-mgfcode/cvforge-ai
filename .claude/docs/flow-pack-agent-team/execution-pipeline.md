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

## Package Template

A compliant package has these five framing sections, then the scored directions, the critic
pass, and exactly five subtasks. This is the canonical shape `/fpat-plan-issue` emits (see
`.claude/commands/fpat-plan-issue.md`):

1. **Brief** — what the issue is and why it matters now.
2. **Source of truth** — the issue graph and files every later claim cites.
3. **Issue context** — live state vs. what the issue body claims (verified, not assumed).
4. **Risks, blockers, dependencies** — including blocked-by / feeds relationships.
5. **Role-relevant scope** — in-scope vs. out-of-scope surfaces.

Followed by:

- **Scored directions** — candidate decomposition approaches scored on the seven-dimension rubric.
- **Critic pass** — the five-item checklist below.
- **Five subtasks** — each using the eight-section subtask template below.

## Subtask Template

Each subtask should include exactly these eight sections (mirrors
`.github/ISSUE_TEMPLATE/fpat_sub_issue.yml` — reference it, do not fork it):

- Title
- Purpose
- Scope
- Out of scope
- Dependencies
- Risks / blockers
- Acceptance criteria
- Why it matters now

## Critic Checklist

Run exactly one critic pass over the package, checking these five named failure modes:

1. **Scope creep** — does any subtask exceed the issue's stated scope?
2. **Weak evidence** — is every "exists" / "missing" claim backed by a file path or command output?
3. **Blockers** — are real blockers (closed/open dependencies) verified against live state?
4. **Dependency mistakes** — is the subtask order consistent with the dependency map?
5. **Over-engineering** — is any subtask heavier than the repo's idioms require?

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

