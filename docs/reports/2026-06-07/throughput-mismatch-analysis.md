# Phase-1 Throughput Mismatch Analysis

**Date:** 2026-06-07 · **Scope:** FPAT Umbrella 2 — Track B Phase-1 (read-only, raw metrics)
**Companion artifact:** [`throughput.json`](./throughput.json) · **Script:** `scripts/fpat/eval/audit-throughput.mjs`

Why the reproducible count (**33 / 21**) differs from the prior claim (**37 / 25**).

**Run (read-only):** `node scripts/fpat/eval/audit-throughput.mjs --prior-issues 37 --prior-prs 25`
**Output:** 33 closed flow-pack issues / 21 merged flow-pack PRs · match vs prior claim (37 / 25): **false**
· issue cycle median 0.86h, p90 81.36h, max 87.17h · PR merge median 0.02h, p90 0.27h, max 2.3h.

## 1. Strict reproducible baseline

- **33** closed `flow-pack` issues
- **21** merged `flow-pack` PRs
- issue/PR ratio: 1.57 · type breakdown: 1 umbrella + 5 epics + 27 sub-issues = 33 (internally consistent)

## 2. Broader manual activity envelope

- **37** closed issues (all, any label)
- **25** merged PRs (all, any label)

## 3. Cause: scope/filter, not dates or a bug

The difference is entirely **scope**. Verified read-only:

- **No date boundary** is applied on either side → not the cause.
- The script uses GitHub issue **`closed`** state (not Projects board `Status=Done`).
- The recompute is internally consistent (1+5+27 = 33); no calculation error.
- The decisive factor is the strict **`flow-pack` label** requirement on both issues and PRs.

## 4. Strict filters (what `audit-throughput.mjs` counts)

- **Issues:** `gh issue list --state closed --label flow-pack`
- **PRs:** `gh pr list --state merged`, then code-filtered to PRs carrying the `flow-pack` label
- **Boundary:** `all-flow-pack` — an explicit **proxy** for "Umbrella #1", not a verified umbrella subtree.

## 5. Excluded items (37−33 = 4 issues, 25−21 = 4 PRs)

The 8 excluded items fall into **three distinct categories** — the envelope is *not* a clean superset of FPAT delivery:

| Item | Label | Category | Correctly excluded? |
|---|---|---|---|
| #29 — rollup-gate live verification (DISPOSABLE) epic | `type:epic` | Disposable test artifact | ✅ yes (noise) |
| #30 — rollup-gate test child (DISPOSABLE) | `type:sub-issue` | Disposable test artifact | ✅ yes (noise) |
| #62 — PDF export drops content (print bug) | `bug` | Product bug | ⚪ judgment call |
| #20 — failing Vercel PR deployments (deploy bug) | `bug, area:github-workflows` | Deploy bug | ⚪ judgment call |
| #63 — preserve résumé content in PDF export (PR) | `bug` | Product bug fix | ⚪ judgment call |
| #24 — set Vercel output dir for static export (PR) | `bug, area:github-workflows` | Deploy bug fix | ⚪ judgment call |
| #14 — bootstrap-board.sh dry-run (PR) | *(none)* | **Genuine FPAT work, missing label** | ❌ under-counted |
| #12 — land fpat foundation + context layer (PR) | *(none)* | **Genuine FPAT work, missing label** | ❌ under-counted |

**Reading:** 🟢 #29/#30 are test noise (strict filter is *more* accurate here); 🔴 #12/#14 are real FPAT
foundation PRs missing the `flow-pack` label (a label-coverage gap, not a scope choice); 🟡 the four
`bug` items are product/deploy fixes whose membership in "FPAT delivery" is definitional.

## 6. Recommendation

- **Keep 33 / 21** as the **strict reproducible baseline** (deterministic `flow-pack` taxonomy).
- **Keep 37 / 25** as the **broader FPAT-era / manual activity envelope** (noisy; not a benchmark).
- **Do not adjust the Phase-1 filter yet.** The mismatch is useful signal: `flow-pack` label coverage
  is incomplete (#12/#14), which belongs to the eval's Planning-Accuracy / Signal-Quality domains.
- **Do not claim improvement** from this run — single baseline (n=1), no comparison cohort.

### Baseline usage going forward (Phase-2 decision)

| Baseline | Use for | Not for |
|---|---|---|
| **33 / 21** | Official measurable baseline — audit / eval / regression; **Phase-2 builds on this** | — |
| **37 / 25** | Communication / historical envelope | Benchmark baseline |

A precise Umbrella #1 boundary, if ever needed, should be derived from the **native issue hierarchy**
(umbrella #1 `subIssues` subtree + linked PRs) — not from the `flow-pack` proxy nor the raw envelope.

---

*Read-only analysis. No product code changed; no GitHub state mutated. Counts verified live via `gh` on 2026-06-07.*
