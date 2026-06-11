# External Team Intake Prompt

**Purpose:** Copy this prompt, fill it in, and send it back to us so we can prepare a graph-grounded solution package for your project idea.

Use the short version if you need a fast first pass. Use the detailed version if you want a deeper blueprint, risk assessment, and agent handoff pack.

---

```text
We want to use your graph-powered solution packaging service to turn our project idea into a practical build blueprint.

Please analyze our idea using your Understand-Anything Graph knowledge base and prepare a graph-grounded solution package.

Our goal is not to receive generic AI advice. We want you to identify relevant reference patterns, exact evidence files, reusable architecture ideas, risks, stack conflicts, and a practical implementation direction.

Important expectation:
Every recommendation should be backed by evidence from your graph knowledge base. If there is weak evidence for part of the request, say so clearly instead of inventing a solution.

PROJECT IDEA

[Describe what we want to build in 5-10 sentences.]

SHORT INTAKE

Project name or working title:
[Fill in]

What are we trying to build?
[Fill in]

Who will use it?
[Fill in]

What problem does it solve?
[Fill in]

What should the AI component do?
[Fill in]

What data or documents will it use?
[Fill in]

What stack do we currently use or prefer?
[Fill in]

What output do we want from you?
Choose one or more:
[ ] Context Pack
[ ] Evidence Pack
[ ] Template Pack
[ ] Build Blueprint
[ ] Agent Handoff Pack
[ ] Architecture Recommendation
[ ] RAG Pipeline Design
[ ] Eval/Judge Loop Design
[ ] Human Approval Workflow
[ ] MCP / Tool / Agent Opportunity Analysis
[ ] Risk and Gap Report
[ ] ROI / Confidence Estimate

DETAILED CONTEXT

1. Current situation

[Describe what exists today. Include current codebase, product stage, team setup, known constraints, and current architecture.]

2. Desired outcome

[Describe what a successful solution should do. Be concrete.]

3. Users and workflow

Who are the users?
[Fill in]

What should happen step by step?
1.
2.
3.
4.
5.

4. AI capabilities needed

Check or describe what applies:
[ ] Retrieval / RAG
[ ] Agent workflow
[ ] Tool calling
[ ] Human-in-the-loop approval
[ ] Evaluation / judge loop
[ ] Prompt system
[ ] Subagents
[ ] MCP server
[ ] Data ingestion
[ ] Knowledge base
[ ] UI for AI interaction
[ ] Automation workflow
[ ] Other: [Fill in]

5. Data sources

[Describe documents, APIs, databases, files, customer data, internal knowledge bases, logs, transcripts, tickets, or other sources.]

6. Stack preferences

Current stack:
[Fill in]

Preferred stack:
[Fill in]

Stacks or vendors we want to avoid:
[Fill in]

7. Integrations

[List APIs, SaaS tools, internal systems, authentication providers, databases, deployment platforms, or AI providers.]

8. Security, privacy, and compliance constraints

[Describe sensitive data, access control, audit requirements, privacy constraints, hosting constraints, or compliance concerns.]

9. Evaluation and quality requirements

How should we know the system works?

[Describe tests, evals, accuracy expectations, human review, retrieval quality, benchmarks, or acceptance criteria.]

10. Timeline and priority

[Describe urgency, deadline, MVP scope, and what should be done first.]

11. Similar products or inspiration

[List examples, competitors, repos, tools, screenshots, workflows, or documents that resemble what we want.]

12. What we do not want

[Describe anti-goals, unwanted architecture, unwanted vendors, risky approaches, or things that should be avoided.]

PLEASE PRODUCE

1. Project Fit Assessment
Tell us whether this is a strong fit for your graph-powered solution packaging process. Recommend Fast Path or Deep Blueprint.

2. Context Quality Score
Score our submitted context from 0-100 and explain what is clear, unclear, or missing.

3. Best Matching Reference Patterns
Identify the most relevant patterns from your graph knowledge base. Use per-repo graph evidence for exact recommendations.

4. Graph Evidence Pack
For every recommendation, include an evidence chain:
Repo -> File -> Function/Class/Component -> Pattern -> Evidence -> Recommendation

Do not include a recommendation if there is no evidence chain.

5. Copy / Adapt / Drop Table
Classify relevant source files or patterns:
- COPY: can be reused almost directly
- ADAPT: useful but must be rewired for our project
- DROP: repo-specific glue, config, or infrastructure not worth transplanting

6. Template Pack
Summarize the reusable templates, flows, prompts, agents, tools, RAG pipelines, eval loops, or UI patterns that fit our project.

7. Build Blueprint
Propose a target architecture and implementation structure:
- main components
- suggested folders/modules
- data flow
- agent/tool flow
- UI/backend split
- validation approach

8. Risk Assessment
Analyze:
- Technical Risk
- Agent Risk
- RAG Risk
- Deployment Risk
- Security Risk
- Cost Risk
- Data Risk
- Evaluation Risk
- Vendor/Integration Risk

9. Blueprint Confidence Score
Score the recommendation from 0-100:
- 0-20: weak evidence
- 21-40: limited matching patterns
- 41-60: usable but needs careful adaptation
- 61-80: strong evidence and reusable patterns
- 81-100: very strong graph support

Explain why.

10. MCP / Tool / Agent Opportunity Detection
Tell us whether this project could become:
- an MCP server
- an agent tool
- an agent workflow
- a reusable skill
- an eval harness
- a human-in-the-loop workflow

11. Agent Handoff Pack
Prepare a concise handoff brief that we could give to Claude Code, Codex, or another coding agent to start implementation.

RULES

- Do not give generic AI advice.
- Ground recommendations in graph evidence.
- Use per-repo graphs for exact file evidence.
- Use the unified graph only for breadth, frequency, and confidence.
- If evidence is weak, say so clearly.
- If our stack conflicts with recommended patterns, warn us.
- Do not claim this will automatically generate a production system.
- Focus on practical architecture, reusable patterns, implementation context, and agent-ready handoff.
```

## How to use it

1. Fill in at least the **Project Idea** and **Short Intake** sections.
2. Fill in the **Detailed Context** section when you want a Deep Blueprint.
3. Send the completed prompt back to us.
4. We will score the context, run graph analysis, and prepare the requested package.
