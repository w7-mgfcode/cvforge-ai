# Autosave Epic Verification — Reload-Survival Browser Evidence (#144)

**Date:** 2026-06-12 · **Epic:** #131 (`feat(studio): autosave + hydration-safe load`) ·
**Code under test:** `src/app/studio/page.tsx` @ `612a780` (after PRs #160, #161, #162, #163)

The repo's only test layer is the real browser (`CLAUDE.md`: no test runner; `ui-design.md`:
real-browser proof of done). All scenarios ran against a clean `next dev` instance on `:3000`
in Chromium via CDP, with `localStorage` cleared at the start of the session.

## Instrumentation

Write counting patches `Storage.prototype.setItem` from the console and logs timestamps for
writes to `cvforge.document` only. For scenarios that survive navigation (S2), the log is
persisted into a sidecar `localStorage` key via the original setter. Timing claims compare
against `AUTOSAVE_DEBOUNCE_MS = 750`: when an edit→event sequence completes in under 750ms,
any observed write is provably the flush, not the debounce timer.

## Scenarios — expected vs. actual

| # | scenario | expected | actual | verdict |
|---|----------|----------|--------|---------|
| S1 | edit → wait past debounce → reload | edit restored | input and rendered page both show the edit after reload | ✅ |
| S2 | edit → hide tab (368ms after edit, inside the 750ms window) → reload | pending save flushed at hide; edit restored | exactly **1** write, at the hide instant (Δ < 60ms); restored after reload | ✅ |
| S3 | 21-keystroke type-storm | ≤ 1 write per debounce window | **1 write, 1 window**; stored doc contains the full typed text | ✅ |
| S4 | stored doc with marker name + aged `savedAt`, then reload | no pre-hydration write ever clobbers the stored doc | marker doc rendered AND still in storage; `savedAt` refreshed only by the post-hydration write-back of the *marker* doc | ✅ |
| S5 | console across fresh load + reload (fresh browser session) | no hydration warning/mismatch, no errors | **0** matches for hydration/mismatch/error/warning patterns | ✅ |
| S6 | print spot-check with the persisted doc | A4 context renders, no overflow warnings, render matches storage | 1 `.a4-page-context`, `dossier` template, 0 overflow warnings, rendered name == stored envelope name | ✅ |

Conflict handling (skipped-newer single-retry re-hydration, guard reset on successful save,
`unavailable` leaving editing functional) was verified scenario-by-scenario in PR #163 and is
not repeated here.

## Notes & environment gotchas (for reproduction)

1. **`npm run build` corrupts a running dev server** — both write `.next/`. Symptom: page HTML
   200 but every JS chunk 404, React never boots, all "no write" observations meaningless.
   Always restart `next dev` (with `rm -rf .next`) after running the build gate, and confirm
   `react_booted` before trusting any negative result.
2. **A second `next dev` silently binds `:3001`** if `:3000` is still held — verify the port
   from the dev log before opening the browser.
3. **Console buffers span the session** — a `changed size between renders` warning observed
   mid-session was a fast-refresh artifact (deps array grew from `[cvData, hydrated]` to
   `[cvData, hydrated, handleSaveResult]` when #143 hot-swapped in). A fresh browser session
   against the final code shows zero warnings (S5).
4. **Synthetic React input events don't drive controlled inputs reliably** (native-setter +
   `dispatchEvent('input')` set the DOM value but never reached React state in this setup) —
   use real keystrokes (`agent-browser type`) and prove timing with the write log instead.
5. `agent-browser close --all` resets the browser profile — `localStorage` does not survive
   it; re-seed before continuing a scenario chain.

## Conclusion

Every #131 acceptance criterion has recorded browser proof: reload survival, hide-flush
survival, write coalescing, hydration safety (no mismatch, no clobber), and print fidelity
are all demonstrated against the merged epic code at `612a780`.
