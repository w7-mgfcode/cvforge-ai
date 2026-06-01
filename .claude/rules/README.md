# Tier 2 — On-Demand Rules

Each rule file carries a `paths:` frontmatter glob. The rule auto-loads when the agent works
with a matching file, so domain conventions stay out of the global `CLAUDE.md` until needed
(progressive disclosure — the "Select" strategy of WISC).

| File | Auto-loads when touching | Covers |
|------|--------------------------|--------|
| `schema.md`     | `src/schemas/**`, `src/data/**`, `src/components/editor/**` | Zod CV contract + 5-site lock-step propagation |
| `print.md`      | `src/styles/**`, `src/lib/print-validator.ts`, `src/components/canvas/**`, `src/lib/template-engine.tsx` | A4 = 1122px math, `.a4-page-context`, overflow detection, print-only visibility |
| `components.md` | `src/components/**`, `src/app/**` | `'use client'` rule, one-way state from `studio/page.tsx`, 500-line cap, tokens/icons |
| `templates.md`  | `src/lib/template-engine.tsx` | `templatesRegistry`, `renderActiveTemplate`, adding/editing a template |
| `ai-copilot.md` | `src/lib/ai/**`, `src/components/ai-assistant/**` | Mock copilot shape, `output:'export'` blocks real server LLM |
| `skills.md`     | `.claude/skills/**`, `.agents/skills/**`, `skills-lock.json` | Managing agent skills via `npx skills`; lockfile; don't edit installed copies |
| `ui-design.md`  | `src/components/**`, `src/app/**`, `src/styles/**`, `src/lib/template-engine.tsx` | Tool-first UI workflow (Stitch/frontend-design), real-browser proof of done, Stitch→template reconciliation |
| `flow-pack-agent-team/branch-naming.md` | `.claude/**`, `.github/**`, `scripts/fpat/**` | Issue-linked FPAT branch naming for Projects delivery work |
| `flow-pack-agent-team/commit-format.md` | `.claude/**`, `.github/**`, `scripts/fpat/**` | Conventional commit + issue linkage for FPAT work |

## Adding a rule

1. Create `.claude/rules/{concern}.md` with a `paths:` frontmatter listing the globs that
   should trigger it.
2. Keep it information-dense: real file paths, real patterns, concrete anti-patterns.
3. Add a row to this table and to the table in `CLAUDE.md`.
4. Log the addition in the commit's `Context:` section (see `/commit`).

Keep globs aligned with the real `src/` layout — verify paths exist before adding them.
