# FPAT Umbrella 2 — Track B Phase-2 Planning Package (read-only, PLAN ONLY)

**Date:** 2026-06-07 · **Status:** planning draft — no files materialized, nothing run, no GitHub writes.
**Builds on:** Phase-1 (`scripts/fpat/eval/`, `docs/reports/2026-06-07/throughput.json`,
`throughput-mismatch-analysis.md`).

## Baseline carried forward (decided)

- **Official reproducible baseline: 33 closed `flow-pack` issues / 21 merged `flow-pack` PRs.** Phase-2 builds on this.
- **37 / 25** = broader historical activity envelope only — documented, never a benchmark.
- Phase-1 `flow-pack` filter is **not** adjusted. Label-coverage drift is treated as a *measured signal* (below), not corrected by hand.

## Scope & invariants (unchanged from Phase-1)

- **Read-only, deterministic, raw metrics only.** No thresholds. **Scores are data, never CI gates** — a "low" number never fails a PR.
- **n=1 discipline:** report what is reproducible; never claim FPAT *improved* delivery (no comparison cohort).
- No product code (`src/**`). No GitHub mutations (issues/PRs/labels/milestones/board/workflows). No full Umbrella 2 issue tree.
- **Board Consistency (domain 4) is DEFERRED** until we decide whether to provision `FPAT_PROJECT_TOKEN` (user-owned Projects v2 needs it). None of the three Phase-2 audits require that token.
- Reuse Phase-1 infra: `scripts/fpat/eval/lib/{gh,stats,report,schema}.mjs`. **No new dependencies** (Zod schemas extend `lib/schema.mjs`). Reports land in `docs/reports/<date>/`.

## Three Phase-2 deterministic audits

### A. Planning-Accuracy audit — domain 5
**New file:** `scripts/fpat/eval/audit-planning-accuracy.mjs` → `docs/reports/<date>/planning-accuracy.json`
**Measures (compliance against the documented FPAT contracts):**
- **Branch naming** vs `.claude/rules/flow-pack-agent-team/branch-naming.md` regex `^(feat|fix|docs|chore|refactor|test|ci)/(claude-rules|claude-docs|claude-commands|claude-skills|github-workflows|github-projects|scripts)-\d+-[a-z0-9-]+$`.
- **Commit format** vs `commit-format.md`: `^(feat|fix|docs|chore|refactor|test|ci)\([a-z-]+\): .+ \(#\d+\)$`.
- **"Exactly 5 sub-issues per epic"**: per `type:epic` issue, native `subIssues.totalCount` vs 5.
- **PR `Closes #<issue>` linkage** present in merged PR bodies.

