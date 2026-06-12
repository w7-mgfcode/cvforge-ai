# Print-Hide Audit — Persistence Chrome Across 3 Templates (#153)

**Date:** 2026-06-12 · **Epic:** #133 (trust surfaces) · **Verdict: zero leaks, no fixes required.**

Systematic audit that every DOM element added by epic #133 — plus the #132 chrome present
at audit time — is invisible in print across all three templates. Method: real Chrome
(agent-browser) against `npm run dev` @ `localhost:3000/studio`, main @ `b2bc207`;
print output captured via print-to-PDF (applies `@media print`), each PDF inspected visually.

## Audited chrome (checklist of added DOM nodes)

| # | Element | Source | Selector / locator | Print mechanism |
|---|---------|--------|--------------------|-----------------|
| 1 | SaveStateBadge (state `unavailable` during audit) | #150 | `[data-save-state]` | `print:hidden` + host nav removed by `print.css` |
| 2 | ResetToSampleControl — idle button | #151 | footer `Reset` button | `print:hidden` ×2 (component + footer) |
| 3 | ResetToSampleControl — **open confirm row** | #151 | `Erase saved data?` + Reset/Cancel | `print:hidden` ×2 |
| 4 | StorageWarningBanner — **visible** (`unavailable` driven) | #152 | `[data-storage-warning]` | `print:hidden` on banner root |
| 5 | Export/Import buttons (flagged from #132/#145) | #145 | `Export JSON` / `Import JSON` | `print:hidden` ×2 |
| 6 | Hidden file input (flagged from #132/#145) | #145 | `input[type=file]` | `hidden` class (never visible) |

\#131 adds no visible chrome (autosave only) — nothing to audit from that epic.

## Worst-case state under print

The audit deliberately printed the **maximum-chrome state**: storage forced `unavailable`
(probe-time `setItem` override → banner visible, badge in warning state) **and** the reset
confirm row held open, simultaneously, while switching all three templates. State was
re-asserted live after the final PDF (`bannerStillUp: true`, `confirmRowStillOpen: true`).

## Results

| Template | PDF inspected | Persistence chrome in print |
|----------|---------------|------------------------------|
| `dossier` (Executive Technical Dossier) | `audit-153-dossier.pdf` | none — résumé content only |
| `ats` (Clean ATS Hybrid) | `audit-153-ats.pdf` | none — résumé content only |
| `visual` (Visual AI Portfolio) | `audit-153-visual.pdf` | none — résumé content only |

All six checklist elements invisible in all three templates. No bounded fixes needed;
no print-visibility classes touched.

## Cross-references

- Per-PR print evidence preceding this audit: PR #165 (3-template PDF sweep for #145),
  PR #166 (#150), PR #167 (#151), PR #169 (#152 — incl. the `error`-must-not-show-banner
  negative case).
- Issue #62 precedent (print leakage class this audit guards against).
- Full expected-vs-actual table recorded as a comment on epic #133.
