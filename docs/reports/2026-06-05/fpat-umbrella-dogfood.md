# FPAT Umbrella Dogfood Report — CVForge AI

**Date:** 2026-06-05 · **Umbrella:** #1 *adopt flow-pack + agent-team delivery system* ·
**Release epic:** #6 *agent-team execution + dogfood release gate* (E5)

## Summary

This report is the release artifact for the first CVForge AI FPAT adoption umbrella. It records
(1) how the umbrella was delivered as GitHub hierarchy-as-data, (2) the resolution of two
release-blocking documentation drifts, and (3) a real dogfood of the product's core invariant —
A4 print fidelity across all three templates. All checks pass; the umbrella is ready to close
through `fpat-rollup-gate.yml`.

## Umbrella delivery (E1 → E5)

One umbrella (#1) → five phased epics → executable sub-issues, materialized as native GitHub
sub-issues and tracked on Project #2 (*CVForge AI — WorkflowCV Studio Roadmap*).

| Epic | Phase | State |
|------|-------|-------|
| E1 #2 — fpat foundation (namespace, conventions, /fpat-prime, CI) | Foundation | Closed |
| E2 #3 — decomposition + Projects v2 automation | Parallel | Closed |
| E3 #4 — issue → 5-subtask planning pipeline + scoring | Parallel | Closed |
| E4 #5 — continuation-discipline roadmap (V1→V2) | Parallel | Closed |
| E5 #6 — agent-team execution + dogfood release gate | Release | This report |

E4 (#5) shipped as sub-issues #41–#45 (PRs #46 `4e2a73b`, #47 `d4823af`, #48 `1827b80`,
#49 `ad39d54`, #50 `b1c92e7`).

## E5 release-gate work (#51 → #55)

| Sub-issue | PR | Merge | Result |
|-----------|----|----|--------|
| #51 preflight drift-fix | #56 | `aa5a56a` | CLAUDE.md + #5 AC corrected |
| #52 preflight CI guard | #57 | `c87602d` | `check-doc-consistency.mjs` in CI |
| #53 dogfood A4 print-preview | #58 | `af581dc` | browser + static, all templates pass |
| #54 this report | — | — | committed |
| #55 closeout verification | — | — | checklist + orchestrated close |

### Drift resolved (#51)

1. `CLAUDE.md` `/fpat-continuation` row was `Write+Isolate` / "ship/defer list" → corrected to
   **read-only** (`Select+Isolate`) / **"V2 / negotiation / defer"**.
2. #5 acceptance text "V2 + defer list" → **"V2 + negotiation + defer list"**.

A CI guard (`scripts/fpat/check-doc-consistency.mjs`, #52) now fails the build if either drift
returns, and asserts the score bands stay byte-identical across the command, the
`flow-pack-agent-team-scoring` skill, and `continuation-discipline.md`.

## Dogfood: A4 print fidelity across the 3 templates

A4 page model = **1122px / page @ 96 DPI** (`.claude/rules/print.md`). Verified two ways.

### Dynamic — rendered browser check (`scripts/fpat/dogfood-a4.mjs`)

Chromium driven over the DevTools Protocol loaded `/studio`, switched each template, and measured
the real `.a4-page-context` height against the active page budget.

| Template | Pages | Rendered height | A4 budget | Overflow | Screenshot |
|----------|-------|-----------------|-----------|----------|-----------|
| `dossier` | 2 | 2242px | 2244px | **0** | `a4-dossier.png` |
| `ats` | 2 | 2242px | 2244px | **0** | `a4-ats.png` |
| `visual` | 2 | 2242px | 2244px | **0** | `a4-visual.png` |

Screenshots have distinct checksums/sizes, confirming real template switching (not a fixed
frame). Raw data: `a4-dogfood-results.json`.

### Static — content audit (`scripts/fpat/dogfood-a4-static.mjs`)

The project's own `auditDocumentData` (`src/lib/print-validator.ts`) over the sample CV
(template-independent content):

- `isCompliant: true`, **0** advisory warnings.
- metrics: `{ totalCharCount: 1261, skillDensity: 6, timelineBreadth: 3, documentRevision: 1 }`.
- spot check: `calculateOverflow(2244, 2) = 0`.

Raw data: `a4-static-audit.json`.

> Both harnesses are local (they need a browser + dev server) and are intentionally **not** wired
> into `fpat-validate.yml`; CI has neither. They add no repo dependency (CDP via Node's global
> `WebSocket`; the static run uses the in-repo `typescript` compiler on type-only imports).

## Validation gates

- `npm run lint` → clean; `npm run build` → compiled (7/7 static pages) — on every E5 PR.
- CI `fpat-validate.yml`: `validate-issues.mjs`, `test-negotiation-band.mjs`,
  `check-doc-consistency.mjs`, lint, build — all green.
- A4 dogfood (this report) — all three templates within bounds.

## Closeout

The umbrella close sequence is verified and executed per the #55 checklist
(`docs/reports/2026-06-05/closeout-checklist.md`): #6 → Done + closed, #1 rollup 5/5 → closed,
`fpat-rollup-gate.yml` confirms no reopen. Outcome recorded on #6 and #1.
