# FPAT Umbrella 2 — Phase-1 Implementation Handoff / Dry-Run Package

> **Status:** Approved scope — read-only Phase-1 dry-run only.
> **Produced by:** the graph-powered solution packaging team. This is a handoff package for a
> coding agent (Claude Code / Codex) or a developer to execute. Preparing it touched no product
> code, no GitHub state, and no board.
> **Decision basis:** cvforge-ai team decision summary (Track A frozen; Track B Phase-1 approved).

---

## 1. Goal

Build the **minimal, deterministic, read-only** foundation of the FPAT evaluation harness and prove
the **throughput** metric model against **real Umbrella #1 data** before committing to the full
9-domain harness. Output is **raw metrics only** — no thresholds, no pass/fail, no CI gating.

This validates: *can we recompute Umbrella #1's delivery numbers deterministically from GitHub
state, and is the metric model meaningful?* Nothing more.

## 2. Hard constraints (from the approved decision)

- **Read-only against GitHub.** No issue/PR/label/milestone/board/workflow writes.
- **No `FPAT_PROJECT_TOKEN` required** — board/Projects-v2 audit is **deferred** to a later phase.
  (Throughput uses only `gh` issue/PR/run reads available with normal auth.)
- **No product code changes** — nothing under `src/**`.
- **No scheduled CI yet.** Manual run only.
- **No full Umbrella 2 issue tree.** The existing draft stays as planning material.
- **Scores are data, never CI gates.** A "low" number never fails a PR; scripts exit non-zero only
  on their own internal error.
- **Raw metrics only** — report values and distributions; do **not** assign thresholds or verdicts.
- **Mark inferred data as inferred.** Recomputed values are recomputed; do not trust prior tallies
  as ground truth (verify them).
- **Baseline only.** With n=1 closed umbrella, do **not** claim FPAT improved anything.

## 3. Target architecture (Phase-1 subset only)

```
scripts/fpat/eval/                 # NEW — sits beside existing read-only scripts/fpat/*.mjs
  lib/
    gh.mjs        # read-only `gh` JSON wrappers (issues, PRs)
    report.mjs    # writeReport(name, obj) → docs/reports/<date>/<name>.json
    stats.mjs     # deterministic count/min/max/mean/median/p90 helpers
    schema.mjs    # Zod shapes: DomainReport + ThroughputReport (validate before write)
  audit-throughput.mjs   # the only audit in Phase-1 (domain 1)
```

Everything else from the full blueprint (`vendor-research-output.md` §B.7) is **out of scope for
Phase-1**: reliability, board, planning, handoff, continuation, signal, portfolio audits, the
`scorecard.mjs` aggregator, and any scheduled CI job.

## 4. Eval report schema

Generic per-domain envelope + a throughput-specific `metrics` block. Uses Zod (already a repo
dependency — no new deps). Save as `scripts/fpat/eval/lib/schema.mjs`.

```js
// scripts/fpat/eval/lib/schema.mjs
import { z } from 'zod';

// Distribution of a numeric metric (durations in hours). Raw only — no thresholds.
export const DistributionSchema = z.object({
  count: z.number().int().nonnegative(),
  min: z.number().nullable(),
  max: z.number().nullable(),
  mean: z.number().nullable(),
  median: z.number().nullable(),
  p90: z.number().nullable(),
  unit: z.literal('hours'),
});

// Generic envelope every domain report shares (modeled on dark-factory feedback/*.json:
// per-criterion data + an explicit "what this proves / does not prove" summary).
export const DomainReportSchema = z.object({
  domain: z.string(),                  // e.g. "throughput"
  schemaVersion: z.literal('1.0.0'),
  generatedAt: z.string(),             // ISO timestamp
  scope: z.object({
    label: z.string(),                 // e.g. "flow-pack"
    umbrella: z.string(),              // e.g. "umbrella-1" or "all-flow-pack"
    note: z.string(),                  // how scope was determined (assumption flagged)
  }),
  inputs: z.array(z.string()),         // the gh queries actually run (provenance)
  metrics: z.record(z.string(), z.unknown()),  // domain-specific (see ThroughputMetrics)
  findings: z.array(z.string()),       // plain observations, NOT verdicts
  inferred: z.array(z.string()),       // anything not directly measured
  proven: z.array(z.string()),         // what these numbers DO establish
  notProven: z.array(z.string()),      // what they explicitly DO NOT establish
  confidence: z.enum(['low', 'medium', 'high']),
});

export const ThroughputMetricsSchema = z.object({
  closedIssues: z.number().int().nonnegative(),
  mergedPRs: z.number().int().nonnegative(),
  issueToPrRatio: z.number().nullable(),
  byTypeLabel: z.record(z.string(), z.number().int()),  // umbrella/epic/sub-issue counts
  issueCycleTimeHours: DistributionSchema,              // createdAt → closedAt
  prMergeTimeHours: DistributionSchema,                 // createdAt → mergedAt
  epicSubIssueCounts: z.array(z.object({                // best-effort; may be [] if deferred
    epic: z.number().int(),
    title: z.string(),
    subIssueCount: z.number().int().nonnegative(),
  })),
  baselineRecompute: z.object({                         // verify prior tallies, don't trust them
    priorClaimedClosedIssues: z.number().int().nullable(),  // 37 from intake (to verify)
    priorClaimedMergedPRs: z.number().int().nullable(),     // 25 from intake (to verify)
    recomputedClosedIssues: z.number().int(),
    recomputedMergedPRs: z.number().int(),
    matchesPriorClaim: z.boolean(),
  }),
});

export const ThroughputReportSchema = DomainReportSchema.extend({
  domain: z.literal('throughput'),
  metrics: ThroughputMetricsSchema,
});
```

