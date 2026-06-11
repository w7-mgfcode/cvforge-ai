# Eval Fixtures — synthetic "fixtureverse" dataset for offline audit runs

Deterministic, GitHub-free inputs for every script in `scripts/fpat/eval/`.
**Everything in here is synthetic.** Issue/PR/run/board contents describe a fictional
mini-repo designed to exercise audit code branches — never cite numbers from fixture
reports as real FPAT delivery data (the official baseline lives in
`docs/reports/`, e.g. the 33/21 throughput baseline).

## How it works

- `FPAT_EVAL_FIXTURES=<dir>` makes every `lib/gh.mjs` wrapper read a canonical JSON
  file from `<dir>` instead of spawning `gh` (one pre-filtered file per wrapper —
  zero loader logic), and makes `audit-planning-accuracy.mjs` read
  `git-log-subjects.txt` instead of running `git log`.
- In fixture mode, reports default to a per-process **temp dir** (or
  `FPAT_EVAL_REPORT_DIR` if set) — fixture runs can never overwrite real
  `docs/reports/<date>/` artifacts.
- File shapes mirror the exact `--json` field lists in `lib/gh.mjs` /
  `gh project --format json`, frozen as of **gh 2.46.0**. If a gh upgrade changes
  shapes, the live audits notice first; update fixtures to match the wrappers.

## Layout

| Path | Consumed by |
|---|---|
| `github/issues-{all,closed}.json`, `prs-{all,merged}.json` | throughput, planning-accuracy, signal-quality, board-consistency |
| `github/runs-fpat-*.json` | workflow-reliability (→ signal-quality supersession); `runs-fpat-project-sync.json` also feeds the #73 cancellation analysis |
| `github/subissue-counts.json` | throughput `--with-subissues`, planning-accuracy fan-out (`6` absent → `null` branch) |
| `github/git-log-subjects.txt` | planning-accuracy commit-format |
| `github/project-{view,fields,items}.json` | board-consistency (live path) |
| `github-degraded/` | board-consistency degraded path (intentionally empty — see its README) |
| `scorecard/*.json` | `check-scorecard.mjs --manifest` via the check-fixtures scorecard cases (2 valid + 3 invalid; #107–#109) |
| `expected/*.json` | goldens for `check-fixtures.mjs`, stored **normalized** |

## Deliberate drift baked into the dataset

The dataset makes every audit branch execute, including ones the real repo/board has
never triggered: branch/commit/linkage violations (PR #11, `wip: tweak things`),
non-exactly-5 and null fan-outs, an FPAT-looking unlabeled issue/PR (#6/#11), taxonomy
gaps (#1/#3, PRs #12/#13), all four supersession quadrants, a queue-collapse overlap cluster (project-sync runs
119–121: cancelled 120's short queued window overlaps in-progress 119 and superseder
121 — #73's analysis pattern), `--until` windowing (run
108 is outside the cutoff), a missing field (Estimate), option drift (Status lacks
Blocked), off-board flow-pack PRs (#12/#13), label↔field mismatches on both item kinds
(Issue #4 phase, board-only PR #14 phase), unset synced fields (#5/#10),
closed-not-Done (#3/#10), Done-but-open (#5), an epic
missing Score (#2), an epic below the 40 gate off Backlog (#3), and a DraftIssue.

## Scorecard manifests (`scorecard/`)

Synthetic manifests for the `lib/scorecard.mjs` contract (#74) — **every number is
fiction**, same rule as the rest of the fixtureverse; never quote them as delivery
data (the only real manifest is `docs/reports/2026-06-11/baseline-manifest.json`).

- `valid-full.json` — every metric block populated with deliberately ugly-but-legal
  values (cancelRate 0.94, complianceRate 0, ratio 2250): `check-scorecard.mjs`
  must exit 0 on all of them, because the contract carries no thresholds.
- `valid-minimal.json` — only the always-required blocks; the `notMeasured` blocks
  are a mix of explicit `null` and absent, both meaning "not measured at baseline",
  never "zero problems".
- `invalid-{schema-version,missing-baseline,out-of-range-rate}.json` — INVALID ON
  PURPOSE, each failing on exactly one contract point (wrong `schemaVersion`
  literal; missing `officialBaseline`, the only always-required block;
  `cancelRate: 1.5` outside `[0,1]`). `check-scorecard.mjs` must exit 1 on each.
  Range bounds are CONTRACT, not thresholds: 0.94 is legal data, 1.5 is not a rate.

These five mirror the epic #74 acceptance criteria: the suite is a **dev tool,
never a CI gate**, and exits 0 on "bad" metric values — non-zero means a
contract/tooling error only, never a measured number.

```bash
node scripts/fpat/eval/check-scorecard.mjs --manifest scripts/fpat/eval/__fixtures__/scorecard/valid-full.json
node scripts/fpat/eval/check-scorecard.mjs --manifest scripts/fpat/eval/__fixtures__/scorecard/invalid-out-of-range-rate.json  # exit 1
```

## Commands

```bash
# Single audit, offline:
FPAT_EVAL_FIXTURES=scripts/fpat/eval/__fixtures__/github \
  node scripts/fpat/eval/audit-throughput.mjs --prior-issues 33 --prior-prs 21 --with-subissues

# Degraded board-consistency, offline:
FPAT_EVAL_FIXTURES=scripts/fpat/eval/__fixtures__/github-degraded \
  node scripts/fpat/eval/audit-board-consistency.mjs

# All twelve fixture runs vs goldens — 7 audit + 5 scorecard (dev tool, exit 1 on mismatch):
node scripts/fpat/eval/check-fixtures.mjs

# Regold after an INTENTIONAL audit change (inspect the diff before committing):
node scripts/fpat/eval/check-fixtures.mjs --update
```

## Normalization (why goldens aren't full reports)

`check-fixtures.mjs` strips volatile fields from both sides before comparing:
`generatedAt`, `inputs` (signal-quality embeds temp paths), `metrics.asOf`,
`metrics.sources`, and ISO timestamps inside `findings` strings
(workflow-reliability embeds `asOf` there). Goldens are stored already-normalized,
so they are comparison artifacts, not schema-complete reports.

Scorecard-case goldens capture `{exitCode, stdout, stderr}` with absolute fixture
paths replaced by `<fixtures>` and Zod issue messages by `<zod-message>` — issue
PATHS are the stable contract; message wording may drift across zod upgrades
(`^4.4.3` is semver-ranged). `--update` refuses an exit-code flip, so a regold can
never silently turn an accept case into a reject case (or vice versa).
