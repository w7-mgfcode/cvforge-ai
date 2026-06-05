# FPAT Plan Package — example with area hints (for create-subissues.sh dry-run)

## Brief
Example package showing the `**Area:**` hint line `create-subissues.sh` reads per subtask.
The hint is an extra line; `validate-package.mjs` still sees all 8 required sections.

## Source of truth
Fixture only.

## Issue context
Fixture.

## Risks, blockers, dependencies
None.

## Role-relevant scope
Fixture.

## Subtasks

### feat(claude-commands): example subtask one
- **Purpose:** demonstrate area parsing.
- **Scope:** one file.
- **Out of scope:** the rest.
- **Dependencies:** none.
- **Risks / blockers:** none.
- **Acceptance criteria:** `- [ ]` works.
- **Why it matters now:** first.
- **Area:** area:claude-commands

### docs(claude-docs): example subtask two
- **Purpose:** demonstrate area parsing.
- **Scope:** one doc.
- **Out of scope:** the rest.
- **Dependencies:** subtask one.
- **Risks / blockers:** none.
- **Acceptance criteria:** `- [ ]` works.
- **Why it matters now:** second.
- **Area:** area:claude-docs

### feat(claude-skills): example subtask three
- **Purpose:** demonstrate area parsing.
- **Scope:** one skill.
- **Out of scope:** the rest.
- **Dependencies:** subtask two.
- **Risks / blockers:** none.
- **Acceptance criteria:** `- [ ]` works.
- **Why it matters now:** third.
- **Area:** area:claude-skills

### test(scripts): example subtask four
- **Purpose:** demonstrate area parsing.
- **Scope:** one script.
- **Out of scope:** the rest.
- **Dependencies:** subtask three.
- **Risks / blockers:** none.
- **Acceptance criteria:** `- [ ]` works.
- **Why it matters now:** fourth.
- **Area:** area:scripts

### chore(github-projects): example subtask five
- **Purpose:** demonstrate area parsing.
- **Scope:** the board.
- **Out of scope:** the rest.
- **Dependencies:** subtask four.
- **Risks / blockers:** none.
- **Acceptance criteria:** `- [ ]` works.
- **Why it matters now:** fifth.
- **Area:** area:github-projects
