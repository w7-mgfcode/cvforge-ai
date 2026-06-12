# DESIGN SYSTEM DEFINITION (DOCUMENT ARCHITECTURE)

## Visual Standards Baseline
* **Design Philosophy:** Editorial engineering design system maximizing data density without visual confusion.
* **Workspace Theme:** Deep Slate (#0F172A) canvas wrapper, Slate (#1E293B) workspace cards, Indigo (#2563EB) accents.
* **Document Theme:** Pure white page background (#FFFFFF), Navy Blue (#1E3A8A) header/accent highlights, Vivid Orange (#EA580C) indicators, Dark Slate (#0F172A) body text.
* **Typography Base:** Primary rendering family Montserrat, fallback Sans-Serif.

## Layout Configuration Variables
* **Base Sizing Guide:** Standard A4 ($210mm \times 297mm$), zero print crop bleed vectors.
* **Target Sizing:** 1122px height per A4 page container based on 96 DPI rendering.
* **Column Layout Profiles:** Left Column side rail mapped to 33% width footprint, Main Right Column content rail consuming 67% area.

## Density Mapping Presets
* **Comfortable:** Row padding `16px`, outer margins `24px`, inter-item spacing `12px`.
* **Compact:** Row padding `10px`, outer margins `16px`, inter-item spacing `6px`.

## Persistence Chrome Conventions
* **Placement Map:** Save-state badge in the 64px left workflow nav, directly beside the revision badge and mirroring its geometry (32px circle on the slate-800 surface, icon-only with tooltip); export/import/reset cluster in the studio footer chrome; storage-unavailable warning as a fixed bottom-edge banner beside the nav (`fixed bottom-4 left-20`), `pointer-events-none` so it never occludes a control.
* **Token Usage:** Footer controls use the `workspace.*` surface tokens (`bg-workspace-card`, `border-workspace-border`, hover to `bg-workspace-border`); the saving spinner takes the `workspace.accent` indigo. The unavailable banner reuses the existing yellow HUD-warning palette (yellow-300 text, yellow-950 wash, yellow-900 border). Import failures use the muted red error treatment (red-300 text, red-950 wash, red-900 border) mirroring the copilot missing-keywords panel; the reset confirm button is the sole solid-red destructive surface.
* **State Iconography (lucide):** `Cloud` idle (slate), `Loader2` spinning while saving (indigo accent), `Check` saved (emerald), `AlertCircle` save error (yellow), `CloudOff` unavailable (slate); chrome actions: `Download` export, `Upload` import, `RotateCcw` reset, `Trash2`/`X` confirm/cancel, `AlertTriangle` warning banner.
* **Print Rule:** Every persistence element carries `print:hidden` — zero persistence chrome may leak into the printed document. Verified in-browser across all three templates.

## Structural Validation Directives
* **Sizing Overflow Protections:** Element overflow clipping triggers a warning to the user; text must scale down or move safely to the next canvas page container.
* **Media Query Print Rules:** When executing background printing, strip out all interface elements and display only the target document container.
