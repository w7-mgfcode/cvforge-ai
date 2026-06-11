# 14 — Graph Evidence Pack Format

**Purpose:** Define the evidence chain that must sit behind **every** recommendation. This is the integrity rule of the whole service.

---

## The chain

Every recommendation traces back through this chain:

```
Repo
 ↓
File
 ↓
Function / Class / Component
 ↓
Pattern
 ↓
Evidence
 ↓
Recommendation
```

If any link is missing, the recommendation is not made.

## Required fields per evidence item

Each evidence item **must** include all of:

| Field | Description |
|---|---|
| `repo` | Reference repo the evidence comes from |
| `node_id` | The graph node id (stable identifier) |
| `file_path` | Path to the file within the repo |
| `node_type` | `file` / `function` / `class` / `config` / `pipeline` / `service` / `table` / `document` / … |
| `summary` | The node's human-readable summary |
| `layer` / `tour_step` | Architectural layer or guided-tour step, if available |
| `why_it_matters` | One line: why this is relevant to the request |
| `decision` | **COPY** / **ADAPT** / **DROP** |
| `recommendation` | The concrete blueprint line this supports |

## The rule

> **No evidence chain → no blueprint line.**

A recommendation without a complete chain does not appear in any deliverable. We would rather return fewer, solid lines than pad the blueprint with unbacked claims.

## Copy / Adapt / Drop decision logic

Derived primarily from **in-repo `imports` coupling**:

- **COPY** — standalone or near-standalone (0–2 in-repo imports, no repo-specific config). Portable as-is.
- **ADAPT** — useful but coupled (heavy in-repo imports, repo-specific clients/config). Transplant the logic, rewire dependencies.
- **DROP** — repo-specific glue (auth to a specific provider, bespoke infra) with no general value.

## Example evidence item

```yaml
- repo: <rag-project>            # illustrative
  node_id: pipeline:agents/rag/retrieval.py
  file_path: agents/rag/retrieval.py
  node_type: pipeline
  summary: "Chunk → embed → vector search → rerank → ground answer in retrieved text."
  layer: Retrieval
  why_it_matters: "This is the core answer path your support assistant needs."
  decision: ADAPT          # 7 in-repo imports → rewire deps
  recommendation: "Base your retrieval service on this flow; replace the embedding client with your provider."
```

## Two-tier sourcing (restated)

- **Per-repo graphs** supply the evidence items above — exact, citable.
- **Unified collection graph** supplies the *recurrence* signal: how many of the 32 repos show the same pattern. This feeds confidence (`13`) but is **never** used as a citation on its own.
