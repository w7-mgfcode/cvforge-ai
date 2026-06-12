# Trust-Surfaces Verification — Epic #133 (#154)

**Date:** 2026-06-12 · **Epic:** #133 (persistence trust surfaces) · **Verdict: all scenarios ✅.**

Scripted session in real Chrome (agent-browser) against `npm run dev` @ `localhost:3000/studio`,
main @ `ce9fc91`. All surfaces exercised against the real `src/lib/storage.ts` module — driven by
real keystrokes plus `Storage.prototype` overrides (the established E2-playbook equivalents of
direct module calls, which dev-bundled modules don't expose to the console). Badge transitions
recorded by a `MutationObserver` on `data-save-state`.

## S1 — Baseline

Fresh load: badge present in the 64px nav, synchronous initial state `saved` replayed on
subscribe; warning banner absent.

## S2 — Badge state machine + warning negative case

`setItem` blocked post-load + real keystroke → observer log `saved → error`; **banner stayed
absent during the transient `error`** (acceptance-pinned negative). Restore + retype →
`error → saved`. (`saving → saved` is synchronous with localStorage writes and batches into one
render — by design, per the E2 evidence.)

## S3 — Reset escape hatch

- Edit marker persisted, confirm row opened, **Cancel** → marker still persisted, zero
  `removeItem` calls, no badge transitions.
- Reopen, **Reset** → instrumented `removeItem` log: `["cvforge.document",
  "cvforge.document.backup"]` (both keys, per the E1 `clearDocument` contract), sampleCV restored
  and re-persisted, badge flow `saved → idle → saved`.

## S4 — Storage-unavailable degradation

`Storage.prototype.setItem` broken on the landing page, client-side navigation to `/studio` →
E1 probe fails → badge `unavailable`, banner visible: *"Saving unavailable — changes are kept in
memory only"*, computed `pointer-events: none` (can never block a control). Real keystrokes
continued to edit the document in-memory (`DEGRADED-OK` marker rendered live).

## S5 — Session recovery

Fresh reload (overrides gone): banner absent, badge `saved`, pristine sample persisted — the
degraded-mode edit was correctly never written. Honest failure, no pretend-saving.

## Print

Print-hide of every surface (badge, reset idle + open confirm row, visible banner) across
`dossier`/`ats`/`visual` in the worst-case state: covered by the #153 audit
(`docs/reports/2026-06-12/print-hide-audit-e4.md`, PR #171) — zero leaks.

## Cross-references

Per-PR evidence: #166 (badge incl. unsubscribe-on-unmount), #167 (reset incl. autosave interplay),
#169 (banner incl. probe-vs-write semantics). Expected-vs-actual table recorded as a comment on
epic #133.
