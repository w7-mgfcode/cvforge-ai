# 09 — Example Solution Package

**Purpose:** One complete, worked example showing the *shape* of a response. Concrete repo/file names here are **illustrative** — real packages cite actual graph nodes.

---

## Example request

> "We want to build a SaaS support assistant that uses our docs, retrieves relevant answers, asks a human to approve risky answers, and tracks eval quality over time."

**Parsed intent facets:** retrieval/RAG · human approval gate · eval/quality tracking · likely web UI + backend API · doc data source.

---

## 1. Best matching repo categories

(Ranked by relevance; real output names the actual repos and scores.)

1. **RAG-with-approval projects** — cover retrieval + an approval-then-respond gate. *Strongest match for the core flow.*
2. **Eval/judge-loop projects** — cover quality scoring and regression tracking over time.
3. **Full-stack AI app projects** — cover the API + UI + auth shell.

## 2. Evidence Pack structure

Each line is one evidence item (full chain in `14`):

```
[ADAPT] repo=<rag-project>  id=pipeline:.../retrieval.py  type=pipeline
        "Chunk → embed → vector search → rerank → ground answer"
        layer: Retrieval · why: this is your core answer path
        cite: {repo:<rag-project>, id:pipeline:.../retrieval.py, file:.../retrieval.py}

[ADAPT] repo=<rag-project>  id=function:.../approval.py:require_approval  type=function
        "Routes risky answers to a human queue before sending"
        why: implements your approval gate
        cite: {repo:<rag-project>, id:function:.../approval.py:require_approval, file:.../approval.py}

[COPY]  repo=<eval-project>  id=function:.../judge.py:score_answer  type=function
        "LLM-as-judge scoring with a rubric; standalone"
        why: drop-in basis for eval tracking
        cite: {repo:<eval-project>, id:function:.../judge.py:score_answer, file:.../judge.py}
```

## 3. Reusable patterns

- **Retrieve → ground → answer** (from the RAG project).
- **Risk classification → human approval → respond** (the approval gate).
- **Generate → judge → store score → trend over time** (the eval loop).
- **Doc ingestion → chunk → index** (data onboarding).

## 4. Copy / Adapt / Drop table

| File | Decision | Reason |
|---|---|---|
| `retrieval.py` | **ADAPT** | Core flow is reusable but imports repo-specific config/clients — rewire. |
| `approval.py:require_approval` | **ADAPT** | Logic fits; queue/notification backend is yours. |
| `judge.py:score_answer` | **COPY** | Standalone, few imports — portable as-is. |
| `<repo>-specific auth glue` | **DROP** | Tied to that repo's identity provider. |

## 5. Stack conflicts

- ⚠️ **Vector store divergence:** one matching repo uses Postgres + pgvector, another uses a hosted vector DB. Pick one consciously; we recommend based on your deployment target.
- ⚠️ **Backend framework divergence:** FastAPI in one source vs a Node service in another. Mixing is possible but adds glue cost.

## 6. Missing pieces (build from scratch)

- **Per-tenant data isolation** for SaaS — weakly covered in the collection; design deliberately.
- **Long-horizon eval dashboards** — judge logic exists, but trend visualization is thin; expect to build the UI.

## 7. Suggested target architecture

```
Docs ──► Ingestion/Index ──► Vector store
                                  │
User ──► API (FastAPI) ──► RAG retrieve+ground ──► Answer
                                  │                  │
                                  ▼                  ▼
                          Risk classifier ──► Human approval queue ──► Send
                                  │
                                  ▼
                          Judge/eval ──► Score store ──► Quality dashboard
```

## 8. Next implementation steps

1. **Discovery:** confirm doc sources, volume, risk policy for "risky answer."
2. **MVP retrieval:** adapt `retrieval.py`; get grounded answers behind the API.
3. **Approval gate:** adapt `require_approval`; wire your queue + notifications.
4. **Eval loop:** copy `score_answer`; persist scores; basic trend view.
5. **Pilot:** run with a subset of docs and a human reviewer; measure quality.
6. **Hardening:** tenant isolation, security review, dashboard.

> Blueprint Confidence for this example would be reported per `13` (strong on RAG + approval + eval; lower on multi-tenant isolation).