## 5. Helper libs

```js
// scripts/fpat/eval/lib/gh.mjs  — read-only gh JSON wrappers
import { execFileSync } from 'node:child_process';

function gh(args) {
  // Throws on non-zero exit; callers handle. READ-ONLY commands only.
  const out = execFileSync('gh', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  return JSON.parse(out);
}

export function listClosedIssues({ label = 'flow-pack', limit = 1000 } = {}) {
  return gh([
    'issue', 'list', '--state', 'closed', '--label', label, '--limit', String(limit),
    '--json', 'number,title,createdAt,closedAt,labels,milestone,state',
  ]);
}

export function listMergedPRs({ limit = 1000 } = {}) {
  return gh([
    'pr', 'list', '--state', 'merged', '--limit', String(limit),
    '--json', 'number,title,createdAt,mergedAt,headRefName,labels,milestone',
  ]);
}

// Optional, best-effort: native sub-issue counts per epic (works with normal auth, issues:read).
// Degrades to [] if the hierarchy API is unavailable — Phase-1 does NOT depend on this.
export function subIssueCount(issueNumber, owner, repo) {
  try {
    const data = gh([
      'api', 'graphql', '-f', `query=
        query($owner:String!,$repo:String!,$n:Int!){
          repository(owner:$owner,name:$repo){
            issue(number:$n){ subIssues(first:100){ totalCount } }
          }
        }`,
      '-F', `owner=${owner}`, '-F', `repo=${repo}`, '-F', `n=${issueNumber}`,
    ]);
    return data?.data?.repository?.issue?.subIssues?.totalCount ?? null;
  } catch {
    return null; // deferred / unavailable — not an error in Phase-1
  }
}
```

```js
// scripts/fpat/eval/lib/stats.mjs  — deterministic, dependency-free
export function distribution(values, unit = 'hours') {
  const v = values.filter((x) => typeof x === 'number' && !Number.isNaN(x)).sort((a, b) => a - b);
  const n = v.length;
  if (n === 0) return { count: 0, min: null, max: null, mean: null, median: null, p90: null, unit };
  const sum = v.reduce((a, b) => a + b, 0);
  const at = (q) => v[Math.min(n - 1, Math.floor(q * (n - 1)))];
  const round = (x) => Math.round(x * 100) / 100;
  return {
    count: n,
    min: round(v[0]),
    max: round(v[n - 1]),
    mean: round(sum / n),
    median: round(n % 2 ? v[(n - 1) / 2] : (v[n / 2 - 1] + v[n / 2]) / 2),
    p90: round(at(0.9)),
    unit,
  };
}

export function hoursBetween(startISO, endISO) {
  if (!startISO || !endISO) return null;
  const ms = new Date(endISO).getTime() - new Date(startISO).getTime();
  return Number.isFinite(ms) ? ms / 3_600_000 : null;
}
```

