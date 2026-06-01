---
paths:
  - "src/lib/template-engine.tsx"
---

# Template Engine Conventions

`src/lib/template-engine.tsx` (~547 lines, at the 500-line cap — split if it grows) holds the
three A4 résumé renderers and the registry that the studio selects from.

## Structure

- Three renderers, each `React.FC<TemplateRendererProps>` taking `{ documentData: CVDocument }`:
  - `ExecutiveTechnicalDossierTemplate` (id `dossier`)
  - `CleanATSHybridTemplate` (id `ats`)
  - `VisualAIPortfolioTemplate` (id `visual`)
- `export const templatesRegistry = [{ id, name, description, ... }]` — the catalog the
  `TokenControlPanel` lists and `design.activeTemplateId` references.
- `export const renderActiveTemplate = (documentData: CVDocument) => ...` — maps the active
  template id to its renderer. The studio canvas calls this.

## Adding or Editing a Template

1. Write the renderer as `React.FC<TemplateRendererProps>`, reading only from `documentData`.
2. Register it in `templatesRegistry` with a unique `id`, human `name`, and `description`.
3. Wire the `id` into `renderActiveTemplate`'s switch/map.
4. Confirm `TokenControlPanel` shows it (it reads the registry).
5. Wrap each major section in `.page-break-avoid`; respect A4 bounds — see `.claude/rules/print.md`.
6. Read every consumed field from the schema; handle empty arrays gracefully.

## Conventions

- Templates are presentational and stateless — no `useState`, no data mutation, no callbacks.
- Use Tailwind `dossier.*` tokens for document colors; honor `design.colorPaletteOverrides`
  and `design.globalDensityScale` ('comfortable' | 'compact') for spacing.
- A new schema field that should be visible must be added to the relevant template(s)
  (lock-step — see `.claude/rules/schema.md`).

## Anti-patterns

- Never fetch or compute document state inside a template — it only renders props.
- Never hard-code candidate data; always read from `documentData`.
- Never let this file exceed 500 lines — extract per-template files when splitting.
- Never assume a template id exists; `renderActiveTemplate` must handle unknown ids safely.
