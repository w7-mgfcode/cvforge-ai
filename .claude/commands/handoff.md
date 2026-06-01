---
description: Write a session handoff document for the next agent or session
---

# Handoff: Capture Session State for Continuation

## Objective

Write a `HANDOFF.md` that lets the next session continue seamlessly — externalize the session's
memory (Write) and compress it to essentials (Compress).

## When to Use

- Before ending a long session that will continue later.
- Before hitting context limits (proactively).
- When switching phases (research → implementation).
- Instead of relying on `/compact` for critical ongoing work.

## Process

### 1. Review the session
What was the goal? What's done? What's in progress/blocked? What key decisions were made and
WHY? What files changed? What dead ends were hit (so they aren't repeated)?

### 2. Gather state
```bash
git status
git diff --stat HEAD
git log --oneline -5
git branch --show-current
```

### 3. Write `HANDOFF.md` (repo root) — exact structure:

```markdown
# Handoff: [Brief Task Description]

**Date:** [date]   **Branch:** [branch]   **Last Commit:** [hash + msg | "uncommitted"]

## Goal
[1–2 sentences + original request or plan reference, e.g. `.claude/plans/<name>.md`.]

## Completed
- [x] [What was done]

## In Progress / Next Steps
- [ ] [Next action with file paths and specifics]
- [ ] [Blocked items + the blocker]

## Key Decisions
- **[Decision]**: [chosen] — [why; alternatives rejected]

## Dead Ends (Don't Repeat)
- [Tried X] — [why it failed]

## Files Changed
- `src/path` — [what changed, 1 line] (NEW/DELETED if applicable)

## Current State
- **Lint:** [clean / N warnings]
- **Build (type-check):** [pass / N errors]
- **Manual print check:** [done — templates verified / not run]

## Context for Next Session
[2–4 sentences: most important thing to know, biggest risk, do-this-first.]

**Recommended first action:** [exact command/step — e.g. `/execute .claude/plans/<name>.md`]
```

### 4. Confirm & advise
- Confirm the file path written.
- Next-session opener: `Read HANDOFF.md and continue from where the previous session left off.`
- If there are uncommitted changes, suggest `/commit` first.

## Quality Criteria
- Lets a fresh agent continue with zero clarifying questions.
- Under 100 lines — reference files, don't duplicate them.
- Includes WHY (key decisions) and dead ends.
- Has a concrete first action.

## Anti-patterns
- No full file contents or debugging transcripts — summarize.
- No vagueness ("fix the bug") — name the file and the fix.
- Don't skip Dead Ends or Key Decisions.
