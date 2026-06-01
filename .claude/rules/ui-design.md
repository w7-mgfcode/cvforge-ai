---
paths:
  - "src/components/**/*.tsx"
  - "src/app/**/*.tsx"
  - "src/styles/**"
  - "src/lib/template-engine.tsx"
---

# UI Design Workflow (tool-first)

> When the task involves UI/frontend design, generation, iteration, or visual review, you **MUST**
> use the dedicated skills and MCP tools below. Do not hand-write UI from scratch when these apply.
> Full pipeline + tool availability + the reconciliation protocol: `.claude/docs/ui-design-workflow-guide.md`.

## What counts as "UI designing"
Creating/editing pages, components, layouts, or screens · visual hierarchy, typography, spacing,
color · building/modifying the frontend · iterating look-and-feel on feedback · wireframes/mockups.
Backend-only or non-visual logic → this rule does not apply.

## Required toolchain (typical order)
1. **`enhance-prompt`** — turn a vague UI idea into a Stitch-optimized prompt first.
2. **`stitch-design`** (or `mcp__stitch__generate_screen_from_text` / `edit_screens` /
   `generate_variants`) — generate or iterate screens.
3. **`design-md`** + `mcp__stitch__create_design_system` / `apply_design_system` — systematize.
4. **`frontend-design`** (+ `shadcn-ui` *only if the target uses shadcn* — this repo does NOT) —
   implement production code. Pair with the installed `vercel-react-best-practices` and
   `vercel-composition-patterns` skills.
5. **Verify in a real browser** — `webapp-testing` (scripted) / `agent-browser` (exploratory) /
   `mcp__plugin_playwright_playwright__*` (low-level). `mcp__claude_ai_Excalidraw__*` for wireframes.

## Hard requirements
1. **Tool-first.** Before hand-rolling UI, check whether `stitch-design` or `frontend-design` applies.
2. **Real-browser proof of done.** NEVER claim a UI change is complete without exercising it in a
   real browser (`agent-browser` / `webapp-testing` / Playwright MCP). **Lint + build + types passing
   ≠ UI works.** This is the same gate as `print.md`'s manual `/studio` check — for any template or
   print-affecting change, the browser check MUST include print-preview across all 3 templates.
3. **One design system.** This repo's source of truth is **`/DESIGN.md` + `tailwind.config.ts`
   tokens** (A4 1122px, workspace + document themes, comfortable/compact density). Do NOT invent
   tokens/spacing/patterns. If you run `design-md`, reconcile into the existing `DESIGN.md` — do
   NOT spawn a competing `.stitch/DESIGN.md` source of truth.

## Stitch is allowed for EVERYTHING — including document templates — BUT it is never "done" on its own
Stitch may generate/iterate both the workspace chrome AND the A4 résumé templates. However Stitch
has no concept of this repo's invariants, so **a Stitch artifact is raw input, not shippable code.**
Before any Stitch-generated UI counts as complete you MUST reconcile it:

- **Schema lock-step** — wire it to `CVDocument` and the 5 sites in `.claude/rules/schema.md`.
  Templates read from `documentData`; never hard-code candidate data.
- **Registry** — register document templates in `templatesRegistry` + `renderActiveTemplate`
  (`.claude/rules/templates.md`).
- **A4 fidelity** — map to the 1122px/page model, wrap sections in `.page-break-avoid`, keep
  `.a4-page-context` + `.print-hide` semantics (`.claude/rules/print.md`).
- **Tokens** — replace Stitch's colors/spacing with `tailwind.config.ts` tokens (`workspace.*`,
  `dossier.*`) and honor `design.colorPaletteOverrides` + `globalDensityScale`.
- **Print proof** — verify no A4 overflow in a real browser across `dossier` / `ats` / `visual`.

## Env gating (state it if blocked)
- Stitch MCP needs `GOOGLE_API_KEY`; Vercel MCP / `deploy-to-vercel` need `VERCEL_TOKEN`
  (see `.agents/mcpServers.json`). Playwright MCP and `agent-browser` need no key.
- If a required key is unset, say so, fall back to `frontend-design` + browser verification, and
  do not claim the Stitch step ran.

## Anti-patterns
- Hand-writing a screen without checking `stitch-design`/`frontend-design` first.
- Declaring UI done on a green build with no browser verification.
- Shipping a Stitch template without schema/registry/A4/token reconciliation.
- Creating `.stitch/DESIGN.md` as a second design source of truth.
- Using `shadcn-ui` here — the repo has no shadcn; use the custom template engine + Tailwind v3.
