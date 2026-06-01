---
description: Write an FPAT continuation checkpoint and optionally prepare Project status instructions
argument-hint: "<stage-or-issue>"
---

# FPAT Handoff

## Objective

Write a resumable FPAT checkpoint for `$ARGUMENTS`. This compresses state for the next session and names the exact GitHub Project update that should happen after approval.

## Output File

Write to:

```text
.claude/handoffs/fpat-<slug>.md
```

## Structure

```markdown
# FPAT Handoff: <stage-or-issue>

## State
DRY-RUN | APPLYING | BLOCKED

## Completed
- [x] ...

## Current GitHub Surface
- Repo:
- Project:
- Umbrella:
- Epic:
- Sub-issues:

## Decisions
- ...

## Files Changed
- ...

## Validation
- ...

## Next Action
...

## Project Status Update To Apply After Approval
...
```

Do not update the Project board directly unless the user has approved that specific mutation.

