# 07 — Deliverables Menu

**Purpose:** The deliverables we can produce, what each is, and when it's useful. Pick any combination.

---

| Deliverable | What it is | When it's useful |
|---|---|---|
| **Context Pack** | The curated set of real files, flows, and patterns relevant to your idea, organized for reading. | You want orientation and a strong starting point fast. |
| **Evidence Pack** | The exact source files + symbols behind each recommendation, each with a `{repo, node id, file path}` citation and an evidence chain (`14`). | You need to *verify* recommendations or hand auditable sources to your team. |
| **Template Pack** | Reusable building blocks — prompts, agent/subagent roles, pipeline shapes, configs — lifted from the evidence, with sources cited. | You want concrete scaffolding to adapt, not just descriptions. |
| **Build Blueprint** | A structured, ordered plan for assembling the system, with target architecture and phasing. | You're ready to plan the actual build. |
| **Agent Handoff Pack** | Everything formatted for a coding agent (Claude Code, Codex, etc.) to act on — goal, architecture, evidence files, copy/adapt/drop, constraints, phases, validation, success criteria (`08`). | You'll execute with a coding agent. |
| **Architecture Recommendation** | A suggested target architecture assembled from the strongest sources, with rationale. | You're deciding *what to build*, not yet *how*. |
| **Copy / Adapt / Drop Table** | Per candidate file: take as-is, modify, or skip — with the coupling-based reason. | You want a precise transplant plan. |
| **Prompt Pack** | Proven prompts and prompt structures relevant to your use case. | Prompt design is a core risk for you. |
| **Skill Proposal** | A proposed reusable skill (capability) modeled on real implementations. | You're building a skills/capability layer. |
| **Subagent Proposal** | Suggested agent roles, responsibilities, and boundaries. | You're designing a multi-agent system. |
| **RAG Pipeline Design** | Retrieval, chunking, indexing, and grounding design based on working examples. | Retrieval quality matters and you want a proven shape. |
| **Eval / Judge Loop Design** | How to measure and gate AI output quality over time. | You need confidence the system stays correct. |
| **Human Approval Workflow** | Where and how to insert human review/override gates. | Mistakes are costly and need a human in the loop. |
| **Risk and Gap Report** | What the graph covers weakly or not at all, plus risk categories (`12`). | You want an honest map of where you're pioneering. |

## How to choose

- **Just exploring?** Context Pack + Architecture Recommendation.
- **Ready to build with an agent?** Evidence Pack + Build Blueprint + Agent Handoff Pack.
- **De-risking a specific area?** The matching focused deliverable (RAG Pipeline Design, Eval Loop Design, Human Approval Workflow) + Risk and Gap Report.

Every deliverable obeys the rule: **no evidence chain → no line.**
