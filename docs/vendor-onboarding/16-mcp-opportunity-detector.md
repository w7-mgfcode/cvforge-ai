# 16 — MCP Opportunity Detector

**Purpose:** Help decide whether part of a project should become an MCP server, agent tool, agent workflow, reusable skill, eval harness, or human-in-the-loop workflow — and what graph evidence to search for.

---

> "MCP" = Model Context Protocol — a standard way to expose tools/resources to AI agents. Use this detector during Architecture (`15`, Phase 2).

For each opportunity type: **signs it's a good fit · required inputs · example use cases · risks · graph evidence to search for.**

### 1. MCP Server

- **Signs of fit:** you have a capability/data source multiple agents or apps would call; you want it reusable across tools (Claude Code, Codex, etc.).
- **Required inputs:** a clear capability boundary; stable inputs/outputs; auth model.
- **Examples:** a docs-search server; a database query server; a deployment-control server.
- **Risks:** over-exposing capabilities; auth/permission scope; versioning.
- **Graph evidence:** MCP server entrypoints, tool registration, schema definitions, transport/SSE handlers.

### 2. Agent Tool

- **Signs of fit:** a discrete action an agent should call (search, create ticket, run query) rather than reason through.
- **Required inputs:** typed input/output schema; idempotency expectations.
- **Examples:** "create_ticket", "search_docs", "run_eval".
- **Risks:** side effects without guards; unclear failure semantics.
- **Graph evidence:** tool/function definitions with `exports`, Zod/JSON schemas (`type: config`).

### 3. Agent Workflow

- **Signs of fit:** a multi-step process with branching, loops, or approvals that should be orchestrated, not freeform.
- **Required inputs:** the step graph; where humans intervene; retry policy.
- **Examples:** "ingest → index → validate"; "generate → judge → approve → ship".
- **Risks:** runaway loops; partial-failure recovery; hidden state.
- **Graph evidence:** DAG/workflow executors, loaders/validators, node/step definitions (`type: step`), `triggers`/`contains` edges.

### 4. Reusable Skill

- **Signs of fit:** a self-contained capability you'll reuse across projects/agents.
- **Required inputs:** clear trigger conditions; minimal external coupling.
- **Examples:** "summarize-thread", "review-diff", "build-context-pack".
- **Risks:** scope creep; skill overlap/conflict.
- **Graph evidence:** skill definitions (e.g. `SKILL.md` documents), low-coupling COPY-classified functions.

### 5. Eval Harness

- **Signs of fit:** you need repeatable measurement of AI output quality, regression detection over time.
- **Required inputs:** a dataset/golden set; metrics; a judge or scoring function.
- **Examples:** answer-quality scoring; code-gen correctness; retrieval precision.
- **Risks:** gaming the metric; judge bias; flaky/non-deterministic scores.
- **Graph evidence:** eval harnesses, judge/scoring functions, golden-case runners, `tested_by` edges.

### 6. Human-in-the-Loop Workflow

- **Signs of fit:** some actions are risky or irreversible and need human review/approval.
- **Required inputs:** risk classification rules; an approval queue/UI; escalation policy.
- **Examples:** approve risky support answers; approve agent code merges; approve spend.
- **Risks:** approval bottleneck; unclear ownership; alert fatigue.
- **Graph evidence:** approval nodes, risk classifiers, queue/notification patterns, approval-gate flows.

---

## How to use

Run each section against the project. A capability hitting **multiple "signs of fit"** and backed by **graph evidence** is a strong candidate to package as that artifact type — which often increases reuse and reduces risk. Score weakly-covered candidates as build-from-scratch (note it in the Gap Report, `12`).
