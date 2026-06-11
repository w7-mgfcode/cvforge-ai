# 12 — Risk Assessment Framework

**Purpose:** A structured way to surface risk early. For each category: what to check, warning signs, mitigation ideas, and what graph evidence helps.

---

> Output of this framework is the **Risk and Gap Report** deliverable (`07`). Risk level feeds the Blueprint Confidence Model (`13`).

### 1. Technical Risk

- **Check:** stack maturity, integration complexity, unproven components.
- **Warning signs:** novel combination no reference repo uses; many moving parts in v1.
- **Mitigation:** start with the most-proven pattern; phase complex parts later (`15`).
- **Graph evidence:** repos using the same stack combo; recurrence in the unified graph.

### 2. Agent Risk

- **Check:** autonomy level, tool permissions, looping/runaway potential, recovery.
- **Warning signs:** agents writing files or calling external services without bounds; no human gate on irreversible actions.
- **Mitigation:** worktree/isolation, least-privilege tools, approval gates, step limits.
- **Graph evidence:** harness repos with isolation environments, approval nodes, retry/limit config.

### 3. RAG Risk

- **Check:** retrieval quality, chunking strategy, grounding, hallucination control, freshness.
- **Warning signs:** no eval on retrieval; "just embed everything"; no citation of sources.
- **Mitigation:** rerank, ground answers in retrieved text, cite sources, eval retrieval separately.
- **Graph evidence:** retrieval pipelines, reranking, grounding utilities, RAG eval scripts.

### 4. Deployment Risk

- **Check:** target environment, scaling, secrets, infra parity dev→prod.
- **Warning signs:** local-only design assumed to "just deploy"; no container/infra plan.
- **Mitigation:** define deployment target in intake; reuse proven infra/compose patterns.
- **Graph evidence:** Dockerfiles, compose/deploy configs, infra dirs in reference repos.

### 5. Security Risk

- **Check:** authn/authz, secret handling, prompt injection, data exposure, multi-tenant isolation.
- **Warning signs:** secrets in code; untrusted input flowing into prompts/tools; no tenant boundary.
- **Mitigation:** input sanitization, least privilege, prompt-injection defenses, secret managers.
- **Graph evidence:** security modules, prompt-injection defense repos, auth services.

### 6. Cost Risk

- **Check:** token spend, model choice, retrieval volume, eval frequency.
- **Warning signs:** large-context calls on every request; no caching; biggest model everywhere.
- **Mitigation:** right-size models, cache, batch evals, cap context.
- **Graph evidence:** model-routing/config patterns, caching utilities.

### 7. Data Risk

- **Check:** quality, volume, licensing, PII, freshness, schema drift.
- **Warning signs:** unknown data volume; PII without handling plan; stale indexes.
- **Mitigation:** ingestion validation, PII handling, re-index strategy.
- **Graph evidence:** ingestion pipelines, schema/migration nodes (`type: table`, `migrates`).

### 8. Evaluation Risk

- **Check:** is quality measurable? regression detection? human-judgment loop?
- **Warning signs:** "we'll know it's good when we see it"; no metrics; no golden set.
- **Mitigation:** define metrics early; judge/eval loop; regression gates in CI.
- **Graph evidence:** eval harnesses, judge functions, golden-case runners, `tested_by` edges.

### 9. Vendor / Integration Risk

- **Check:** third-party API stability, lock-in, rate limits, breaking changes.
- **Warning signs:** core flow depends on one unstable API; no abstraction layer.
- **Mitigation:** adapter/abstraction layer; fallback paths; pin versions.
- **Graph evidence:** adapter patterns, provider abstraction layers, integration configs.

## Scoring

Rate each category **Low / Medium / High**. Two or more **High** categories → we recommend Fast Path first and a de-risking spike before committing to a full build.
