# 01 — Service Overview

**Purpose:** Explain what this service is, the problem it solves, and why a graph-based approach is valuable.

---

## What this is

We help engineering teams move from a vague AI project idea to a **concrete, evidence-grounded implementation blueprint** — fast, and anchored to real code.

We are **not** a generic AI consultancy that gives advice from a model's general knowledge. We operate an **Understand-Anything knowledge graph** built from **32 deeply analyzed AI-engineering reference repositories**. The analysis (file-by-file, function-by-function, with imports, architectural layers, and guided tours) was expensive to produce. The payoff is that we can answer questions about *how real AI systems are actually built* by pointing at real files, not plausible guesses.

## The core idea

> **The graph is not the product. The graph is the engine behind the product.**

The product is a **vendor onboarding and solution packaging workflow**: you tell us what you want to build, and we package the relevant proven patterns into something your developers — or your coding agents — can act on immediately.

You never receive the raw graph. You receive a clean, packaged service flow:

```
Project Idea → Graph Analysis → Repo Pattern Matching → Evidence Pack
             → Template Pack → Build Blueprint → Agent Handoff Pack
```

## The problem it solves

Most AI projects stall in the same places:

- **Blank-page architecture.** Nobody is sure what the system *should* look like, so weeks go into research and false starts.
- **Hallucinated planning.** A general model confidently proposes an architecture that has never actually been built, and the gaps only surface mid-implementation.
- **Pattern re-invention.** RAG pipelines, eval loops, approval gates, and agent harnesses get rebuilt from scratch even though working versions already exist.
- **Slow onboarding.** New developers (and coding agents) need a long ramp before they can contribute.

We address these directly: every recommendation we make is tied to a file you can open and read.

## Why the graph-based approach is valuable

- **Evidence over opinion.** Each blueprint line is backed by an evidence chain (repo → file → function → pattern → recommendation). No evidence means no recommendation.
- **Reuse of proven patterns.** The 32 repos already solved many of the hard problems — retrieval grounding, approval gates, eval/judge loops, worktree isolation, MCP tool layers. We surface what's reusable.
- **Two complementary signals.** *Per-repo graphs* give exact, citable file evidence. The *unified collection graph* gives breadth — how often a pattern recurs across repos, which raises or lowers our confidence.
- **Honest coverage.** Because we measure how many repos cover a capability, we can tell you where you're on proven ground and where you're pioneering.

## What we explicitly do and do not promise

- We **do not** automatically generate a complete, production-ready system.
- We **do** prepare graph-grounded context, templates, target architecture, implementation guidance, and an agent handoff package.
- All recommendations are **evidence-backed**. Where the graph is thin, we say so rather than fill the gap with assumptions.

## Who this is for

Engineering leads, product leads, and technical founders building AI-powered systems — RAG agents, coding-agent harnesses, eval loops, context-engineering frameworks, MCP/tool layers, or full-stack AI applications — who want a strong, real-world starting point instead of a blank editor.
