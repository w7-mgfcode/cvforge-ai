---
description: Plan one GitHub issue into an FPAT 5-subtask package
argument-hint: "<issue-number-or-url>"
---

# FPAT Plan Issue

## Objective

Produce a review-ready FPAT package for one GitHub issue. The command is read-only until the user approves GitHub writes.

## Process

1. Resolve the issue reference to `owner/repo#N`.
2. Load issue title, body, labels, state, project items, linked PRs, comments, parent issue, and sub-issues.
3. Write:
   - Brief
   - Source of truth
   - Issue context
   - Risks, blockers, dependencies
   - Role-relevant scope
4. Score directions on the seven-dimension execution rubric.
5. Run one critic pass for scope creep, weak evidence, blockers, dependency mistakes, and over-engineering.
6. Produce exactly five subtasks unless a different count is explicitly justified.
7. Present the package and stop.

## Required Closing Line

End with:

```text
Ready for your review. I will not call any GitHub write tools until you say "approve".
```

