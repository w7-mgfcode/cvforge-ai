# Print Fidelity Guide

> **Summary:** The A4 sizing math (why 1122px), how overflow is detected statically and
> dynamically, how `print.css` reshapes the page for printing, and a blueprint for adding an
> automated visual print gate. Read before changing page sizing, overflow logic, or print CSS.

## Why 1122px

- A4 = 210mm × 297mm.
- CSS reference DPI = 96 px/inch. 1 inch = 25.4mm.
- Height: 297mm ÷ 25.4 × 96 ≈ **1122px**. Width: 210mm ÷ 25.4 × 96 ≈ **794px**.

So one A4 page = 794 × 1122 px on screen at 96 DPI. The studio models multi-page documents as
`pageCount * 1122` total height. `1122` appears in:

- `src/components/canvas/PageContainer.tsx` — `pageHeight = 1122`
- `src/components/canvas/LivePreviewCanvas.tsx` — `targetHeight = pageCount * 1122`
- `src/lib/print-validator.ts` — `calculateOverflow(scrollHeight, pageCount)` → `pageCount * 1122`

These three MUST stay in sync. If you touch the page model, consider extracting a shared
`A4_PAGE_HEIGHT_PX = 1122` constant and importing it in all three.

## Two-Layer Overflow Detection

### Layer 1 — Static (content heuristics)
`auditDocumentData(doc)` in `print-validator.ts` returns `LayoutAuditReport`:
`{ isCompliant, overflowPixels (always 0 here), warnings[], metrics }`. Heuristic thresholds:

- `fullName` > 50 chars → scaling warning
- `professionalHeadline` > 120 chars → wrap/expansion warning
- `employmentTimeline.length` > 5 → recommend compact density
- any entry `bulletPoints.length` > 5 → overflow-prone warning
- total bullets > 18 → recommend compact density

`metrics` = `{ totalCharCount, skillDensity, timelineBreadth, documentRevision }`. When you add a
length-sensitive field, add a corresponding threshold + warning here.

### Layer 2 — Dynamic (real DOM)
`LivePreviewCanvas.tsx` reads the rendered element's `scrollHeight` and compares to
`pageCount * 1122`. This is the runtime source of truth (browser-measured), which is why the
static report leaves `overflowPixels = 0` and defers to the live measurement.

## print.css Mechanics (`src/styles/print.css`)

- `@media print` → `html, body` forced to white bg / black text / `width: 210mm` / `height: auto`,
  with `print-color-adjust: exact` so theme colors render.
- `.a4-page-context` → the print target. In print: `width: 210mm`, `transform: none`, no margin/
  padding/border/shadow. The on-screen zoom transform is stripped so print is true-size.
- Hidden-in-print selectors: `header, footer, aside, button, nav, .print-hide, .sidebar,
  .toolbar, .alert-box` → `display: none`. Editor chrome must carry one of these classes.
- `.page-break-avoid` (keep block whole) and `.page-break-after` (force break) control pagination.
- `@page { size: A4; margin: 0 }` — outer margins are zero; internal padding belongs to templates.

## Adding an Automated Print Gate (future / Flow E synergy)

Today the print check is **manual** (open `/studio`, print-preview, eyeball all 3 templates).
To automate without changing the static-export model:

1. Add Playwright as a devDependency and a `test:print` script.
2. `npm run build` → serve the static export → for each template id (`dossier`, `ats`, `visual`)
   load `/studio`, select the template, and read the rendered `.a4-page-context` height.
3. Assert `scrollHeight <= pageCount * 1122` (no overflow) rather than pixel-diffing screenshots
   (height/overflow assertions are stable across environments; screenshots are flaky).
4. Wire it as validation Level 3 in `/execute` and reference it from `.claude/rules/print.md`.

This is the natural upgrade path noted in the Flow-D ranking (D → fold in E's visual gate).

## Anti-patterns

- Hiding content to fit → instead emit a `print-validator` warning.
- Divergent page-height constants across the three files.
- Using `transform: scale()` for print sizing (print uses real mm).
- Removing `.print-hide` rules without an equivalent mechanism.
