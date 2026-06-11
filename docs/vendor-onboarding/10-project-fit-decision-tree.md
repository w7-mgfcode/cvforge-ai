# 10 — Project Fit Decision Tree

**Purpose:** Help a team decide whether this service fits, and whether they need **Fast Path** or **Deep Blueprint**.

---

## Decision tree

```
Q1. Does the project include an AI component?
    ├─ No  ──► This service may not be ideal.
    │         (We're tuned for AI-engineering patterns. A generic CRUD app
    │          gets little value from the AI reference graph.)
    └─ Yes ──► continue to Q2

Q2. Does it require retrieval, agents, workflows, tools, evals, or human approval?
    ├─ Yes ──► STRONG FIT. The collection covers these directly. → Q3
    └─ No  ──► MAYBE / LIGHTWEIGHT FIT.
              (e.g. a single prompt call with no orchestration. We can still
               surface prompt patterns, but the upside is smaller.) → Q3

Q3. Does the team already know the stack?
    ├─ Yes ──► STACK-AWARE MATCHING.
    │          We rank repos by compatibility with your stack and flag conflicts.
    └─ No  ──► GRAPH-GUIDED ARCHITECTURE DISCOVERY.
               We let the strongest patterns suggest the stack. → Q4

Q4. Does the team need a quick answer?
    ├─ Yes ──► FAST PATH
    └─ No  ──► DEEP BLUEPRINT
```

## Fast Path

**What it is:** a quick context pack and file list.

- Top matching repos.
- Key files to read, with citations.
- A rough architecture shape.
- A short "what's well-covered vs weak" note.

**Good when:** you need orientation in ~15 minutes, you're early in exploration, or you'll do the deep design yourselves.

**Inputs needed:** the minimum intake (`05`).

## Deep Blueprint

**What it is:** the full package.

- Everything in Fast Path, plus:
- Full Evidence Pack with chains (`14`).
- Template Pack and target architecture.
- ROI estimate (`11`), Risk & Gap report (`12`), Blueprint Confidence (`13`).
- Implementation roadmap (`15`).
- Agent Handoff Pack (`08`).

**Good when:** you're committing to build and want an executable, evidence-grounded plan.

**Inputs needed:** the full intake (`04`), ideally scoring ≥70 on Context Quality (`06`).

## Quick fit summary

| Situation | Recommendation |
|---|---|
| No AI component | Not a fit |
| AI + retrieval/agents/evals/approval | Strong fit → Deep Blueprint |
| AI but single-shot, no orchestration | Lightweight fit → Fast Path |
| Stack known, time-boxed | Fast Path, stack-aware |
| Stack unknown, committing to build | Deep Blueprint, discovery mode |
