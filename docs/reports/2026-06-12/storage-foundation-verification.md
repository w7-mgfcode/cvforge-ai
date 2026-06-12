# Storage Foundation Verification — Manual Corrupt-Payload Procedure (#139)

**Date:** 2026-06-12 · **Epic:** #130 (`feat(lib): versioned persistence core`) ·
**Module under test:** `src/lib/storage.ts` @ `01b1a44` (after PRs #155, #156, #157, #158)

The repo deliberately has no test runner (`CLAUDE.md`: validation = lint + build + manual
checks). This document is the repeatable manual procedure proving the epic's failure-taxonomy
acceptance criteria, with results recorded from a real Chromium session via DevTools-equivalent
console evaluation.

## Why a temporary exposure page is needed

Foundation ships UI-free — **no component imports `src/lib/storage.ts`** (verified:
`grep -rln "from '@/lib/storage'" src` → no matches). The module therefore never appears in any
page bundle, so a plain DevTools session on `/studio` cannot reach it. Verification uses a
**temporary, never-committed** page that exposes the module on `window`:

```tsx
// src/app/storage-lab/page.tsx  — TEMPORARY, delete after verification
'use client';
import { useEffect } from 'react';
import * as storage from '@/lib/storage';

declare global {
  interface Window { __cvforgeStorage?: typeof storage; }
}

export default function StorageLabPage() {
  useEffect(() => { window.__cvforgeStorage = storage; }, []);
  return <main style={{ padding: 16 }}>storage-lab: window.__cvforgeStorage armed</main>;
}
```

Once epic #131 wires `loadDocument()` into `/studio`, the seed cases below reproduce directly
on `/studio` (seed → reload → observe which document hydrates) and the exposure page becomes
unnecessary.

## Procedure

1. `npm run dev`, open `http://localhost:3000/storage-lab`, open the DevTools console.
2. Paste **Script A** (cases 1–4 + round-trip + guard + clear). It is self-contained and
   self-cleaning (`localStorage.clear()` at the end).
3. **Reload the page**, then paste **Script B** (case 5 — blocked storage). The reload matters:
   storage availability is a one-time cached probe by design, so the blocked state must be
   simulated on a fresh module instance before any storage function runs.
4. Delete `src/app/storage-lab/page.tsx`.

### Script A — seed cases 1–4, round-trip, last-write-wins, clear

```js
(() => {
  const S = window.__cvforgeStorage;
  const { STORAGE_KEY, BACKUP_KEY, SCHEMA_VERSION } = S;
  const results = [];
  const run = (name, expected, fn) => {
    try { results.push({ name, expected, actual: fn() }); }
    catch (e) { results.push({ name, expected, actual: 'THREW: ' + e.message }); }
  };

  // case 1: missing key
  localStorage.clear();
  run('missing key', 'fallback, available, no backup', () => {
    const r = S.loadDocument();
    return `source=${r.source} available=${r.storageAvailable} backup=${localStorage.getItem(BACKUP_KEY) === null ? 'none' : 'present'}`;
  });

  // case 2: invalid JSON
  localStorage.clear();
  localStorage.setItem(STORAGE_KEY, '{definitely not json');
  run('invalid JSON', 'fallback + raw preserved under backup key', () => {
    const r = S.loadDocument();
    return `source=${r.source} backupEqualsRaw=${localStorage.getItem(BACKUP_KEY) === '{definitely not json'}`;
  });

  // case 3: valid JSON, wrong shape
  localStorage.clear();
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ foo: 1 }));
  run('valid-JSON-wrong-shape', 'fallback + backup preserved', () => {
    const r = S.loadDocument();
    return `source=${r.source} backupEqualsRaw=${localStorage.getItem(BACKUP_KEY) === JSON.stringify({ foo: 1 })}`;
  });

  // case 4: wrong schemaVersion (valid doc inside)
  localStorage.clear();
  run('round-trip pre-step', 'saved', () => S.saveDocument(S.loadDocument().doc).status);
  const validEnvelope = JSON.parse(localStorage.getItem(STORAGE_KEY));
  localStorage.clear();
  const wrongVersion = JSON.stringify({ ...validEnvelope, schemaVersion: SCHEMA_VERSION + 1 });
  localStorage.setItem(STORAGE_KEY, wrongVersion);
  run('wrong schemaVersion', 'fallback + backup preserved', () => {
    const r = S.loadDocument();
    return `source=${r.source} backupEqualsRaw=${localStorage.getItem(BACKUP_KEY) === wrongVersion}`;
  });

  // round-trip + subscription transitions
  localStorage.clear();
  run('save->load round-trip + transitions', 'saved; source=storage; saving,saved emitted', () => {
    const seen = [];
    const unsub = S.subscribeSaveState(s => seen.push(s));
    const doc = S.loadDocument().doc;
    const sv = S.saveDocument(doc);
    const back = S.loadDocument();
    unsub();
    const deepEq = JSON.stringify(back.doc) === JSON.stringify(doc);
    return `save=${sv.status} source=${back.source} deepEqual=${deepEq} transitions=${seen.join(',')}`;
  });

  // last-write-wins guard with a future savedAt
  run('newer stored savedAt', 'skipped-newer, storage untouched', () => {
    const env = JSON.parse(localStorage.getItem(STORAGE_KEY));
    env.savedAt = new Date(Date.now() + 3600000).toISOString();
    const raw = JSON.stringify(env);
    localStorage.setItem(STORAGE_KEY, raw);
    const r = S.saveDocument(S.loadDocument().doc);
    return `status=${r.status} untouched=${localStorage.getItem(STORAGE_KEY) === raw}`;
  });

  // clearDocument
  run('clearDocument', 'both keys removed, state idle', () => {
    let last; const unsub = S.subscribeSaveState(s => { last = s; });
    S.clearDocument(); unsub();
    return `primary=${localStorage.getItem(STORAGE_KEY)} backup=${localStorage.getItem(BACKUP_KEY)} state=${last}`;
  });

  localStorage.clear();
  return results;
})()
```

### Script B — case 5: blocked storage (run on a fresh page load)

```js
(() => {
  const S = window.__cvforgeStorage;
  // Simulate blocked storage BEFORE any module function runs this page-load:
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    get() { throw new DOMException('Access is denied for this document.', 'SecurityError'); }
  });
  const seen = [];
  const unsub = S.subscribeSaveState(s => seen.push(s));
  const l = S.loadDocument();
  const sv = S.saveDocument(l.doc);
  let cleared = 'no-throw';
  try { S.clearDocument(); } catch (e) { cleared = 'THREW: ' + e.message; }
  unsub();
  return `load: source=${l.source} available=${l.storageAvailable}; save=${sv.status}; clear=${cleared}; transitions=${seen.join(',')}`;
})()
```

## Recorded results (Chromium via CDP, 2026-06-12)

### Script A

| # | case | expected | actual | verdict |
|---|------|----------|--------|---------|
| 1 | missing key | fallback, `storageAvailable=true`, **no** backup | `source=fallback available=true backup=none` | ✅ |
| 2 | invalid JSON | fallback + raw preserved under `BACKUP_KEY` | `source=fallback backupEqualsRaw=true` | ✅ |
| 3 | valid-JSON-wrong-shape | fallback + backup preserved | `source=fallback backupEqualsRaw=true` | ✅ |
| 4 | wrong `schemaVersion` | fallback + backup preserved | `source=fallback backupEqualsRaw=true` | ✅ |
| — | save→load round-trip | `saved`; `source=storage`; deep-equal; `saving`,`saved` emitted | `save=saved source=storage deepEqual=true transitions=saved,saving,saved`¹ | ✅ |
| — | newer stored `savedAt` | `skipped-newer`, storage byte-identical | `status=skipped-newer untouched=true` | ✅ |
| — | `clearDocument` | both keys removed, state `idle` | `primary=null backup=null state=idle` | ✅ |

¹ The first `saved` in `transitions` is the contract's immediate synchronous emit of the
*current* state on subscribe (a save had already run in the same page session); the
transition pair under test is the trailing `saving,saved`.

### Script B (fresh page load)

| # | case | expected | actual | verdict |
|---|------|----------|--------|---------|
| 5 | blocked storage | load falls back with `storageAvailable=false`; save `unavailable`; clear no-throw; state `unavailable` | `load: source=fallback available=false; save=unavailable; clear=no-throw; transitions=idle,unavailable` | ✅ |

## Supplementary evidence (per-sub-issue harness runs)

Each implementation PR also ran a Node harness against the tsc-compiled module with a mocked
`localStorage` (procedure + per-case tables recorded as issue comments):

- #136 — load failure taxonomy incl. `CVDocumentSchema.safeParse(sampleCV).success === true`: **10/10**
- #137 — save path, last-write-wins, quota, clear: **9/9**
- #138 — subscription contract, unsubscribe, throwing listener, zero-quota probe: **8/8**

## Conclusion

All five seed cases required by #139 pass against the real module in a real browser; the epic's
fail-safe promise holds: **no corrupt payload ever crashes the load path, no payload is silently
destroyed (backup-key preservation), and blocked storage degrades to a flagged in-memory no-op.**
