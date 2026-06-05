---
description: Plan one GitHub issue into an FPAT 5-subtask package
argument-hint: "<issue-number-or-url>"
---

# FPAT Plan Issue

## Objective

Produce a review-ready FPAT package for one GitHub issue. The command is read-only until the user approves GitHub writes.

## Canonical contract (locked)

These counts are the single source of truth. Any earlier "10-step" / "9-section" wording is
**legacy drift** — do not reintroduce it.

- **Process: exactly 7 steps** (below).
- **Package framing: exactly 5 sections** — Brief, Source of truth, Issue context,
  Risks/blockers/dependencies, Role-relevant scope.
- **Subtasks: exactly 5**, unless a different count is explicitly justified (see
  `.claude/docs/flow-pack-agent-team/decomposition.md`).
- **Subtask template: exactly 8 sections per subtask** — Title, Purpose, Scope, Out of scope,
  Dependencies, Risks / blockers, Acceptance criteria, Why it matters now. This mirrors
  `.github/ISSUE_TEMPLATE/fpat_sub_issue.yml` and `.claude/docs/flow-pack-agent-team/execution-pipeline.md`.
- **Scoring rubric: the 7-dimension execution rubric** (Value, Risk, Readiness, Dependency load,
  Validation ease, Rollback safety, Evidence strength). Reuse the
  `flow-pack-agent-team-scoring` skill for the rubric and bands.

## Process

1. Resolve the issue reference to `owner/repo#N`.
2. Load issue title, body, labels, state, project items, linked PRs, comments, parent issue, and sub-issues.
3. Write the 5-section package framing:
   - Brief
   - Source of truth
   - Issue context
   - Risks, blockers, dependencies
   - Role-relevant scope
4. Score directions on the seven-dimension execution rubric.
5. Run one critic pass for scope creep, weak evidence, blockers, dependency mistakes, and over-engineering.
6. Produce exactly five subtasks (each with the 8-section subtask template) unless a different count is explicitly justified.
7. Present the package and stop.

## Required Closing Line

End with:

```text
Ready for your review. I will not call any GitHub write tools until you say "approve".
```
