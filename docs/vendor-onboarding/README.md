# Vendor Onboarding & Solution Packaging System

A self-contained package for working with our **graph-grounded context & blueprint service**. Hand this whole folder to an external development team.

**Start here:** read `01` and `02`, then fill in `external-team-intake-prompt.md`. Use `10` if you want to decide between Fast Path and Deep Blueprint before sending the intake.

**Quick path:** send us `external-team-intake-prompt.md` with the Project Idea and Short Intake sections filled in.

**Best path:** also review `04`, `08`, `10`, and `14` so your team understands what we need and how we turn evidence into a build blueprint.

## The service in one line

You tell us what you want to build; we query an Understand-Anything knowledge graph over **32 real AI-engineering repos** and return an **evidence-grounded** context pack, blueprint, and agent handoff pack. *No evidence → no recommendation.*

## Document index

| # | File | Purpose |
|---|---|---|
| Start | `external-team-intake-prompt.md` | Copy-fill-send prompt for an external team to request a graph-grounded package |
| 01 | `01-service-overview.md` | What the service is and why graph-based |
| 02 | `02-how-it-works.md` | The full pipeline, step by step |
| 03 | `03-use-case-examples.md` | Project types + what evidence each triggers |
| 04 | `04-team-intake-template.md` | Full structured intake form |
| 05 | `05-minimum-intake-template.md` | Six-question quick intake |
| 06 | `06-context-quality-score.md` | 0–100 grade of submitted context |
| 07 | `07-deliverables-menu.md` | What we can produce |
| 08 | `08-agent-handoff-pack-format.md` | Format for handing to a coding agent |
| 09 | `09-example-solution-package.md` | One complete worked example |
| 10 | `10-project-fit-decision-tree.md` | Fit + Fast Path vs Deep Blueprint |
| 11 | `11-roi-estimator.md` | Lightweight ROI estimator |
| 12 | `12-risk-assessment-framework.md` | Nine risk categories |
| 13 | `13-blueprint-confidence-model.md` | 0–100 confidence model |
| 14 | `14-graph-evidence-pack-format.md` | The evidence-chain rule |
| 15 | `15-implementation-roadmap-template.md` | Discovery → Optimization phases |
| 16 | `16-mcp-opportunity-detector.md` | MCP / tool / skill / eval detection |
| 17 | `17-packaging-summary.md` | How all docs work together |

> Files in this folder outside the generic index above may be filled repo-specific instances or provenance documents.

## Three invariants

1. Per-repo graphs for evidence; unified graph only for breadth/frequency/confidence.
2. No evidence chain → no blueprint line.
3. We package context, templates, architecture, and agent handoff — we do not auto-generate a production system.
