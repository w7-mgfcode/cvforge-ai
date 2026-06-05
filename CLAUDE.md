# CLAUDE.md — CVForge AI / WorkflowCV Studio

> **Tier 1 — Global Rules.** Always loaded. Keep this lean (< 500 lines). If removing a
> line wouldn't cause the AI to make a mistake, cut it. Domain-specific detail lives in
> Tier 2 (`.claude/rules/`) and Tier 3 (`.claude/docs/`) — see "Context System" below.

This repo also ships an `AGENTS.md` with the canonical build/test/style/security rules.
**`AGENTS.md` is authoritative** — read it first. This file adds the context-engineering
layer (the 3-tier system + slash-command workflow) on top of it without duplicating it.

---

## What This Project Is

Next.js 14 (App Router) application for **WorkflowCV Studio / CVForge AI**: a print-bounded
A4 résumé studio. It models CV content with TypeScript + Zod, renders three A4 templates,
and exposes a studio for editing content, design tokens, print previews, and (currently
simulated) AI tailoring. Product/design intent: `PROJECT_CONTEXT.md`, `DESIGN.md`.

## Essential Commands

```bash
npm run dev      # local dev server (http://localhost:3000 → /studio)
npm run build    # production build + Next.js type-check (this is our type gate)
npm run lint     # next lint (ESLint: next/core-web-vitals + next/typescript)
```

There is **no test runner** in `package.json`. Validation = `lint` + `build` + a manual
`/studio` print-preview check. Do not invent `npm test`.

## Architecture at a Glance

```
src/app/                 App Router routes
  studio/page.tsx        OWNS the CVDocument state; passes content/design to all panels
  evidence/page.tsx      metrics / explainability showcase
  page.tsx, layout.tsx   landing + root layout (fonts: Montserrat, Inter)
src/components/
  editor/                BaseProfileForm, ExperienceForm  (controlled forms → callbacks up)
  canvas/                LivePreviewCanvas, PageContainer  (zoom + A4 overflow detection)
  design-panel/          TokenControlPanel  (template, typography, density, colors)
  ai-assistant/          CopilotDiffPanel   (simulated optimize / job-match UI)
  template-lab/          ParserGraphView    (schema audit display)
src/schemas/cv.schema.ts SINGLE source of truth for CV data contracts (Zod)
src/data/sample-cv.ts    the only sample dataset (drives every template)
src/lib/
  template-engine.tsx    3 template renderers + `templatesRegistry` + renderActiveTemplate
  print-validator.ts      static A4 audit (warnings + metrics)
  ai/copilot.ts          MOCK AI (no real LLM calls)
src/styles/print.css     @media print rules + A4 sizing (.a4-page-context)
```

State flows **one way**: `studio/page.tsx` holds `useState<CVDocument>(sampleCV)` and pushes
changes down via callbacks (e.g. `onUpdateContent`). Children never own document state.

## Non-Negotiable Global Rules

1. **A4 print fidelity is a core requirement.** Never allow overflowing, clipped, or hidden
   résumé content without an explicit warning/mitigation. A4 target = **1122px height @ 96 DPI**
   per page (210mm × 297mm). See `.claude/rules/print.md`.
2. **Schema lock-step.** Any change to `src/schemas/cv.schema.ts` must be propagated, in the
   same change, to `src/data/sample-cv.ts`, the editor forms, the template renderers, and
   `src/lib/print-validator.ts`. See `.claude/rules/schema.md`.
3. **500-line file cap.** If a file approaches 500 lines, split by responsibility.
   (`ExperienceForm.tsx` and `template-engine.tsx` are already over — do not grow them; split
   when you touch them.)
4. **Static export constraint.** `next.config.mjs` sets `output: 'export'`. There is **no
   server runtime** — no API routes, no server actions, no server-side LLM calls. Any feature
   needing a server requires an explicit hosting-model decision first.
5. **TypeScript strict, no `any`** without a justifying comment. Use the `@/` alias for `src/`.
6. **Tailwind tokens over ad-hoc styles.** Use theme tokens from `tailwind.config.ts`
   (`workspace.*`, `dossier.*`) and `lucide-react` icons. No one-off hex or inline color styles.
7. **Never assume missing context. Confirm file paths exist before referencing them.**
   Never hallucinate libraries — only use what's in `package.json`.
8. **Never delete/overwrite existing code** unless the task explicitly calls for it.

---

## Context System (3 Tiers)

