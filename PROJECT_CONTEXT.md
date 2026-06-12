# PROJECT CONTEXT - WORKFLOWCV STUDIO (CVFORGE AI)

## 1. Product Vision
WorkflowCV Studio is a portfolio-grade web application proving that highly styling-sensitive, variable-length career profiles can be parsed, validated, and rendered onto strict physical page constraints without data truncation or visual overflows. By treating resumes as structured documents decoupled into three distinct layers (Content, Design, and Metadata), it enforces clean data modeling, declarative styling, and precise print compilation.

## 2. Core Use Cases
* **UC-1: Reverse-Engineering Legacy Documents:** Maps unstructured career info into a structured, validated JSON schema.
* **UC-2: Print-Optimized Layout Synthesis:** Process and output documents that conform strictly to A4 page dimensions without clippings.
* **UC-3: Factual AI Tailoring Loop:** Safely optimizes wording and fits experiences for specific job descriptions via a side-by-side verification diff.
* **UC-4: Design Token Propagation:** Updates global styling (padding, colors, layout structures) instantly across the canvas via standard Tailwind/CSS configurations.

## 3. Personas
* **Technical Candidate:** Needs highly credible resumes detailing cloud metrics and GitHub repositories that print perfectly.
* **AI Workflows Engineer:** Seeks transparency in data mutation, logs, and prompt-driven layout compilations.
* **Recruitment Helper:** Prefers easy, instant layout template toggles (ATS vs Editorial) and global density adjustments.
* **Design-Driven Developer:** Wants full codebase control over layout stylesheets without custom hacks.

## 4. MVP Features
* Fully validated TypeScript/Zod schemas.
* Multi-page rendering checking for layout height constraints.
* Three custom template renders (Executive Technical Dossier, Clean ATS Hybrid, Visual AI Portfolio).
* Side-by-side simulated AI copilot panel with fact-locking rules.
* Print stylesheets hiding UI elements during Ctrl+P prints.

## 5. Persistence Behavior
Client-side persistence for the studio document. The app is statically exported (no server runtime), so everything lives in the browser. Implementation: `src/lib/storage.ts`, `src/lib/import-export.ts`, `src/components/persistence/*`.

* **Storage Model:** The `CVDocument` is persisted to the `localStorage` key `cvforge.document` wrapped in a versioned envelope `{ schemaVersion: 1, savedAt, doc }` (payload key is `doc`). Hydration validates the envelope shell and the inner document with Zod (`CVDocumentSchema`); any failure — missing key, invalid JSON, wrong envelope shape or version, schema-invalid document — resolves to the `sampleCV` fallback without throwing. A corrupt payload is preserved under the backup key `cvforge.document.backup` before falling back, so user data is never silently destroyed (a merely missing key writes no backup).
* **Autosave:** The studio hydrates once post-mount; saves are gated by a hydration flag so a pre-hydration save can never clobber a stored document with the sample. After hydration, every document change schedules a debounced save (750 ms); pending saves flush on `visibilitychange` (tab hidden) and `pagehide`. Each write stamps a fresh ISO-8601 `savedAt`; a write is refused (`skipped-newer`) when storage already holds a strictly newer `savedAt` — the last-write-wins guard against e.g. another tab — and the page then re-hydrates once from storage so the newer document is never silently shadowed.
* **JSON Export/Import Round-Trip:** Export downloads the document pretty-printed in the same v1 envelope (one construction site, `createEnvelope`, so exports always re-parse) named `cv-{slug}-{YYYY-MM-DD}.json` (falling back to `cv-export-{YYYY-MM-DD}.json` when the candidate name yields no slug). Import parses through typed, discriminated error classes (`file-read`, `invalid-json`, `wrong-version`, `invalid-envelope`, `invalid-document` — each carrying a human-readable message plus the first Zod issue path where applicable) and applies only after an explicit confirmation, replacing the whole document; on failure or cancel the current document is untouched.
* **Trust Surfaces:** A save-state badge (`SaveStateBadge`) in the studio nav reflects the save lifecycle — `idle` / `saving` / `saved` / `error` / `unavailable` — via the storage module's `subscribeSaveState` seam. A confirm-gated reset-to-sample escape hatch clears both storage keys and restores `sampleCV`. When a one-time write/remove probe finds storage unusable (private mode, blocked storage, zero quota), the module flips into flagged no-op mode and a persistent warning banner states that changes are kept in memory only — the studio keeps working fully in memory.
