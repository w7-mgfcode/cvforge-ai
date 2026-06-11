# External Team Intake — FPAT Umbrella 2 Evaluation System (FILLED)

> Filled instance of `external-team-intake-prompt.md`, focused only on the FPAT
> workflow/evaluation layer. This is intentionally separate from
> `external-team-intake-prompt.cvforge-ai.md`, which covers the product AI copilot
> direction. Claims are based on repository and GitHub-state evidence gathered in
> the prior read-only planning pass; unknowns are marked **[UNCERTAIN]**.

---

```text
We want to use your graph-powered solution packaging service to turn our FPAT
workflow-automation evaluation idea into a practical build blueprint.

Please analyze our idea using your Understand-Anything Graph knowledge base and
prepare a graph-grounded solution package.

Our goal is not generic AI workflow advice. We want you to identify relevant
reference patterns, exact evidence files, reusable evaluation-harness patterns,
risks, stack conflicts, and a practical implementation direction for measuring
whether our FPAT agent-team delivery automation is actually effective.

Important expectation:
Every recommendation should be backed by evidence from your graph knowledge base.
If there is weak evidence for part of the request, say so clearly instead of
inventing a solution.

PROJECT IDEA

CVForge AI / WorkflowCV Studio already has an internal FPAT ("flow-pack agent
team") delivery-automation layer: issue hierarchy conventions, GitHub Projects v2
board automation, GitHub Actions gates/sweeps/sync, handoff discipline, continuation
rules, and validation scripts. Umbrella #1 built and closed this workflow system.
Umbrella 2 should not add product functionality. It should create an evaluation
and effectiveness measurement system around the FPAT automation itself.

The central question is:

Did FPAT make agent-team delivery more reliable, more observable, and more
continuable, or did it only add process overhead?

We want a graph-grounded blueprint for a read-only, deterministic-first evaluation
harness that establishes a baseline from Umbrella #1 and produces a repeatable
scorecard for future delivery cycles.

SHORT INTAKE

Project name or working title:
FPAT Umbrella 2 — Workflow Automation Evaluation & Effectiveness Measurement System

What are we trying to build?
A read-only measurement system for the existing FPAT agent-team workflow layer:
scripts, schemas, reports, and scorecards that measure throughput, workflow
reliability, board consistency, planning accuracy, handoff quality, continuation
success, signal quality, and portfolio evidence quality.

Who will use it?
Primary users:
- the repository owner / delivery orchestrator,
- AI coding agents working in this repo,
- future maintainers validating FPAT health,
- reviewers or recruiters evaluating the AI workflow engineering evidence.

What problem does it solve?
Umbrella #1 proved that the FPAT scaffold can deliver work, but it did not prove
whether that scaffold improved reliability, observability, or resumability. The
problem is lack of measurement: we have activity evidence, but not effectiveness
evidence.

What should the AI component do?
For Umbrella 2 itself, no product AI component is required. The preferred design is
deterministic evaluation first. Optional model-based or human rubric scoring may be
considered only for qualitative handoff usefulness, but it should not be required
for the baseline system.

What data or documents will it use?
Repository files and GitHub state:
- GitHub issues, PRs, labels, milestones, and branch names.
- GitHub Actions workflow run history.
- GitHub Projects v2 board item state and fields.
- FPAT docs, rules, commands, templates, and handoff files.
- Existing scripts under `scripts/fpat/`.
- Date-stamped reports under `docs/reports/<date>/`.

What stack do we currently use or prefer?
Current repo stack:
Next.js 14, React 18, TypeScript 5, Tailwind, Zod, Node scripts under
`scripts/fpat/`, GitHub CLI/API, GitHub Actions, GitHub Projects v2.

Preferred FPAT eval stack:
Use the existing repo pattern: small read-only Node `.mjs` scripts in
`scripts/fpat/`, JSON/Markdown reports under `docs/reports/<date>/`, and CI-friendly
validation. Avoid adding dependencies unless strongly justified.

What output do we want from you?
[x] Build Blueprint
[x] Architecture Recommendation
[x] Agent Handoff Pack
[x] Eval/Judge Loop Design
[x] Risk and Gap Report
[x] Context Pack
[x] Evidence Pack
[ ] RAG Pipeline Design
[ ] Product AI Blueprint
[ ] Real LLM Integration Plan

DETAILED CONTEXT

1. Current situation

The repository is a Next.js 14 static-export A4 resume studio, but this intake is
not about product code. It is about the repo's FPAT delivery-automation layer.

Umbrella #1 built and closed the FPAT workflow system. Prior read-only evidence
showed:

- 37 FPAT-related issues closed.
- 25 PRs merged.
- 4 FPAT workflows active:
  - fpat-project-sync
  - fpat-blocked-sweep
  - fpat-rollup-gate
  - fpat-validate
- GitHub Projects v2 board #2 exists with 52 items and 19 fields.
- Workflow run tally:
  - success: 56
  - skipped: 14
  - cancelled: 30
- Most cancelled runs appear related to Project Sync concurrency noise, but the
  root cause is inferred from run names/timestamps and should be treated as not
  fully proven until logs or richer run metadata are inspected.
- Rollup-gate reopen count appears to be 0, which is a positive baseline signal.
- Branch naming drift was observed:
  - `docs/claude-docs-fpat-release-archive` lacks an issue number.
  - `fix/vercel-output-directory-20` does not use the allowed area token format.
  - `fix/print-62-pdf-export-content` also appears to violate branch-naming rules.

There are also local untracked artifacts:
- `HANDOFF.md`
- `.claude/handoffs/`
- `docs/workflow-cards/`

These should be treated as potential evidence inputs, not deleted or overwritten.

2. Desired outcome

A practical, graph-grounded blueprint for Umbrella 2:

- a measurement model,
- read-only audit scripts,
- JSON report schema,
- Markdown scorecard,
- workflow reliability report,
- board consistency report,
- handoff/continuation quality report,
- repeatable runbook,
- evidence-backed Umbrella 3 recommendation loop.

This is baseline measurement only. Because there is only one closed umbrella so
far, do not claim FPAT improved delivery yet. The correct claim is:

"Umbrella 2 instruments FPAT so future cycles can be compared against a baseline."

3. Users and workflow

Who are the users?
The repository owner, future coding agents, and reviewers who need to understand
whether the FPAT process is reliable and worth keeping.

What should happen step by step?
1. Run read-only audit scripts against GitHub issues, PRs, workflows, board state,
   and local FPAT artifacts.
2. Emit machine-readable JSON reports under `docs/reports/<date>/`.
3. Aggregate reports into a human-readable FPAT automation scorecard.
4. Explicitly mark limitations, false-positive/false-negative risks, and unknowns.
5. Produce evidence-backed recommendations for Umbrella 3 improvements.

4. AI capabilities needed

[ ] Retrieval / RAG
[ ] Product LLM integration
[ ] Tool calling
[x] Evaluation / judge loop
[x] Human review / approval gate for interpreting qualitative findings
[x] Prompt/system design for future agent handoff packs
[x] Agent workflow evaluation
[x] Automation workflow
[ ] MCP server
[ ] Data ingestion pipeline

Other:
The baseline should be deterministic-first. Model grading is optional and should be
limited to handoff usefulness or narrative quality, not core pass/fail gates.

5. Data sources

Primary:
- GitHub issue JSON: createdAt, closedAt, labels, milestone, state.
- GitHub PR JSON: createdAt, mergedAt, title, body, headRefName.
- GitHub Actions runs: workflow name, conclusion, createdAt, duration if available.
- GitHub Projects v2 items and fields.
- `.claude/` FPAT docs/rules/commands.
- `.github/` issue templates and workflows.
- `scripts/fpat/` validation scripts.
- `.claude/handoffs/*.md` and `HANDOFF.md`.
- `docs/reports/<date>/`.

Unknown:
- CI access to user-owned GitHub Projects v2 may require a PAT such as
  `FPAT_PROJECT_TOKEN`.

6. Stack preferences

Current stack:
Node `.mjs` scripts, GitHub CLI/API, GitHub Actions, Markdown/JSON reports.

Preferred stack:
Keep the existing `scripts/fpat/` style. Use deterministic code-based graders and
fixtures. Avoid introducing heavy frameworks or runtime services.

Stacks or vendors we want to avoid:
- No product AI stack in this umbrella.
- No database.
- No server runtime requirement.
- No board-writing automation unless separately approved.
- No broad dependencies just to compute metrics.

7. Integrations

Existing:
- GitHub Issues
- GitHub PRs
- GitHub Actions
- GitHub Projects v2
- GitHub CLI/API

Potential:
- Optional LLM or human rubric only for qualitative handoff scoring, not baseline
  pass/fail.

8. Security, privacy, and compliance constraints

- This umbrella should be read-only against GitHub state by default.
- Do not mutate issues, PRs, labels, milestones, board fields, branches, or workflows
  during evaluation.
- Do not modify product code under `src/**`.
- Do not commit secrets or tokens.
- If Projects v2 needs a PAT in CI, document the scope and failure mode clearly.
- Board Status/Score updates require separate explicit approval.

9. Evaluation and quality requirements

The evaluation harness should measure these domains:

1. Throughput
- issue cycle time
- PR merge time
- issue/PR ratio
- epic sub-issue count

2. Quality / Rework
- fix PR ratio
- bug-related PRs
- FPAT self-fix PRs
- reverted commits if any

3. Automation Reliability
- success/skipped/cancelled ratio per workflow
- Project Sync cancellation rate
- average workflow duration if available

4. Board Consistency
- flow-pack issue board coverage
- Type/Phase/Area field completeness
- orphan board items
- missing board items
- PR item classification

5. Planning Accuracy
- branch naming compliance
- commit format compliance
- "exactly five sub-issues per epic" compliance
- PR closes issue references

6. Agent Handoff Quality
- required sections present
- stale handoff count
- next-action presence
- optional qualitative rubric later

7. Continuation Success
- continuation output exists
- negotiation band consistency
- doc/skill consistency checks

8. Signal Quality
- false-positive-like cancelled/skipped runs
- false-negative proxies
- drift not caught by automation

9. Portfolio Evidence Quality
- scorecard exists
- report explains what numbers prove
- report explains what numbers do not prove
- dated report chain exists

10. Timeline and priority

No external deadline is confirmed. Recommended priority:

1. Metrics model and JSON schema.
2. Throughput/rework baseline.
3. Workflow reliability audit.
4. Board consistency audit.
5. Handoff/continuation audit.
6. Aggregated scorecard and Umbrella 3 recommendation loop.

11. Similar products or inspiration

No external products are named. Conceptually adjacent:
- software delivery metrics,
- CI reliability dashboards,
- agent workflow eval harnesses,
- deterministic regression checks,
- handoff/resumability audits,
- scorecards for engineering process health.

12. What we do not want

- Do not build product AI in this umbrella.
- Do not touch `src/**`.
- Do not rewrite the CV editor, templates, schema, print system, or copilot.
- Do not create GitHub issues automatically unless explicitly approved.
- Do not write to GitHub Projects board fields unless explicitly approved.
- Do not claim improvement from a single baseline.
- Do not introduce model-graders as mandatory core infrastructure.
- Do not hide uncertainty. Mark inferred data as inferred.

PLEASE PRODUCE

1. Project Fit Assessment
Tell us whether this is a strong fit for graph-powered solution packaging. Recommend
Fast Path or Deep Blueprint.

2. Context Quality Score
Score our submitted context from 0-100 and explain what is clear, unclear, or missing.

3. Best Matching Reference Patterns
Identify relevant patterns from your graph knowledge base for delivery eval harnesses,
workflow reliability audits, board consistency checks, handoff/resumability scoring,
and scorecard generation.

4. Graph Evidence Pack
For every recommendation, include:
Repo -> File -> Function/Class/Component -> Pattern -> Evidence -> Recommendation

Do not include a recommendation if there is no evidence chain.

5. Copy / Adapt / Drop Table
Classify relevant source files or patterns:
- COPY: can be reused almost directly
- ADAPT: useful but must be rewired for this repo
- DROP: repo-specific glue, config, or infrastructure not worth transplanting

6. Template Pack
Summarize reusable templates, flows, prompts, audit scripts, eval loops, report schemas,
scorecards, or handoff patterns that fit this project.

7. Build Blueprint
Propose a target evaluation architecture:
- main audit scripts
- suggested folders/modules
- input data sources
- output JSON/Markdown reports
- aggregation flow
- CI integration
- validation approach
- failure modes

8. Risk Assessment
Analyze:
- Technical Risk
- GitHub/API Risk
- Workflow Signal Risk
- Board Consistency Risk
- Handoff Scoring Risk
- Evaluation Risk
- Maintenance Risk
- Portfolio/Communication Risk

9. Blueprint Confidence Score
Score the recommendation from 0-100 and explain why.

10. MCP / Tool / Agent Opportunity Detection
Tell us whether this project could become:
- an agent tool
- an agent workflow
- a reusable skill
- an eval harness
- a human-in-the-loop workflow
- an MCP server

11. Agent Handoff Pack
Prepare a concise handoff brief that we could give to Claude Code, Codex, or another
coding agent to start implementation later, including:
- goal
- architecture
- evidence files
- copy/adapt/drop list
- constraints
- phases
- validation commands
- risks
- success criteria

RULES

- No generic workflow advice.
- Ground recommendations in graph evidence.
- Use per-repo graphs for exact file evidence.
- Use unified graph only for breadth, frequency, and confidence.
- If evidence is weak, say so clearly.
- If GitHub Projects v2 or token access conflicts with a recommended pattern, warn us.
- Do not claim this will automatically produce a production system.
- Focus on practical evaluation architecture, reusable patterns, implementation context,
  and agent-ready handoff.
```
