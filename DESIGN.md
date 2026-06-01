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

## Structural Validation Directives
* **Sizing Overflow Protections:** Element overflow clipping triggers a warning to the user; text must scale down or move safely to the next canvas page container.
* **Media Query Print Rules:** When executing background printing, strip out all interface elements and display only the target document container.