```js
// scripts/fpat/eval/lib/report.mjs  — writes ONLY under docs/reports/<date>/
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export function reportDir(date = new Date().toISOString().slice(0, 10)) {
  const dir = join('docs', 'reports', date);
  mkdirSync(dir, { recursive: true });
  return dir;
}

export function writeReport(name, obj, date) {
  const dir = reportDir(date);
  const path = join(dir, `${name}.json`);
  writeFileSync(path, JSON.stringify(obj, null, 2) + '\n', 'utf8');
  return path;
}
```

## 6. The throughput audit (the one Phase-1 script)

```js
// scripts/fpat/eval/audit-throughput.mjs
// Read-only. Recomputes Umbrella #1 throughput from GitHub state. Raw metrics, no thresholds.
//
// Usage:
//   node scripts/fpat/eval/audit-throughput.mjs \
//     [--label flow-pack] [--owner w7-mgfcode] [--repo cvforge-ai] \
//     [--prior-issues 37] [--prior-prs 25] [--with-subissues]
//
// Exit code: 0 on success (even if metrics are "low"); non-zero only on internal/tooling error.

import { listClosedIssues, listMergedPRs, subIssueCount } from './lib/gh.mjs';
import { distribution, hoursBetween } from './lib/stats.mjs';
import { writeReport } from './lib/report.mjs';
import { ThroughputReportSchema } from './lib/schema.mjs';

function arg(name, def = undefined) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return def;
  const next = process.argv[i + 1];
  return next && !next.startsWith('--') ? next : true;
}

function typeOf(labels) {
  const l = (labels || []).map((x) => x.name);
  if (l.includes('type:umbrella')) return 'umbrella';
  if (l.includes('type:epic')) return 'epic';
  if (l.includes('type:sub-issue')) return 'sub-issue';
  return 'other';
}

async function main() {
  const label = arg('label', 'flow-pack');
  const owner = arg('owner', 'w7-mgfcode');
  const repo = arg('repo', 'cvforge-ai');
  const priorIssues = arg('prior-issues') ? Number(arg('prior-issues')) : null; // intake: 37
  const priorPrs = arg('prior-prs') ? Number(arg('prior-prs')) : null;          // intake: 25
  const withSub = arg('with-subissues') === true;

  const issues = listClosedIssues({ label });
  const prs = listMergedPRs({});
  // PRs aren't reliably label-scoped to flow-pack in the same way; count merged PRs overall and
  // also the subset carrying flow-pack labels, reporting both honestly.
  const flowPrs = prs.filter((p) => (p.labels || []).some((x) => x.name === label));

  const byTypeLabel = {};
  for (const it of issues) {
    const t = typeOf(it.labels);
    byTypeLabel[t] = (byTypeLabel[t] || 0) + 1;
  }

  const issueCycle = distribution(issues.map((i) => hoursBetween(i.createdAt, i.closedAt)));
  const prMerge = distribution(flowPrs.map((p) => hoursBetween(p.createdAt, p.mergedAt)));

  // Best-effort per-epic sub-issue counts (optional; [] if deferred).
  let epicSubIssueCounts = [];
  if (withSub) {
    const epics = issues.filter((i) => typeOf(i.labels) === 'epic');
    for (const e of epics) {
      const c = subIssueCount(e.number, owner, repo);
      if (c !== null) epicSubIssueCounts.push({ epic: e.number, title: e.title, subIssueCount: c });
    }
  }

  const recomputedClosedIssues = issues.length;
  const recomputedMergedPRs = flowPrs.length;

  const report = {
    domain: 'throughput',
    schemaVersion: '1.0.0',
    generatedAt: new Date().toISOString(),
    scope: {
      label,
      umbrella: 'all-flow-pack',
      note:
        'Scope = all CLOSED issues carrying the flow-pack label. Precisely isolating "Umbrella #1" ' +
        'requires confirming the umbrella issue number / milestone; treated as an ASSUMPTION pending team input.',
    },
    inputs: [
      `gh issue list --state closed --label ${label} --json number,title,createdAt,closedAt,labels,milestone,state`,
      'gh pr list --state merged --json number,title,createdAt,mergedAt,headRefName,labels,milestone',
      withSub ? 'gh api graphql (subIssues.totalCount per epic) [best-effort]' : '(sub-issue counts deferred)',
    ],
    metrics: {
      closedIssues: issues.length,
      mergedPRs: flowPrs.length,
      issueToPrRatio: flowPrs.length ? Math.round((issues.length / flowPrs.length) * 100) / 100 : null,
      byTypeLabel,
      issueCycleTimeHours: issueCycle,
      prMergeTimeHours: prMerge,
      epicSubIssueCounts,
      baselineRecompute: {
        priorClaimedClosedIssues: priorIssues,
        priorClaimedMergedPRs: priorPrs,
        recomputedClosedIssues,
        recomputedMergedPRs,
        matchesPriorClaim:
          (priorIssues === null || priorIssues === recomputedClosedIssues) &&
          (priorPrs === null || priorPrs === recomputedMergedPRs),
      },
    },
    findings: [
      `Recomputed ${recomputedClosedIssues} closed flow-pack issues and ${recomputedMergedPRs} merged flow-pack PRs.`,
      `Median issue cycle time ${issueCycle.median ?? 'n/a'}h; median PR merge time ${prMerge.median ?? 'n/a'}h.`,
    ],
    inferred: [
      'Umbrella #1 boundary is inferred from the flow-pack label, not an explicit umbrella scope.',
      withSub ? 'Per-epic sub-issue counts via hierarchy API (best-effort).' : 'Sub-issue counts deferred.',
    ],
    proven: [
      'Delivery volume and timing for flow-pack work can be recomputed deterministically from GitHub state.',
    ],
    notProven: [
      'Whether FPAT IMPROVED delivery — this is a single baseline (n=1); no comparison cohort exists.',
      'Causes of any timing outliers; root causes are not established here.',
    ],
    confidence: 'medium',
  };

  // Validate before writing; fail loudly on a schema bug (internal error), never on metric values.
  ThroughputReportSchema.parse(report);
  const path = writeReport('throughput', report);

  // Human-readable stdout summary (data, not a verdict).
  console.log(`[throughput] wrote ${path}`);
  console.log(`  closed flow-pack issues: ${report.metrics.closedIssues}` +
    (priorIssues !== null ? ` (prior claim: ${priorIssues}, match: ${report.metrics.baselineRecompute.matchesPriorClaim})` : ''));
  console.log(`  merged flow-pack PRs:    ${report.metrics.mergedPRs}` +
    (priorPrs !== null ? ` (prior claim: ${priorPrs})` : ''));
  console.log(`  issue cycle (h): median ${issueCycle.median} p90 ${issueCycle.p90} max ${issueCycle.max}`);
  console.log(`  PR merge   (h): median ${prMerge.median} p90 ${prMerge.p90} max ${prMerge.max}`);
}

main().catch((err) => {
  console.error('[throughput] INTERNAL ERROR (not a metric failure):', err.message);
  process.exit(1);
});
```

