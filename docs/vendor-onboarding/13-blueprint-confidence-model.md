# 13 — Blueprint Confidence Model

**Purpose:** A 0–100 score for how strongly the graph supports a proposed solution. It tells you how much to trust the blueprint and how cautiously to proceed.

---

## Bands

| Score | Band | Meaning |
|---:|---|---|
| **0–20** | Weak evidence | Few or no real matches. Treat the blueprint as a hypothesis, not a plan. |
| **21–40** | Limited matching patterns | Some signal, but sparse or single-source. Expect heavy original work. |
| **41–60** | Usable but needs careful adaptation | Real patterns exist; significant rewiring and validation required. |
| **61–80** | Strong evidence and reusable patterns | Multiple corroborating sources; reuse is realistic. |
| **81–100** | Very strong graph support | Pattern recurs across repos, stack-compatible, well-validated. Build with confidence. |

## Scoring inputs

Each input contributes to the total (weights below are a starting model; we report the breakdown):

| Input | Weight | What raises it |
|---|---:|---|
| Number of matching repos | 15 | More distinct repos covering the idea |
| Quality of matching evidence files | 20 | Direct, on-point files (not tangential) |
| Pattern recurrence across repos | 15 | Same pattern appears in many repos (unified-graph signal) |
| Stack compatibility | 15 | Sources align with your chosen/existing stack |
| Copy/Adapt/Drop ratio | 10 | More Copy/Adapt vs Drop = more transplantable |
| Coverage of requested AI capabilities | 15 | All requested capabilities have evidence |
| Risk level (inverted) | 5 | Lower aggregate risk (`12`) |
| Availability of validation/eval patterns | 5 | Eval/test patterns exist to verify the build |

**Total = sum, capped at 100.**

## How confidence affects the recommendation

| Band | What we recommend |
|---|---|
| 0–20 | We **do not** issue a Build Blueprint. We deliver a Context Pack + Gap Report and flag this as mostly greenfield. |
| 21–40 | Fast Path only. Blueprint lines are marked "low evidence"; we suggest a spike before committing. |
| 41–60 | Deep Blueprint with explicit "adapt carefully" flags and required validation steps per component. |
| 61–80 | Full Deep Blueprint + Agent Handoff Pack; normal phasing. |
| 81–100 | Full package; we'll note where reuse is near-direct (high Copy ratio). |

## Per-capability confidence

We also report confidence **per requested capability**, not just overall. Example:

> Retrieval: 78 · Approval gate: 72 · Eval tracking: 64 · Multi-tenant isolation: 22

This prevents a strong overall score from hiding a weak-but-critical component. The lowest-scoring *required* capability often sets your real risk.

## Honesty rule

Confidence is computed from evidence, not optimism. A low score is a feature: it tells you where to invest design effort instead of trusting a thin match.
