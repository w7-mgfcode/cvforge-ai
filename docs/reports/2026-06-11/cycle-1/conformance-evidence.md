# Cycle-1 Conformance Evidence — envelope parse + 8-rule compliance map

> Sub-issue #119 · Epic #75 · Umbrella #70 · 2026-06-11. Turns epic #75's "Validation
> path" into recorded, re-runnable evidence (the #89/#99 live-evidence precedent).
> Read-only: no script, fixture, or CI change ships with this document.

## (a) Envelope parse — all five cycle-1 reports

Command (re-runnable from the repo root):

```bash
node -e '
import("./scripts/fpat/eval/lib/schema.mjs").then(({DomainReportSchema})=>{
  const fs=require("fs");
  const dir="docs/reports/2026-06-11/cycle-1";
  for(const f of fs.readdirSync(dir).filter(f=>f.endsWith(".json")).sort()){
    const d=JSON.parse(fs.readFileSync(dir+"/"+f,"utf8"));
    DomainReportSchema.parse(d);
    console.log(`parse OK  ${dir}/${f}  (domain=${d.domain}, schemaVersion=${d.schemaVersion}, generatedAt=${d.generatedAt})`);
  }
})'
```

Captured output (2026-06-11):

```text
parse OK  docs/reports/2026-06-11/cycle-1/board-consistency.json  (domain=board-consistency, schemaVersion=1.0.0, generatedAt=2026-06-11T20:27:57.406Z)
parse OK  docs/reports/2026-06-11/cycle-1/planning-accuracy.json  (domain=planning-accuracy, schemaVersion=1.0.0, generatedAt=2026-06-11T20:27:21.359Z)
parse OK  docs/reports/2026-06-11/cycle-1/signal-quality.json  (domain=signal-quality, schemaVersion=1.0.0, generatedAt=2026-06-11T20:27:48.185Z)
parse OK  docs/reports/2026-06-11/cycle-1/throughput.json  (domain=throughput, schemaVersion=1.0.0, generatedAt=2026-06-11T20:27:15.735Z)
parse OK  docs/reports/2026-06-11/cycle-1/workflow-reliability.json  (domain=workflow-reliability, schemaVersion=1.0.0, generatedAt=2026-06-11T20:27:38.325Z)
```

Five of five reports parse clean against `DomainReportSchema`
(`scripts/fpat/eval/lib/schema.mjs`). Each audit additionally parsed its own output against
its domain-specific schema before writing (the write path in `audit-*.mjs` validates first),
so this is a second, independent envelope-level pass.

## (b) `check-doc-consistency.mjs`

Command: `node scripts/fpat/check-doc-consistency.mjs` · Exit code: **0**

```text
ok   - CLAUDE.md has a /fpat-continuation row
ok   - CLAUDE.md row marks /fpat-continuation read-only
ok   - CLAUDE.md row names the negotiation list
ok   - CLAUDE.md row no longer mislabels /fpat-continuation as Write+Isolate
ok   - command contains band token `>= 40`
ok   - command contains band token `< 36`
ok   - command contains band token `36–39`
ok   - skill contains band token `>= 40`
ok   - skill contains band token `< 36`
ok   - skill contains band token `36–39`
ok   - doc contains band token `>= 40`
ok   - doc contains band token `< 36`
ok   - doc contains band token `36–39`

doc-consistency guard passed.
```

## (c) 8-rule compliance map

Each row maps one entry of `metrics.comparisonRules` in
`docs/reports/2026-06-11/baseline-manifest.json` (array order, 0-indexed) to the exact
section of `docs/reports/2026-06-11/cycle-1/effectiveness-readout.md` that honors it.

| # | Rule (abridged) | Where the readout honors it |
|---|---|---|
| 0 | Compare ONLY against `officialBaseline` (33/21); `historicalEnvelope` and the stale 56/14/30 tally are never benchmarks | "Comparison basis" bullet 1; every table sources `baseline-manifest.json` frozen blocks; 37/25 and 56/14/30 appear nowhere as comparators |
| 1 | Identical commands, pinned `--until`, windowed-to-windowed at stated dates | "Comparison basis" bullet 2; §3 header states both windows (`--until 2026-06-07` vs `--until 2026-06-11`) and compares `windowedAggregate` to `metrics.windowed.aggregate` |
| 2 | Never compare degraded to live; null/absent = "not measured" | "Comparison basis" bullet 3 (live-to-live, `access.degraded: false` both cycles); §5 marks the cycle-0 kind-split cell "not measured" rather than zero |
| 3 | Split commit-format compliance by era before comparing | §2 "Era-split commit-format comparison" — byte-identical violation set, 27/27 post-baseline, convention commit `e14a8f2` dated |
| 4 | Always report counts alongside rates (small-n) | Every table cell carries `x/y` with the rate in parentheses (e.g. §2 "43/52 (0.827)", §3 "137/490 (0.280)") |
| 5 | Any approved mutation must be dated; straddling measurements split pre/post, never pooled | §6 "Parked decisions — frozen before-values unchanged": all three before-values verified identical, so no split is required |
| 6 | No delivery-improvement claim from any single cycle | "No-verdict disclaimer" section; improvement wording grep-confined to that section (readout lines 165–172) |
| 7 | Board membership defined by the CURRENT `flow-pack` label | "Comparison basis" final bullet; §5 membership row uses the live label population (109/111), gap identity unchanged (#22, #23) |

## Verdict

All three #75 validation-path items are evidenced: (a) 5/5 envelope parses clean,
(b) doc-consistency guard exit 0, (c) all 8 comparison rules mapped to the readout sections
that honor them. Nothing here is a gate — per the eval-suite contract
(`scripts/fpat/eval/README.md`), evidence records state; it never blocks.