This project uses progressive disclosure so the agent loads only what the current task needs.

### Tier 1 — Global Rules (this file)
Always loaded. Structure, commands, architecture, universal rules. Kept lean.

### Tier 2 — On-Demand Rules (`.claude/rules/`)
Auto-loaded based on which files you touch (each rule has a `paths:` frontmatter glob).

| Rule file | Auto-loads when touching | Covers |
|-----------|--------------------------|--------|
| `schema.md`     | `src/schemas/**`, `src/data/**`, `src/components/editor/**` | Zod contract, lock-step propagation |
| `print.md`      | `src/styles/**`, `src/lib/print-validator.ts`, `src/components/canvas/**`, `src/lib/template-engine.tsx` | A4 math, `.a4-page-context`, overflow, print-only visibility |
| `components.md` | `src/components/**`, `src/app/**` | `'use client'`, controlled-form pattern, 500-line cap, tokens/icons |
| `templates.md`  | `src/lib/template-engine.tsx` | `templatesRegistry`, `renderActiveTemplate`, adding a template |
| `ui-design.md`  | `src/components/**`, `src/app/**`, `src/styles/**`, `src/lib/template-engine.tsx` | Tool-first UI workflow (Stitch/frontend-design) + mandatory real-browser verification |
| `ai-copilot.md` | `src/lib/ai/**`, `src/components/ai-assistant/**` | Mock copilot shape, static-export limit on real LLM |
| `skills.md`     | `.claude/skills/**`, `.agents/skills/**`, `skills-lock.json` | Managing agent skills via `npx skills`, lockfile, don't edit copies |
| `flow-pack-agent-team/*.md` | `.claude/**`, `.github/**`, `scripts/fpat/**` | FPAT branch/commit conventions for GitHub Projects delivery work |

### Tier 3 — Reference Docs (`.claude/docs/`)
Heavy guides, **not** auto-loaded. Scout them: read the doc's header/summary first, load the
full file only if relevant. Index: `.claude/docs/README.md`
(`architecture-deep-dive.md`, `print-fidelity-guide.md`, `skills-cli-guide.md`,
`ui-design-workflow-guide.md`, `flow-pack-agent-team/*`). Existing
`PROJECT_CONTEXT.md` and `DESIGN.md` are also Tier-3 references.

### Installed Skills (`.claude/skills/`)
Project skills installed via the `skills` CLI (`npx skills`, from `vercel-labs/skills`):
`deploy-to-vercel`, `vercel-optimize`, `web-design-guidelines`, `vercel-react-best-practices`,
`vercel-composition-patterns`, `vercel-react-view-transitions`. Tracked in `skills-lock.json`.
Manage only via the CLI — see `.claude/rules/skills.md` and `.claude/docs/skills-cli-guide.md`.

---

## Workflow (Slash Commands)

WISC strategies (Write · Isolate · Select · Compress) implemented as commands in `.claude/commands/`:

| Command | Strategy | What it does |
|---------|----------|--------------|
| `/prime`        | Select   | Loads focused codebase context at session start |
| `/plan-feature` | Write+Isolate | Spawns research subagents, writes a plan to `.claude/plans/{name}.md` |
| `/execute`      | Write    | Implements a plan file step-by-step in a fresh session |
| `/handoff`      | Write+Compress | Writes `HANDOFF.md` so the next session resumes instantly |
| `/commit`       | Write    | Atomic conventional commit; logs AI-context changes in a `Context:` section |
| `/fpat-prime` | Select | Captures repo, issue, workflow, label, milestone, and Project v2 state |
| `/fpat-continuation` | Select+Isolate | Read-only: produces a V1→V2 ship / negotiation / defer list with per-item 5-dimension scores |
| `/fpat-plan-issue` | Write | Plans one issue into a read-only 5-subtask package |
| `/fpat-handoff` | Write+Compress | Writes an FPAT continuation checkpoint and pending Project status update |

**Typical loop:** `/prime` → `/plan-feature <feature>` → (new session) `/execute .claude/plans/<feature>.md`
→ `/commit` → `/handoff` if continuing later.

## Validation Gates (run before declaring work done)

1. `npm run lint` — after touching any TS/TSX/Tailwind/config.
2. `npm run build` — after changes to routing, imports, schemas, rendering, or `next.config`.
3. **Manual `/studio` print-preview check** for any UI/template/print change — verify no A4
   overflow across all three templates. State any gate you could not run and why.
