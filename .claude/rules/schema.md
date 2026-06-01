---
paths:
  - "src/schemas/**"
  - "src/data/**"
  - "src/components/editor/**/*.tsx"
---

# CV Schema & Data Conventions

## Single Source of Truth

`src/schemas/cv.schema.ts` is the ONE contract for all CV data. Everything derives from it
via `z.infer`. Never define a parallel CV shape anywhere else.

Top-level shape: `CVDocumentSchema = { content, design, metadata }`.

- `content: CVContentSchema`
  - `candidateIdentity` `{ fullName, professionalHeadline, biographicalSummary }`
  - `communicationChannels: ContactLink[]` — `iconType ∈ phone|email|location|linkedin|github|custom`
  - `skillsInventory: TechSkillItem[]` — `{ name, confidenceScore 0–100, categoryMarker }`
  - `employmentTimeline: ExperienceItem[]` — `{ entityName, roleTitle, temporalDuration, geographicLocation, bulletPoints[], associatedTechTags[] }`
  - `projectShowcase: ProjectItem[]` — `{ title, description, repositoryUrl?, metricsEvidence }`
  - `credentialsLibrary: CredentialItem[]` — `{ title, issuer, attainedYear }`
- `design: CVDesignConfigSchema` `{ activeTemplateId, typographySelection, globalDensityScale: 'comfortable'|'compact', colorPaletteOverrides: Record<string,string> }`
- `metadata` `{ documentRevision: number, lastModifiedTimestamp: string }`

Exported types: `CVDocument`, `CVContent`, `CVDesignConfig`, `ContactLink`, `TechSkillItem`,
`ExperienceItem`, `ProjectItem`, `CredentialItem`. Import these — do not re-declare.

## Lock-Step Propagation (CRITICAL)

Any change to a schema shape MUST be propagated **in the same change** to all five sites:

1. `src/schemas/cv.schema.ts` — the Zod schema + inferred type.
2. `src/data/sample-cv.ts` — the sample dataset must still satisfy the schema.
3. `src/components/editor/` — `BaseProfileForm.tsx` (identity/contact) and/or
   `ExperienceForm.tsx` (timeline/projects/credentials) must read & edit the new field.
4. `src/lib/template-engine.tsx` — every template that should display the field.
5. `src/lib/print-validator.ts` — update `auditDocumentData` / metrics if the field affects
   length or page bounds.

Skipping any one of these causes silent data loss or render gaps. There is no runtime Zod
parse on updates, so the type system + this checklist are the only guardrails.

## Conventions

- Field names are descriptive/domain-specific (`employmentTimeline`, not `jobs`). Keep that style.
- Add validation messages to required strings (`z.string().min(1, '...')`) like existing fields.
- Optional URL fields use the existing pattern: `z.string().optional().or(z.literal(''))`.
- `confidenceScore` is `0–100` (percentage), not `0–1`.

## Anti-patterns

- Never edit `sample-cv.ts` shape without updating the schema first.
- Never add a field to a form that isn't in the schema.
- Never widen a field to `any` to "make it compile" — fix the schema.
- Never assume a field is non-empty in templates; arrays can be empty.