## 7. Baseline report output (shape — illustrative numbers)

`docs/reports/<date>/throughput.json` will look like this (values are **placeholders** until the
script runs against live data):

```json
{
  "domain": "throughput",
  "schemaVersion": "1.0.0",
  "generatedAt": "<ISO>",
  "scope": { "label": "flow-pack", "umbrella": "all-flow-pack", "note": "ASSUMPTION: ..." },
  "inputs": ["gh issue list ...", "gh pr list ...", "(sub-issue counts deferred)"],
  "metrics": {
    "closedIssues": 37,
    "mergedPRs": 25,
    "issueToPrRatio": 1.48,
    "byTypeLabel": { "umbrella": 1, "epic": 4, "sub-issue": 20, "other": 12 },
    "issueCycleTimeHours": { "count": 37, "min": 0.5, "max": 410.2, "mean": 78.4, "median": 41.0, "p90": 210.7, "unit": "hours" },
    "prMergeTimeHours":   { "count": 25, "min": 0.2, "max": 96.1,  "mean": 18.3, "median": 9.4,  "p90": 47.2,  "unit": "hours" },
    "epicSubIssueCounts": [],
    "baselineRecompute": {
      "priorClaimedClosedIssues": 37, "priorClaimedMergedPRs": 25,
      "recomputedClosedIssues": 37, "recomputedMergedPRs": 25, "matchesPriorClaim": true
    }
  },
  "findings": ["Recomputed 37 closed flow-pack issues and 25 merged flow-pack PRs.", "..."],
  "inferred": ["Umbrella #1 boundary inferred from flow-pack label", "Sub-issue counts deferred"],
  "proven": ["Delivery volume and timing can be recomputed deterministically from GitHub state."],
  "notProven": ["Whether FPAT improved delivery (n=1, no comparison cohort).", "..."],
  "confidence": "medium"
}
```

