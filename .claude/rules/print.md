---
paths:
  - "src/styles/**"
  - "src/lib/print-validator.ts"
  - "src/components/canvas/**/*.tsx"
  - "src/lib/template-engine.tsx"
---

# A4 Print Fidelity Conventions

> A4 print fidelity is the product's core invariant. Treat any change that could overflow,
> clip, or hide résumé content as high-risk. Deep background: `.claude/docs/print-fidelity-guide.md`.

## The A4 Constants (do not drift)

- A4 = **210mm × 297mm**. At 96 DPI that is **794px wide × 1122px tall per page**.
- `1122` is hard-coded in three places that must agree:
  - `src/components/canvas/PageContainer.tsx` (`pageHeight = 1122`)
  - `src/components/canvas/LivePreviewCanvas.tsx` (`targetHeight = pageCount * 1122`)
  - `src/lib/print-validator.ts` (`calculateOverflow`, target `pageCount * 1122`)
  If you change the page model, change all three. Prefer extracting a shared constant if you touch them.

## Overflow Detection (two layers)

1. **Static** — `auditDocumentData(doc)` in `print-validator.ts` returns
   `{ isCompliant, overflowPixels, warnings[], metrics }` from content length heuristics
   (name > 50 chars, headline > 120, > 5 timeline entries, > 5 bullets/entry, > 18 total bullets).
   Keep these thresholds meaningful; add a warning when you add a length-sensitive field.
2. **Dynamic** — `LivePreviewCanvas.tsx` measures real DOM `scrollHeight` vs `pageCount * 1122`.
   This is the live truth at runtime; `overflowPixels` in the static report is intentionally `0`.

## Print CSS Mechanics (`src/styles/print.css`)

- `@media print` forces white bg, black text, and `width: 210mm` on `html, body`.
- `.a4-page-context` is the print target wrapper — width 210mm, transforms/shadows/borders
  stripped in print. **Preserve this class and its print rules.**
- Print-only visibility: `header, footer, aside, button, nav, .print-hide, .sidebar, .toolbar,
  .alert-box` are `display: none` in print. Editor chrome must carry one of these (usually
  `.print-hide`) so it disappears on print. New chrome → add `.print-hide`.
- Page-break helpers: `.page-break-avoid` (keep block together), `.page-break-after` (force break).
  Use them on logical résumé sections to avoid mid-section splits.
- `@page { size: A4; margin: 0 }` — margins are handled inside the template, not the page box.

## Conventions

- Zoom (`zoom` state, default `0.72`) is a preview-only transform; it must NOT affect print output.
- When adding template content, wrap each major section in `.page-break-avoid`.
- After any layout/print change, manually verify `/studio` print preview across all 3 templates.

## Anti-patterns

- Never hide content to fit the page silently — emit a `print-validator` warning instead.
- Never hard-code a different page height; reuse `1122`.
- Never remove `.print-hide`/`display:none` print rules without replacing the mechanism.
- Never rely on `transform: scale()` for print sizing — print uses real mm units.
