# 04 — Team Intake Template (Full)

**Purpose:** The structured intake form an external team fills in so we can produce a high-quality, graph-grounded package.

---

> The more structure you give, the higher your Context Quality Score (`06`) and Blueprint Confidence (`13`). If this is too long, use `05-minimum-intake-template.md`.

Copy everything in the block below and fill it in.

```
PROJECT INTAKE — FULL

Project name / working title:

One-paragraph idea:
  (What are you building, in plain language?)

Target users:
  (Who uses it? Internal team, external customers, developers, admins?)

Problem being solved:
  (What pain or gap does this remove?)

Desired outcome:
  (What does success look like in one or two sentences?)

Current stack (if any):
  (Languages, frameworks, databases, infra you already use.)

Preferred stack (if any):
  (Anything you want us to target — or constraints like "must be Python".)

AI capabilities needed:
  (Retrieval/RAG, agents, tool use, workflows, evals, classification,
   generation, summarization, human approval — check all that apply.)

Data sources:
  (Docs, databases, APIs, files, tickets, code, transcripts. Format & volume.)

UI requirements:
  (Web app, chat UI, dashboard, CLI, none? Key screens or interactions.)

Backend requirements:
  (APIs, services, background jobs, queues, storage.)

Integrations:
  (Third-party services, internal systems, auth providers, messaging.)

Human-in-the-loop requirements:
  (Where must a human review, approve, or override? How risky are mistakes?)

Evaluation requirements:
  (How will you measure quality? Need an eval/judge loop? Regression gates?)

Security / privacy constraints:
  (PII, compliance, data residency, on-prem, secrets handling.)

Deployment target:
  (Cloud provider, container, on-prem, serverless, local-only.)

Existing assets:
  (Code, prompts, datasets, designs, infra you already have.)

Expected output from us:
  (Context Pack, Evidence Pack, Template Pack, Build Blueprint,
   Agent Handoff Pack, Architecture Recommendation, etc. — see 07.)

What you do NOT want:
  (Stacks, patterns, vendors, or approaches to avoid.)

Similar products / references:
  (Anything that inspires the direction, or that you want to beat.)

Timeline:
  (Target dates or rough horizon.)

Priority:
  (What matters most: speed, correctness, cost, maintainability, novelty?)
```

## After you submit

1. We score your context (`06`) and flag anything missing.
2. We run the decision tree (`10`) to confirm fit and pick Fast Path or Deep Blueprint.
3. We run Graph Analysis and return your chosen deliverables (`07`).
