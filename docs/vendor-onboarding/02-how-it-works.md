# 02 — How It Works

**Purpose:** Walk through the full pipeline, step by step, in plain technical language.

---

## The pipeline

```
Project Idea
   ↓
Graph Analysis
   ↓
Repo Pattern Matching
   ↓
Evidence Pack
   ↓
Template Pack
   ↓
Build Blueprint
   ↓
Agent Handoff Pack
```

Each stage produces a concrete artifact that feeds the next. You can stop at any stage (see *Fast Path* vs *Deep Blueprint* in `10-project-fit-decision-tree.md`).

---

### 1. Project Idea

**Input:** your intake (full form in `04`, short form in `05`).

We parse your idea into structured **intent facets**: the AI capabilities involved (retrieval, agents, tools, evals, human approval, workflows), the stack you have or prefer, your data sources, constraints, and the output you want from us.

Before going further, we run a **Context Quality Score** (`06`). If the score is low, we ask targeted follow-ups rather than guessing.

### 2. Graph Analysis

We query the knowledge base. Two tiers, two jobs:

- **Per-repo graphs** — used for **exact** repo, file, function, class/component, and pattern extraction. This is where citable evidence comes from.
- **Unified collection graph** — used **only** for breadth signals: how frequently a pattern recurs across the 32 repos, and how confident we should be in it.

Graph nodes carry a stable `id`, a `filePath`, a `type` (file, function, class, config, service, pipeline, table, document…), a human-readable `summary`, `tags`, and a `complexity` rating. Edges encode relationships — notably `imports` (in-repo coupling), `calls`, `tested_by`, `configures`, and `depends_on`.

### 3. Repo Pattern Matching

We rank candidate repos against your intent facets. Ranking is **density-normalized** (a focused 200-file repo isn't beaten just because a monorepo has more total hits) and weighted by framework match and description relevance. The output: a short list of best-matching repos, each with the intent facets it covers and the frameworks it uses.

### 4. Evidence Pack

For the top repos, we extract the **exact files** that implement the relevant patterns — with their symbols, architectural layer, and a one-line "why it matters." Every item carries a citation: `{repo, node id, file path}`.

We also classify each file using its in-repo `imports` coupling (`14` defines the rule):

- **Copy** — standalone/portable, few or no in-repo imports.
- **Adapt** — useful but coupled; you'll rewire dependencies.
- **Drop** — repo-specific, not worth transplanting.

**Rule: no evidence chain → no blueprint line.**

### 5. Template Pack

We lift the reusable building blocks out of the evidence: prompts, agent/subagent roles, RAG pipeline shapes, eval-loop structures, approval-gate flows, config skeletons. These are framed as templates you adapt, with their source cited.

### 6. Build Blueprint

We assemble a coherent target architecture from the strongest sources, plus:

- a **Pattern Coverage Report** (which requested capabilities are well-covered vs weak),
- **Stack Conflict Warnings** (when top repos assume incompatible stacks),
- a **Blueprint Confidence Score** (`13`),
- a **Risk and Gap Report** (`12`),
- and an ordered implementation plan (`15`).

### 7. Agent Handoff Pack

Finally, we format everything for a coding agent (Claude Code, Codex, or other): goal, target architecture, selected repos, exact evidence files, reusable patterns, copy/adapt/drop decisions, constraints, phased plan, validation commands, risks, and success criteria. Format is defined in `08`.

---

## Invariants (true at every stage)

1. **Per-repo graphs for evidence; unified graph only for breadth/frequency/confidence.**
2. **No evidence chain → no blueprint recommendation.**
3. **We package guidance — we do not auto-build your production system.**
