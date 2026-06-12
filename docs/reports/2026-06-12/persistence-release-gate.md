# Persistence Release Gate — Umbrella #129 / Epic #134 (#179)

**Date:** 2026-06-12 · **Verdict: gate PASSED** — all five script steps green in one continuous
real-browser session on final main (`22329c3`), A4 fidelity re-verified, docs aligned.

This is the consolidating release-gate artifact. Raw expected-vs-actual tables live as comments
on #134 (one for #176, one for #177); the four epic evidence reports are referenced below, not
re-pasted.

## Gate scenario results (#176 — one continuous session, single profile, script order)

| # | Step | Result | Key proof |
|---|------|--------|-----------|
| 1 | Fresh profile → sampleCV fallback | ✅ | storage wiped (daemon restart) → sample rendered, `schemaVersion: 1` envelope written, no backup key |
| 2 | Edit identity + timeline → reload → restored | ✅ | `E5ID` + `E5GATE` markers persisted, both in envelope `doc` and rendered post-reload |
| 3 | Export → reset → import → deep-equal | ✅ | `cv-gabor-szabo-e5id-2026-06-12.json`; reset wiped markers; import restored `JSON.stringify`-equal document |
| 4 | Corrupt payload → reload → fallback + backup | ✅ | truncated JSON seeded → no crash, sample fallback, original payload verbatim under `cvforge.document.backup`, console clean |
| 5 | Print preview ×3 templates (#177, same session) | ✅ | see below |

## A4 re-verification (#177)

Per template on the persisted document with all persistence chrome shipped: HUD
**"100% compliant"**, 0 overflow mentions, print-to-PDF inspected — single A4 page, résumé-only,
within bounds, zero chrome — for `dossier`, `ats`, and `visual`. Chrome print-hide matrix:
see the #153 worst-case audit (`print-hide-audit-e4.md`, PR #171).

## Docs alignment (#178)

`PROJECT_CONTEXT.md` → *5. Persistence Behavior* and `DESIGN.md` → *Persistence Chrome
Conventions* added in PR #181 (`f48c657`); claims verified against `src/lib/storage.ts`,
`src/lib/import-export.ts`, `src/components/persistence/*`.

## Method & environment

agent-browser (real Chrome) against `npm run dev` @ `localhost:3000/studio`; instrumented
`URL.createObjectURL` / anchor `download` / storage assertions via eval; deep-equality compared
in Node. Build gates per PR via CI (validate-fpat-artifacts + Vercel). Known env constraints
honored (no local build while the dev server runs; daemon restart used deliberately as the
fresh-profile mechanism).

## Cross-references

- Epic evidence reports (same folder): `autosave-epic-verification.md` (E2 #131),
  `export-import-epic-verification.md` (E3 #132, incl. the #148 defect catch→fix PR #173),
  `trust-surfaces-epic-verification.md` (E4 #133), `print-hide-audit-e4.md` (#153).
- Umbrella tree: #129 → #130 ✅ · #131 ✅ · #132 ✅ · #133 ✅ · #134 (this gate) with
  #176 ✅ #177 ✅ #178 ✅ #179 (this report) #180 (closeout checklist).
