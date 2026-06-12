# Export/Import Round-Trip Verification — Epic #132 (#149)

**Date:** 2026-06-12 · **Epic:** #132 (JSON export/import round-trip) · **Verdict: all scenarios ✅,
one real defect found and fixed (#148 / PR #173).**

Scripted session in real Chrome (agent-browser) against `npm run dev` @ `localhost:3000/studio`,
main @ `92087d0` (re-verification of the S4 fix @ `263b99e`). Methodology per the E2 playbook:
real keystrokes for controlled inputs; Blob capture via instrumented `URL.createObjectURL` /
anchor `download` attr; deep-equality via `JSON.stringify` comparison in Node.

## S1 — Round-trip deep-equality

1. Edited the live document by real keystrokes (marker `RT-149` in the candidate name); autosave
   persisted it (`editedPersisted: true`).
2. Export → captured Blob; filename `cv-rt-149gabor-szabo-2026-06-12.json` (NFKD slug of the
   edited name + local date — convention holds for the edited document too).
3. Reset-to-sample (#151 control, confirm path) → marker gone from storage (`resetToSample: true`).
4. Imported the exported file → confirm dialog → accept.
5. **`JSON.stringify(persisted.doc) === JSON.stringify(exported.doc)` → `true`** and the marker
   was restored. Export → wipe → import is lossless: content + design + metadata.

## S2 — Error-class sweep (crafted invalid files)

| Fixture | Rendered class (`data-import-error`) | Document untouched |
|---------|---------------------------------------|--------------------|
| malformed JSON | `invalid-json` | ✅ |
| valid shell, bogus `doc` payload | `invalid-document` (first problem at: `doc.content`) | ✅ |
| `schemaVersion: 2` | `wrong-version` ("…this build reads version 1") | ✅ |
| missing `savedAt` | `invalid-envelope` (first problem at: `savedAt`) | ✅ |

No confirm dialog fires on any invalid file; each class renders a distinct message; the live
document (still carrying the `RT-149` marker at that point) stayed byte-identical throughout.
`file-read` is not drivable from this harness (requires a `file.text()` rejection) — shares the
single rendering path proven above.

## S3 — Print preview across 3 templates (max E3 chrome)

Printed via print-to-PDF with the **import error visible on screen** plus all footer chrome:
`dossier` / `ats` / `visual` each contained resume content only — zero chrome leakage. The A4
compliance HUD reported 0 overflow warnings throughout.

## S4 — Defect found: dismiss X clipped out of the footer column

Real-pointer dismissal failed for long messages (`invalid-envelope`): the error row's flex
`min-width:auto` overflowed the footer's available width instead of truncating, clipping the X
outside the visible center column (`elementsFromPoint` did not contain the button) and displacing
the Export/Import buttons. Programmatic `.click()` worked — pure layout. PR #172's check had
passed only because the shorter `invalid-json` message left the X reachable.

**Fix:** `min-w-0` on the error row (PR #173, `263b99e`), letting `truncate` bind. Re-verified at
the failing viewport (1280×577): hit-target is the button, real click dismisses, Export/Import
stay visible with the error shown.

## Cross-references

Per-PR evidence: #165 (chrome+print), #168 (export envelope/filename/revocation + storage-refactor
regression), #170 (pipeline: confirm/cancel/re-select/deep-equal), #172 (error surface), #173
(dismiss fix). Expected-vs-actual table recorded as a comment on epic #132.
