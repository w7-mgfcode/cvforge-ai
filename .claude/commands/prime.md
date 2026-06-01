---
description: Prime the agent with focused CVForge AI codebase context
---

# Prime: Load CVForge AI Context

## Objective

Build a working understanding of the CVForge AI repo before any task — structure, current
state, and the conventions that matter. Keep exploration focused (Select strategy); do not read
the whole tree.

## Process

### 1. Project structure & commands
!`ls src/ src/components src/lib && echo '---' && cat package.json | head -30`

### 2. Read the global rules
Read `CLAUDE.md` in full (Tier 1 — architecture, commands, non-negotiable rules, the 3-tier
context map). Then skim `AGENTS.md` (authoritative build/style/security).

### 3. Read the data contract
Read `src/schemas/cv.schema.ts` — the single source of truth for `CVDocument`.

### 4. Identify entry points (read, don't memorize line-by-line)
- `src/app/studio/page.tsx` — owns `CVDocument` state; one-way data flow to all panels.
- `src/lib/template-engine.tsx` — `templatesRegistry` + `renderActiveTemplate` (3 templates).
- `src/lib/print-validator.ts` + `src/styles/print.css` — A4 = 1122px print fidelity.

### 5. Note the Tier 2 / Tier 3 map
Glance at `.claude/rules/README.md` and `.claude/docs/README.md` so you know which path-scoped
rules auto-load and which deep docs to scout later (don't read the docs now).

### 6. Current state
!`git log -8 --oneline && echo '---' && git status && echo '---' && git branch --show-current`

## Output (under 250 words, bullets over prose)

- **Overview:** static-exported Next.js 14 A4 résumé studio; no server runtime; no test runner.
- **Architecture:** state owner (`studio/page.tsx`) → editor/design/copilot/canvas → templates.
- **Invariants:** A4 fidelity (1122px), schema lock-step (5 sites), 500-line cap, `output:'export'`.
- **Validation:** `npm run lint`, `npm run build`, manual `/studio` print preview.
- **Current state:** branch, recent commits, uncommitted work, anything relevant to the task.
