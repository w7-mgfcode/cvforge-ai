# Tier 3 — Reference Docs (scout these, don't auto-load)

Heavy reference material. **Not** loaded automatically. Read the one-line summary below to
decide relevance, then open only the doc you need (the "Isolate/Select" strategy — keep
hundreds of lines of reference out of the main context until required).

| Doc | Read it when you need… |
|-----|------------------------|
| `architecture-deep-dive.md` | The full data-flow / state-ownership / module map before a cross-cutting change |
| `print-fidelity-guide.md`   | The A4 sizing math, overflow detection internals, or to add an automated print gate |
| `skills-cli-guide.md`       | Adding/removing/updating agent skills (`npx skills`), the lockfile, installed set |
| `ui-design-workflow-guide.md` | The UI pipeline, tool/skill availability, and the Stitch→A4/schema reconciliation protocol |
| `flow-pack-agent-team/board-spec.md` | GitHub Projects v2 name/visibility, fields, views (+checklist), labels, milestones, gates, sync direction, and automation/secrets (auto-add, `FPAT_PROJECT_TOKEN`, the 3 workflows) |
| `flow-pack-agent-team/decomposition.md` | Umbrella → epics → sub-issues hierarchy-as-data method |
| `flow-pack-agent-team/execution-pipeline.md` | Issue → exactly-five-subtask read-only planning method |
| `flow-pack-agent-team/continuation-discipline.md` | V1→V2 continuation planning, exact-3 research agents, and score bands |
| `flow-pack-agent-team/agent-team.md` | Contract-first agent-team execution boundary for FPAT work |

## Reports (dated delivery artifacts)

| Report | Summary |
|--------|---------|
| `docs/reports/2026-06-05/fpat-umbrella-dogfood.md` | First FPAT adoption umbrella (#1) delivery + release-gate dogfood: A4 print fidelity across all 3 templates (browser + static), drift resolution, closeout |
| `docs/reports/2026-06-05/fpat-release-archive.md` | Read-only post-completion audit of umbrella #1: final-state verification (issues/board/rollup-gate/PRs), local validation, evidence index, cold-start reproducibility |

## Also Tier 3 (repo root)

| Doc | Summary |
|-----|---------|
| `PROJECT_CONTEXT.md` | Product vision, personas, MVP feature definitions (UC-1…UC-4) |
| `DESIGN.md`          | Editorial design system, layout configs, token intent |
| `AGENTS.md`          | Authoritative build/test/style/security conventions |

## Adding a doc

Create `.claude/docs/{topic}.md`, start with a 2–3 line **Summary** header (so scouts can judge
relevance without reading the body), then the deep content. Add a row above.
