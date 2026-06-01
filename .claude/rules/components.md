---
paths:
  - "src/components/**/*.tsx"
  - "src/app/**/*.tsx"
---

# React Component Conventions

## Tech & Style

- React 18 function components + TypeScript strict. Next.js 14 App Router.
- Add `'use client'` ONLY when the file uses client state, effects, or event handlers
  (forms, canvas, panels do; pure render templates do not).
- Import app code via the `@/` alias (`@/schemas/cv.schema`, `@/lib/...`, `@/components/...`).
- Styling: Tailwind utility classes + theme tokens from `tailwind.config.ts`
  (`workspace.{bg,card,border,accent,accentHover}`, `dossier.{primary,secondary,accent,...}`).
  No one-off hex values or inline color styles. Fonts: `font-montserrat`, `font-inter`.
- Icons: `lucide-react` when a suitable icon exists; inline SVG only for brand glyphs.

## State Ownership (one-way data flow)

`src/app/studio/page.tsx` is the single owner of document state:

```tsx
const [cvData, setCvData] = useState<CVDocument>(sampleCV);
```

It also owns UI state: `activeWorkflow ('editor'|'lab'|'hud')`, `editorTab ('identity'|'timeline')`,
`drawerTab ('design'|'ai')`, `zoom`, `pageCount`.

Child components are **controlled**: they receive data + an update callback and push changes up
(e.g. `<CopilotDiffPanel documentData={cvData} onUpdateContent={updateField} />`,
`onUpdateContent`/`onUpdateDesign` style callbacks into the editor and design panels).
Children must NOT hold their own copy of the document. New panels follow the same pattern:
take `documentData` (or the slice they need) + a typed `onUpdate*` callback.

## File Size

- **500-line cap.** `ExperienceForm.tsx` (~522) and `studio/page.tsx` (~372) are already large.
  Do not grow them. When you touch `ExperienceForm.tsx`, split it by section
  (employment / projects / credentials) into sibling components under `editor/`.

## Conventions

- Keep UI dense and work-focused — this is a document studio, not a marketing page.
- Editor chrome (toolbars, sidebars, buttons) must carry `.print-hide` so it vanishes in print
  (see `.claude/rules/print.md`).
- Co-locate a component's types in the same file unless shared; shared CV types come from the schema.

## Anti-patterns

- Never duplicate `CVDocument` state in a child — lift to `studio/page.tsx`.
- Never add `'use client'` to a component that doesn't need interactivity.
- Never introduce a state library (Redux/Zustand) — `useState` + callbacks is the chosen pattern.
- Never grow a file past 500 lines "just this once".