**Read-only inputs:**
```bash
# Branch names of merged PRs (branches are often deleted post-merge → PR headRefName is the durable record)
gh pr list --state merged --limit 1000 --json number,headRefName,title,body
# Commit subjects (squash titles on main)
git log --pretty=format:'%s' origin/main
# Per-epic sub-issue counts (issue hierarchy — default token, NO FPAT_PROJECT_TOKEN)
gh api graphql -f query='{repository(owner:"w7-mgfcode",name:"cvforge-ai"){issue(number:<epic>){subIssues{totalCount}}}}'
```
**Known drift to reproduce (evidence, not new claims):** `docs/claude-docs-fpat-release-archive` (no issue #), `fix/vercel-output-directory-20` (bad area-token shape), `fix/print-62-pdf-export-content` (non-conforming) — vs compliant examples like `chore/scripts-2-fpat-foundation`.
**Proves:** branch/commit/linkage/fan-out compliance is measurable from durable git+GitHub state.
**Does not prove:** intent behind any violation; whether a violation caused downstream harm.

### B. Workflow-Reliability audit — domain 3
**New file:** `scripts/fpat/eval/audit-workflow-reliability.mjs` → `docs/reports/<date>/workflow-reliability.json`
**Measures, per workflow + aggregate:** success / skipped / cancelled / failure counts & ratios, average duration (`updatedAt − createdAt`), and the **Project-Sync cancellation rate** specifically.
**Read-only inputs:**
```bash
for wf in fpat-project-sync fpat-blocked-sweep fpat-rollup-gate fpat-validate; do
  gh run list --workflow "$wf.yml" --limit 1000 \
    --json databaseId,conclusion,status,createdAt,updatedAt,event
done
```
**Critical design rule — pin a time window.** Run history grows, so totals drift: the documented **56/14/30** is a point-in-time snapshot; the **live tally on 2026-06-07** is already `~success 154 / skipped 56 / cancelled 45`. The report MUST record `asOf` and an optional `--until <date>` cutoff so a baseline is reproducible. Store both the raw current tally and (if `--until` given) the windowed tally.
**Early evidence (already observed, read-only):** **all 45 cancellations are on `fpat-project-sync`** (the other three never cancel) — consistent with the concurrency hypothesis, now *data-backed* rather than inferred. `project-sync` cancel rate ≈ 45/162 ≈ 28%.
**Proves:** per-workflow reliability is reproducible; cancellation is localized to project-sync.
**Does not prove:** root cause of cancellations (concurrency is now strongly supported but confirm via run `event`/overlap, not assumed); that cancellations are harmful vs benign superseded re-runs (→ audit C).

### C. Label-Coverage / Signal-Quality audit — domain 8 (+ the Phase-1 mismatch finding)
**New file:** `scripts/fpat/eval/audit-signal-quality.mjs` → `docs/reports/<date>/signal-quality.json`
**Second-stage** — consumes A's and B's JSON outputs. Measures:
- **Label-coverage drift:** FPAT-looking work missing `flow-pack` (the #12/#14 case), and `flow-pack` items missing `type:`/`phase:`/`area:`. "FPAT-looking" is a **heuristic** (branch/title references `claude-*|github-*|scripts|fpat`) → flagged `inferred`, with the candidate list, not an auto-verdict.
- **False-positive-like signals:** cancelled/skipped runs that were superseded by a later success for the same trigger (benign noise) vs genuinely lost work — cross-referenced from B.
- **Drift NOT caught by automation:** planning-accuracy violations from A that still merged (e.g. `fpat-validate` passed yet the branch/commit was non-conforming) — i.e. false negatives of the existing gates.
**Read-only inputs:** A's + B's report JSON, plus:
```bash
gh issue list --state all --limit 1000 --json number,title,labels
gh pr list   --state all --limit 1000 --json number,title,labels,headRefName,body
```
**Proves:** label coverage and gate effectiveness are quantifiable; the 33↔37 gap is decomposed into noise vs missing-label vs definitional.
**Does not prove:** that any flagged "FPAT-looking" item *should* have carried `flow-pack` (heuristic — human confirmation needed).

## Sequencing
```
Stage 1 (independent, parallelizable):   A planning-accuracy   |   B workflow-reliability
Stage 2 (depends on A+B JSON):                         C signal-quality
DEFERRED (needs FPAT_PROJECT_TOKEN decision):          D board-consistency (domain 4)
```

## Schema / lib changes (no new deps)
- Extend `scripts/fpat/eval/lib/schema.mjs` with `PlanningAccuracyReportSchema`, `WorkflowReliabilityReportSchema`, `SignalQualityReportSchema` — same envelope as Phase-1 (`domain, schemaVersion, generatedAt, scope, inputs, metrics, findings, inferred, proven, notProven, confidence`).
- Reuse `lib/gh.mjs` (add thin `listRuns`, `listAllIssues`, `listAllPRs`, `subIssueCount` already exists), `lib/stats.mjs` (`distribution`), `lib/report.mjs` (`writeReport`).
- Schema `.parse()` stays an **internal-error guard only** — never gates on metric values (matches Phase-1).

## Validation commands (when materialized, all read-only)
```bash
node scripts/fpat/eval/audit-planning-accuracy.mjs
node scripts/fpat/eval/audit-workflow-reliability.mjs --until 2026-06-07
node scripts/fpat/eval/audit-signal-quality.mjs
npm run lint && npm run build        # repo type/lint gate
# offline fixture tests recommended under scripts/fpat/eval/__fixtures__ to keep audits CI-safe without live gh
```

## Risks & assumptions
1. **Run-history is non-stationary** → reliability totals drift; `asOf`/`--until` is mandatory for a reproducible baseline.
2. **Branches deleted post-merge** → use merged-PR `headRefName` as the durable branch-naming record (not `git branch -a`).
3. **"FPAT-looking" is heuristic** → label-coverage candidates are `inferred`, never auto-corrected (respects "do not adjust Phase-1 filter").
4. **`gh run list` retention/pagination** → cap `--limit`, record any truncation in the report.
5. **`FPAT_PROJECT_TOKEN` not provisioned** → board consistency (domain 4) stays deferred; document the degraded mode rather than half-implementing it.
6. **n=1** → every report keeps the `notProven` "no improvement claim" line.
7. **Scores are data, not gates** → audits exit `0` even on "bad" numbers; non-zero only on tooling error.

## Decision requests before Phase-2 execution
1. **Materialize + run, or hand off?** — same fork as Phase-1: (a) place the three audits in `scripts/fpat/eval/` and run them read-only to emit the JSON reports, or (b) keep this as a handoff package for a coding agent. Both read-only.
2. **Reliability time window:** raw current tally only, or also a pinned `--until 2026-06-05` window to reproduce the historical 56/14/30 snapshot?
3. **Board consistency / `FPAT_PROJECT_TOKEN`:** still deferred (default), or provision the token now to bring domain 4 into Phase-2?

**Approval formula (kept distinct from the GitHub issue-tree gate):**
- `APPROVE PHASE-2 FILE WRITES AND READ-ONLY RUN` → create the three audit scripts + run them to emit reports.
- Board work and any GitHub issue-tree creation remain separately gated.

---
*Planning output only. No product code changed, no GitHub state mutated, no audit scripts created yet. Live `gh` figures cited are read-only observations as of 2026-06-07.*
