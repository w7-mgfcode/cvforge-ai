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
| `audit-board-consistency.mjs` | board-consistency (4) | independent — **degraded-first** (see §3) | `docs/reports/<date>/board-consistency.json` |

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
- **Board-consistency** — Projects v2 board #2 vs board-spec and issue/PR state: field
  catalog + option drift, `flow-pack` ↔ board membership (auto-add effectiveness),
  `type:`/`phase:`/`area:` label ↔ field sync, Status vs issue-state coherence, and the
  epic Score ship-gate signal (reported, never enforced). Board blocks are `null` when
  run degraded — `null` means *not measured*, never "zero problems". Membership uses the
  CURRENT `flow-pack` label, so the 2026-06-11 no-mutation decision on historical label
  gaps (#12/#14) is honored by construction; degraded runs do NOT fall back to label-only
  checks (that is signal-quality's domain).

## 2. What none of this proves

- That FPAT **improved** delivery — single baseline (n=1), no comparison cohort. Never claim it.
- WHY board field values drifted (board-consistency reads current state only; sync-trigger
  history is non-stationary) — and a degraded board-consistency run proves nothing about the
  board at all (blocks are `null` = not measured).
- That a heuristic "FPAT-looking" candidate *should* carry `flow-pack` — human confirmation
  required; the Phase-1 filter is never auto-adjusted.
- Root causes (timing outliers, cancellation causes) — supported, not established.

## 3. Required permission / dependency

- `gh` CLI authenticated with **read-only** access to `w7-mgfcode/cvforge-ai`; local git clone
  with `origin/main` fetched (commit-format check).
- Uses `gh issue list` / `gh pr list` / `gh run list` / best-effort `gh api graphql`
  (sub-issue counts). **No GitHub writes. No `FPAT_PROJECT_TOKEN` needed for domains 3/5/8.**
- **Domain 4 only (`audit-board-consistency.mjs`)** additionally reads user-owned Projects v2
  via `gh project view/field-list/item-list`, which the plain repo token cannot. Access order:
  1. `FPAT_PROJECT_TOKEN` env var, if set — a **read-only** PAT (fine-grained "Projects: read"
     or classic `read:project`), applied per-call as `GH_TOKEN` to project queries ONLY;
  2. otherwise the ambient `gh` login, if it carries the `project` scope;
  3. otherwise **degraded mode**: the report is still written with `access.degraded=true`,
     `tokenSource='none'`, all board blocks `null`, and exit code 0 (a missing token is a
     measured precondition, not a tooling error).
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

# Domain 4 (independent; degraded-first — runs with or without project access)
node scripts/fpat/eval/audit-board-consistency.mjs   # [--project 2] [--owner w7-mgfcode] [--limit 1000]
```

## 5. How to interpret results

- Counts/rates are **data, not verdicts** — a "low" compliance rate is a measured signal to
  discuss, never a failure.
- Reliability numbers are only comparable at the same `asOf`/`--until`; the historical
  `56/14/30` is a stale snapshot, never a benchmark.
- `inferred` lists are candidates needing human confirmation; `notProven` lists are claims
  the data does NOT support — keep both when quoting a report.
