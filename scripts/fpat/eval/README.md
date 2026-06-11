# FPAT Umbrella 2 — Eval Audit Suite (Phase-1 + Phase-2)

Read-only, deterministic. Raw metrics only — no thresholds, no pass/fail, never a CI gate.
All audits exit `0` even on "bad" numbers; non-zero means a tooling error only.

## 1. The audits

| Script | Domain | Stage | Writes |
|---|---|---|---|
| `audit-throughput.mjs` | throughput (Phase-1) | independent | `docs/reports/<date>/throughput.json` |
| `audit-planning-accuracy.mjs` | planning-accuracy (5) | independent | `docs/reports/<date>/planning-accuracy.json` |
| `audit-workflow-reliability.mjs` | workflow-reliability (3) | independent | `docs/reports/<date>/workflow-reliability.json` |
| `audit-signal-quality.mjs` | signal-quality (8) | **second stage** — consumes the two reports above | `docs/reports/<date>/signal-quality.json` |

- **Throughput** — recomputes closed `flow-pack` issue / merged `flow-pack` PR counts vs a
  prior claim; cycle/merge-time distributions. Official baseline: **33 / 21**
  (see `docs/reports/2026-06-07/throughput-mismatch-analysis.md`).
- **Planning-accuracy** — compliance vs the FPAT contracts: branch naming and commit format
  (`.claude/rules/flow-pack-agent-team/`), exactly-5 sub-issues per `type:epic` (native
  hierarchy API), `Closes #<issue>` linkage in merged PR bodies. Merged-PR `headRefName` is
  the durable branch record (branches are deleted post-merge).
- **Workflow-reliability** — per-workflow + aggregate success/skipped/cancelled/failure for
  the four FPAT workflows, average duration, project-sync cancellation rate. Run history is
  **non-stationary**: the report records `asOf`, and `--until <date>` pins a reproducible
  windowed tally alongside the raw one.
- **Signal-quality** — label-coverage drift (FPAT-looking work missing `flow-pack` — a
  *heuristic*, candidates only; `flow-pack` items missing `type:`/`phase:`/`area:`),
  cancelled/skipped runs superseded by a later same-event success (benign-looking noise) vs
  not (potentially lost work), and gate false negatives (contract violations that merged).

## 2. What none of this proves

- That FPAT **improved** delivery — single baseline (n=1), no comparison cohort. Never claim it.
- Board / Projects-v2 consistency (domain 4) — **deferred** until the `FPAT_PROJECT_TOKEN`
  decision; no audit here needs that token.
- That a heuristic "FPAT-looking" candidate *should* carry `flow-pack` — human confirmation
  required; the Phase-1 filter is never auto-adjusted.
- Root causes (timing outliers, cancellation causes) — supported, not established.

## 3. Required permission / dependency

- `gh` CLI authenticated with **read-only** access to `w7-mgfcode/cvforge-ai`; local git clone
  with `origin/main` fetched (commit-format check).
- Uses `gh issue list` / `gh pr list` / `gh run list` / best-effort `gh api graphql`
  (sub-issue counts). **No GitHub writes. No `FPAT_PROJECT_TOKEN`.**
- Shared infra: `lib/{gh,stats,report,schema}.mjs` (Zod envelope: `domain, schemaVersion,
  generatedAt, scope, inputs, metrics, findings, inferred, proven, notProven, confidence`).
  Schema `.parse()` is an internal-error guard only — it never gates on metric values.

## 4. Run commands

```bash
cd /home/w7-hector/w7-workspace/repos/work/w7-mgfcode/platform/cvforge-ai

# Phase-1
node scripts/fpat/eval/audit-throughput.mjs --prior-issues 37 --prior-prs 25

# Phase-2 stage 1 (independent, order-free)
node scripts/fpat/eval/audit-planning-accuracy.mjs
node scripts/fpat/eval/audit-workflow-reliability.mjs --until 2026-06-07

# Phase-2 stage 2 (needs both stage-1 reports from the same <date> dir,
# or pass --planning / --reliability paths explicitly)
node scripts/fpat/eval/audit-signal-quality.mjs
```

## 5. How to interpret results

- Counts/rates are **data, not verdicts** — a "low" compliance rate is a measured signal to
  discuss, never a failure.
- Reliability numbers are only comparable at the same `asOf`/`--until`; the historical
  `56/14/30` is a stale snapshot, never a benchmark.
- `inferred` lists are candidates needing human confirmation; `notProven` lists are claims
  the data does NOT support — keep both when quoting a report.