> The intake's "37 issues / 25 PRs" are passed in as `--prior-issues 37 --prior-prs 25` **to
> verify**, not to trust. `matchesPriorClaim` tells you whether the recompute reproduces them.

## 8. Validation commands

```bash
# From the cvforge-ai repo root. Requires gh authenticated (read-only) to the repo.
gh auth status                          # confirm read access; no scopes beyond default needed

# Run the audit (writes docs/reports/<date>/throughput.json)
node scripts/fpat/eval/audit-throughput.mjs --prior-issues 37 --prior-prs 25

# Optional best-effort per-epic sub-issue counts (still read-only, normal auth):
node scripts/fpat/eval/audit-throughput.mjs --prior-issues 37 --prior-prs 25 --with-subissues

# Repo gates (must stay green — eval scripts are lint/build-clean, < 500 lines each):
npm run lint
npm run build

# Suggested fixture test (mirror existing scripts/fpat/test-negotiation-band.mjs style):
#   feed canned issue/PR JSON into distribution()/hoursBetween() and assert exact numbers,
#   so the math is provable offline without hitting GitHub.
```

## 9. Risks & assumptions

| # | Risk / assumption | Handling in Phase-1 |
|---|---|---|
| 1 | **`gh` auth required** (read-only). | Documented; fails loudly with internal error if unauthenticated — never silently. |
| 2 | **"Umbrella #1" scope is inferred** from the `flow-pack` label, not an explicit umbrella boundary. | Flagged in `scope.note` and `inferred[]`; needs team confirmation (Decision #1 below). |
| 3 | **PR→flow-pack association** is by label; some FPAT PRs may lack the label. | Report both "all merged PRs" intuition and the flow-pack subset; documented as a known limitation. |
| 4 | **Prior tallies (37/25) treated as claims to verify**, not ground truth. | `baselineRecompute.matchesPriorClaim` makes any discrepancy explicit. |
| 5 | **Per-epic sub-issue counts** need the hierarchy API. | Optional `--with-subissues`, degrades to `[]`; **Phase-1 does not depend on it**; no token required. |
| 6 | **n=1 baseline** — no improvement can be claimed. | Hard-coded into `notProven[]`; raw metrics only, no thresholds. |
| 7 | **Pagination** — large lists. | `--limit 1000` covers current volume (52 board items, ~37 issues); revisit if exceeded. |
| 8 | **Date/timezone** in cycle-time math. | UTC ISO timestamps from `gh`; `hoursBetween` is timezone-safe. |
| 9 | **Board / Projects-v2 metrics** are **not** in Phase-1. | Deferred; `FPAT_PROJECT_TOKEN` intentionally not used. Degraded-mode documented for the later board phase. |

## 10. Explicitly NOT in Phase-1

- No reliability/board/planning/handoff/continuation/signal/portfolio audits.
- No `scorecard.mjs` aggregator and no Markdown scorecard.
- No scheduled CI workflow.
- No thresholds, grades, verdicts, or pass/fail logic anywhere.
- No `FPAT_PROJECT_TOKEN`, no Projects-v2 reads/writes.
- No GitHub issue tree, no board mutations, no product (`src/**`) changes.

## 11. Open decisions before/at run time

1. **Umbrella #1 scope:** confirm the precise boundary — umbrella issue number or milestone (e.g.
   `M1`) — or accept "all closed flow-pack issues" as the Phase-1 proxy (current default).
2. **Materialization:** should we (a) drop these files into `scripts/fpat/eval/` as the dry-run, and
   (b) run it against live GitHub to produce the real `throughput.json` — or keep this as a
   handoff package for your own coding agent to implement? *(Either requires your go-ahead; both
   are read-only.)*

## 12. Success criteria for Phase-1

- `audit-throughput.mjs` runs read-only and writes a schema-valid `throughput.json`.
- It recomputes closed-issue and merged-PR counts and reports whether they match the prior 37/25 claim.
- It emits raw cycle-time and merge-time distributions — no thresholds, no verdicts.
- Zero GitHub mutations, zero `src/**` changes, lint+build stay green.
- The report explicitly states what the numbers prove and do **not** prove (n=1 baseline).

---

> Prepared as a handoff/dry-run package only. No implementation was performed against the cvforge-ai
> product or its GitHub state in producing this document.
