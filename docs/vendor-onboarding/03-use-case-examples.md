# 03 — Use-Case Examples

**Purpose:** Show the project types this system helps with, and what graph evidence each one triggers a search for.

---

These are the categories the reference collection covers well. For each, we list the **graph evidence** we'd search for — the node types, tags, and edge patterns that surface relevant files.

> Repo names are not listed here on purpose; matches are surfaced per request and cited. See `09` for a worked example.

### 1. RAG agent with human approval

- **Evidence searched:** retrieval/ingestion pipelines (`type: pipeline`, tags like `rag`, `retrieval`, `embedding`); approval-gate nodes and state machines; the answer → approve → respond flow.
- **Edges:** `calls` and `imports` around the retriever; `tested_by` on the approval logic.

### 2. Remote coding-agent harness

- **Evidence searched:** DAG/workflow executors, worktree/isolation environment data-access layers, CLI command surfaces (run/status/resume/approve), approval nodes.
- **Edges:** heavy `imports` coupling around the executor (signals **Adapt**, not **Copy**).

### 3. Eval / judge loop for AI-generated code

- **Evidence searched:** eval harness modules, judge/scoring functions, dataset loaders, metric aggregation, regression/golden-case runners.
- **Edges:** `tested_by` and `calls` linking generation → judge → score.

### 4. Context-engineering framework

- **Evidence searched:** prompt template libraries, context-assembly utilities, PRP/spec scaffolds, rules/governance docs (`type: document`), skill definitions.
- **Edges:** `documents` and `related` linking guidance to implementation.

### 5. MCP server or tool layer

- **Evidence searched:** MCP server entrypoints, tool/function registration, schema definitions (`type: config`, Zod/JSON schema), transport/SSE handlers.
- **Edges:** `exports` on tool definitions; `configures` on server setup.

### 6. FastAPI + React AI application

- **Evidence searched:** FastAPI route/service layers, dependency-injection setup, React component trees, API clients, auth, DB/migration layers (`type: table`, `migrates`).
- **Edges:** `routes`, `depends_on`, `configures`.

### 7. Agent workflow automation

- **Evidence searched:** workflow loaders/validators (YAML/DAG → executable), node/step definitions (`type: step`), trigger/scheduler config.
- **Edges:** `triggers`, `contains` (workflow → steps).

### 8. AI onboarding or knowledge-base system

- **Evidence searched:** ingestion + indexing pipelines, knowledge-graph builders, dashboards/visualizers, document stores, tour/onboarding scaffolds (`tour` steps).
- **Edges:** `documents`, `serves`, `provisions`.

---

## How to read these

For any request, we map your intent to one or more categories above, then run the matching evidence search across the **per-repo graphs**, confirm recurrence in the **unified graph**, and return cited files. If a category is weakly covered, the Pattern Coverage Report (`13`) flags it as build-from-scratch.
