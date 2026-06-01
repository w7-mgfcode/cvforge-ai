# Architecture Deep-Dive

> **Summary:** End-to-end map of CVForge AI — module responsibilities, the one-way state flow
> from `studio/page.tsx`, the render pipeline, and the static-export deployment model. Read this
> before a change that crosses more than one of: schema, editor, canvas, templates, design panel.

## System Shape

CVForge AI is a fully client-rendered Next.js 14 App Router app exported as a static site
(`next.config.mjs: output: 'export'`, `images.unoptimized`). No server runtime exists at
runtime — all logic runs in the browser. Deployment target is static hosting (Vercel).

```
Browser
 └─ /studio  (src/app/studio/page.tsx)  ── owns CVDocument state
      ├─ Editor      (src/components/editor/*)         edits content
      ├─ Design panel (src/components/design-panel/*)  edits design tokens
      ├─ Copilot      (src/components/ai-assistant/*)  simulated AI edits
      └─ Canvas       (src/components/canvas/*)        renders + measures A4 overflow
            └─ renderActiveTemplate()  (src/lib/template-engine.tsx)
```

## State Ownership & Data Flow (one-way)

`studio/page.tsx` is the single state holder:

- `cvData: CVDocument` (`useState(sampleCV)`) — the entire document.
- UI state: `activeWorkflow ('editor'|'lab'|'hud')`, `editorTab ('identity'|'timeline')`,
  `drawerTab ('design'|'ai')`, `zoom` (default 0.72), `pageCount` (default 2).

Children are controlled. They receive the data (or a slice) plus a typed update callback and
push changes upward; they never own document state. Example contracts:

- Editor forms → `onUpdateContent(...)` patches `cvData.content`.
- Design panel → `onUpdateDesign(...)` patches `cvData.design`.
- `CopilotDiffPanel` → `onUpdateContent` with `CopilotUpdateField =
  keyof CVContent['candidateIdentity'] | 'employmentTimeline'`.

This keeps a single mutation path. Adding a feature = add a callback in `studio/page.tsx`, pass
it down, render the slice. Do NOT introduce a store; `useState` + props is intentional.

## The Data Contract

`src/schemas/cv.schema.ts` (Zod) defines `CVDocument = { content, design, metadata }` and is the
single source of truth (see `.claude/rules/schema.md` for the full field map and the 5-site
lock-step rule). `src/data/sample-cv.ts` is the only dataset and must always satisfy the schema.
Note: there is no runtime `.parse()` on updates — TypeScript types are the guardrail.

## Render Pipeline

1. `studio/page.tsx` holds `cvData`.
2. Canvas (`LivePreviewCanvas` → `PageContainer`) wraps the page in `.a4-page-context`.
3. `renderActiveTemplate(cvData)` (in `template-engine.tsx`) maps `cvData.design.activeTemplateId`
   to one of the three renderers (`dossier` / `ats` / `visual`) from `templatesRegistry`.
4. Templates are stateless presentational components reading only from `documentData`.
5. `LivePreviewCanvas` measures real DOM `scrollHeight` against `pageCount * 1122` to flag overflow.
6. `print-validator.ts` separately runs static content-length heuristics → warnings + metrics.

## Module Responsibilities

| Path | Responsibility | Notes |
|------|----------------|-------|
| `src/app/studio/page.tsx` | State owner + layout orchestration | ~372 lines; do not grow |
| `src/app/evidence/page.tsx` | Explainability / metrics showcase | references the 1122px bound |
| `src/schemas/cv.schema.ts` | Zod contract + inferred types | single source of truth |
| `src/data/sample-cv.ts` | Sample dataset | must satisfy schema |
| `src/lib/template-engine.tsx` | 3 renderers + registry + `renderActiveTemplate` | ~547 lines; split if grown |
| `src/lib/print-validator.ts` | Static A4 audit (`auditDocumentData`, `calculateOverflow`) | dynamic check lives in canvas |
| `src/lib/ai/copilot.ts` | MOCK AI (no LLM) | static export blocks server LLM |
| `src/components/editor/*` | Controlled content forms | `BaseProfileForm`, `ExperienceForm (~522)` |
| `src/components/canvas/*` | Preview + A4 measurement | `LivePreviewCanvas`, `PageContainer` |
| `src/components/design-panel/*` | Design-token controls | template/typography/density/colors |
| `src/components/ai-assistant/*` | Copilot UI | two modes, controlled |
| `src/styles/print.css` | `@media print` + A4 sizing | `.a4-page-context`, `.print-hide` |

## Deployment Model & Its Consequences

Static export means: no API routes, no server actions, no server-held secrets, no SSR. Features
that assume a server (real LLM tailoring, persistence, auth) require an explicit hosting-model
decision before implementation (see `.claude/rules/ai-copilot.md`). Flag this in any plan.

## Cross-Cutting Change Checklist

- Touching content shape? → schema lock-step (5 sites).
- Touching layout/template? → A4 print check across all 3 templates.
- Adding interactivity? → keep state in `studio/page.tsx`, pass callbacks down.
- Adding a server need? → resolve the static-export constraint first.
