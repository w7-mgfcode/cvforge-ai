# UI Design Workflow Guide

> **Summary:** The tool-first UI pipeline for CVForge (ideate → generate → systematize → implement
> → verify), which skills/MCP tools are actually available here, and the mandatory protocol for
> turning a Stitch-generated screen into shippable, A4-safe, schema-driven code. Read before any
> non-trivial UI design/generation task. The enforceable subset lives in `.claude/rules/ui-design.md`.

## The Pipeline

```
UI task arrives
   │
   ├─ Vague idea / one-liner?            → enhance-prompt → stitch-design
   ├─ Need new screens or variants?      → stitch-design  (or mcp__stitch__generate_screen_from_text)
   ├─ Need a coherent design system?     → design-md → reconcile into /DESIGN.md (NOT .stitch/)
   ├─ Implementing the actual code?      → frontend-design (+ vercel-react-best-practices,
   │                                        vercel-composition-patterns)
   └─ Verifying the running UI?          → webapp-testing (scripted)
                                          → agent-browser (exploratory, real browser)
                                          → mcp__plugin_playwright_playwright__* (low-level steps)
```

## Tool & Skill Availability (this repo/session)

| Capability | Tool | Status | Notes |
|---|---|---|---|
| Prompt shaping | `enhance-prompt` (skill) | ✅ | always |
| Screen generation/edit/variants | `stitch-design` (skill), `mcp__stitch__*` | ⚠️ | MCP needs `GOOGLE_API_KEY` |
| Design-system synthesis | `design-md` (skill), `mcp__stitch__create_design_system` | ⚠️ | reconcile into `/DESIGN.md` |
| Autonomous Stitch loop | `stitch-loop` (skill) | ⚠️ | Stitch-key gated |
| Production frontend code | `frontend-design` (skill) | ✅ | + installed `vercel-react-*` skills |
| shadcn components | `shadcn-ui` (skill) | ➖ N/A | repo has no shadcn (custom templates + Tailwind v3) |
| Scripted local verification | `webapp-testing` (skill) | ✅ | Playwright against `npm run dev` |
| Exploratory real-browser QA | `agent-browser` (skill) | ✅ | no key needed; preferred for dogfooding |
| Low-level browser steps | `mcp__plugin_playwright_playwright__*` | ✅ | plugin loaded |
| Wireframes/diagrams | `mcp__claude_ai_Excalidraw__*` | ✅ | deferred tool |
| Deploy preview | `deploy-to-vercel` (skill), Vercel MCP | ⚠️ | needs `VERCEL_TOKEN` |

⚠️ = available but env-gated. If a key is unset, say so, fall back to `frontend-design` + browser
verification, and don't claim the gated step ran.

## CVForge Design System (the one source of truth)

`/DESIGN.md` + `tailwind.config.ts`:
- A4 = **1122px/page @ 96 DPI**; zero print bleed. Two themes: **workspace** (Deep Slate #0F172A
  canvas, Slate #1E293B cards, Indigo #2563EB accent) and **document** (white page, Navy #1E3A8A,
  Orange #EA580C, Slate text). Primary font Montserrat.
- Layout: left rail 33% / main 67%. Density presets — comfortable (16/24/12px) / compact (10/16/6px).
- Overflow protection: clip triggers a user warning; text scales down or flows to next page.

Map all generated UI onto these tokens (`workspace.*`, `dossier.*`); never introduce parallel tokens.

## Reconciliation Protocol — Stitch artifact → shippable CVForge UI

Stitch may generate ANY surface (chrome OR document templates), but its output is **raw input**.
A Stitch screen is NOT done until every box is checked:

1. **Schema** — bind to `CVDocument`; propagate any new field across the 5 lock-step sites
   (`.claude/rules/schema.md`). Templates read only from `documentData`.
2. **Registry** — for a document template, add to `templatesRegistry` (unique `id`, `name`,
   `description`) and `renderActiveTemplate` (`.claude/rules/templates.md`).
3. **A4 fidelity** — fit the 1122px/page model; wrap sections in `.page-break-avoid`; preserve
   `.a4-page-context` + `.print-hide` print semantics (`.claude/rules/print.md`).
4. **Tokens & density** — swap Stitch colors/spacing for Tailwind tokens; honor
   `design.colorPaletteOverrides` and `globalDensityScale`.
5. **State** — keep document state in `studio/page.tsx`; new panels stay controlled
   (`.claude/rules/components.md`); respect the 500-line cap.
6. **Print proof** — real-browser print-preview across `dossier` / `ats` / `visual`; zero overflow.

Only after 1–6 is the work "complete."

## Definition of Done (UI)

- Lint + build pass (necessary, not sufficient).
- Exercised in a real browser (`agent-browser` / `webapp-testing` / Playwright MCP).
- For template/print changes: print-preview verified on all three templates, no A4 overflow.
- Tokens/schema/registry reconciled; no competing design source created.

## References
- Enforceable rule: `.claude/rules/ui-design.md`
- Print internals + automated-gate blueprint: `.claude/docs/print-fidelity-guide.md`
- Architecture/state flow: `.claude/docs/architecture-deep-dive.md`
- Design system: `/DESIGN.md`, `/PROJECT_CONTEXT.md`
