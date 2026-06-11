# CVForge AI — Graph-Grounded Vendor Research Package

> **Prepared by:** the graph-powered solution packaging team (Understand-Anything knowledge
> base over 32 AI-engineering reference repositories).
> **Phase:** Research, architecture analysis, evidence mapping, blueprint preparation **only**.
> No implementation, no repository writes, no GitHub mutations were performed.
> **Inputs:** the two filled intakes (`external-team-intake-prompt.cvforge-ai.md`,
> `external-team-intake-prompt.fpat-umbrella-2.md`) and read-only inspection of the
> `cvforge-ai` repository.

## Method & evidence rules (applies to both tracks)

- **Per-repo graphs** supply exact, citable file evidence (`repo · node id · file path`).
- **Unified collection graph** is used only for breadth/frequency/confidence signals.
- **No evidence chain → no recommendation.** Where the graph is thin, this document says so
  rather than invent a pattern.
- Reference repos are cited by their graph repo name (e.g. `dark-factory-experiment`,
  `GitHubIssueTriager`); `cvforge-ai` files are cited by their in-repo path.
- We do **not** claim this auto-generates a production system. We package context, evidence,
  architecture shape, and an agent-ready handoff.

---
---

# Track A — Product AI Copilot Fast Path Research

## A.1 Fast Path Project Fit Assessment

**Verdict: Strong fit for Fast Path orientation. Correctly NOT a build engagement (yet).**

The decision tree (`10-project-fit-decision-tree.md`) routes this here cleanly:

- Has an AI component? **Yes** (replacing a simulated copilot with a real one).
- Requires retrieval/agents/workflows/evals/human approval? **Yes** — human-approval gate (exists)
  and an eval/factuality gate (desired). RAG explicitly out of scope.
- Stack known? **Yes** — Next.js 14 static export is fully characterized.
- Need a quick answer? **Yes** — the team wants the *hosting/architecture shape*, not a build.

The blocking question is an **architecture decision (hosting model), not a coding task**, which is
exactly what Fast Path is for. A Deep Blueprint would be premature: real-LLM integration is not
approved, hosting is undecided, and multi-user/real-data/auth/persistence are all out of scope.

## A.2 Context Quality Score — **88 / 100 (High)**

Scored per `06-context-quality-score.md`:

| Category | Score | Note |
|---|---:|---|
| Goal clarity | 19/20 | Precise: replace simulated copilot with factual, eval-gated tailoring; preserve A4 + Zod + one-way flow. |
| User clarity | 7/10 | Personas listed; near-term "real external users" marked `[UNCERTAIN]` — correctly. |
| Workflow clarity | 14/15 | Five-step edit→template→overflow-check→copilot→diff-accept flow is explicit. |
| Data clarity | 13/15 | Sample data + free-text JD clear; real-CV upload `[UNCERTAIN]` (out of scope). |
| Stack clarity | 9/10 | Versions pinned; AI-layer stack intentionally open (the point of the request). |
| AI behavior clarity | 15/15 | Factual-only, reversible-diff, A4-bounded — hard constraints stated. |
| Constraints clarity | 10/10 | No client key, no server call under `output:'export'`, no state lib, no shadcn, 500-line cap. |
| Output-expectation clarity | 1/5 | Box-checked many deliverables but framed as Fast Path orientation — mild tension (see note). |

**Clear:** the product, the hard constraints, the exact files, the central conflict (LLM hosting
vs static export). **Unclear/missing:** whether real end-users/candidate data ever come in scope
(drives the entire security posture); provider commitment (Claude is "house default" but
uncommitted); and whether job-match is in the first AI slice or deferred. These are listed as
**Open Decisions (A.12)**.

## A.3 Best Matching Reference Patterns

| Need | Best-matching reference(s) | Why it matches |
|---|---|---|
| **Real AI behind a hosted route, with no-key fallback** | `GitHubIssueTriager` | A Next.js app that does real server-side AI in an API route **and degrades to deterministic fallback when no key** — the closest analog to cvforge's hosting dilemma. |
| **Separate proxy/backend in front of a provider** | `fastapi-starter-for-ai-coding` | Clean FastAPI service shell (structured errors, JSON logging, request-ID) — the "option (c)" proxy. |
| **Human approve/reject gate on AI output** | `human-in-the-loop-rag-agent`, `Archon` | Approval-card / approval-panel pattern; validates that cvforge's existing diff-gate is the right shape. |
| **LLM-as-judge quality/factuality scoring** | `ai-agent-mastery` (`prod_judge.py`), `workshops/hierarchical-rag` (`eval.py`) | Structured judge with `{score, pass, reason}` — the optional model-grader for the eval loop. |
| **Prompt/system-template organization** | `Archon-V2-Alpha` (`prompt_service.py`), `workshops` (`prompts.py`) | Named prompt templates loaded at runtime — shape for the tailoring/match prompts. |

## A.4 Graph Evidence Pack

Format: `repo → file → symbol → pattern → evidence → recommendation` (`14-graph-evidence-pack-format.md`).

1. **Hosting model — hosted route with graceful fallback**
   - repo: `GitHubIssueTriager`
   - file: `src/app/api/classify/[id]/route.ts` · id: `function:src/app/api/classify/[id]/route.ts:POST`
   - symbol: `POST` (validates id → loads issue → runs AI classifier → persists)
   - pattern: server-side AI in a Next.js route handler (NOT static export)
   - evidence: also `src/lib/ai.ts` — *"AI layer … with deterministic rule-based and hash-based fallbacks when no API key."*
   - **recommendation [ADAPT]:** this is the reference for "drop `output:'export'` → hosted runtime + `/api` route holds the key server-side." The deterministic-fallback idea maps directly onto keeping the current simulated copilot as the no-key fallback.

2. **Separate proxy/backend (option c)**
   - repo: `fastapi-starter-for-ai-coding`
   - file: `app/core/exceptions.py` · id: `function:app/core/exceptions.py:setup_exception_handlers`; `app/core/logging.py` · id: `function:app/core/logging.py:add_request_id`
   - pattern: minimal, well-structured provider-fronting backend (errors→JSON, request-id logging)
   - **recommendation [ADAPT]:** if the team keeps the static export intact, this is the shape of the standalone proxy that holds the provider key and exposes one tailoring endpoint.

3. **Human approval gate (validation of existing design)**
   - repo: `human-in-the-loop-rag-agent`
   - file: `frontend/src/components/ApprovalCard.tsx` · id: `file:frontend/src/components/ApprovalCard.tsx`
   - pattern: *"approve or reject"* inside a `renderAndWaitForResponse` loop
   - corroboration: `Archon` `packages/web/src/experiments/console/components/ApprovalPanel.tsx` (`function:…:ApprovalPanel`), `Archon` doc `packages/docs-web/src/content/docs/guides/approval-nodes.md`
   - **recommendation [KEEP/COPY-pattern]:** cvforge's `CopilotDiffPanel.tsx` Commit/Discard gate already implements this. Keep it; the references confirm it's the proven shape. Do not replace it.

4. **Eval / judge loop (optional model grader)**
   - repo: `ai-agent-mastery`
   - file: `8_Agent_Evals/backend_agent_api/evals/prod_judge.py` · id: `class:…:JudgeResult` (*"score, pass flag, reason"*), `class:…:ProductionJudgeEvaluator`
   - corroboration: `workshops` `hierarchical-rag/src/eval.py` · id: `function:…:score_with_llm_judge` (*"score answer quality dimensions (correctness, completeness)"*)
   - pattern: structured LLM-judge returning a typed verdict
   - **recommendation [ADAPT, optional]:** model the *optional* factuality grader on `JudgeResult`. **But** the primary factuality/A4 gate should be deterministic first (see A.7) — the LLM judge is a secondary signal, not the gate.

5. **Prompt template organization**
   - repo: `Archon-V2-Alpha` · file: `python/src/server/services/prompt_service.py` · id: `class:…:PromptService`
   - pattern: named prompt templates retrieved at runtime
   - **recommendation [ADAPT]:** organize the tailoring + job-match prompts as named templates rather than inline strings.

> **No-evidence note:** there is **no** graph evidence for "factual-rewrite-that-must-not-fabricate
> for résumés" specifically. The factuality *constraint* is novel to this product; we therefore
> recommend a deterministic diff-based check (A.7), not a graph-sourced pattern.

## A.5 Hosting Decision Matrix (the core deliverable)

The central conflict: `next.config.mjs` sets `output:'export'` → no server, no server-side secret.
`.claude/rules/ai-copilot.md` forbids a server-side LLM call while that holds, and rejects a client
key. Three options, graph-graded:

| Option | What it is | Graph support | Pros | Cons / Risks | Verdict |
|---|---|---|---|---|---|
| **(a) Drop `output:'export'` → hosted Next.js runtime + `/api` route** | Key lives server-side in a route handler | **Strong** — `GitHubIssueTriager` `api/classify/[id]/route.ts` is exactly this | Cleanest; key never ships; one repo; SSR/edge options | Changes deployment model (Vercel functions, not static); cold-start/cost; must re-verify A4 print path still static-renders | **Recommended primary** if the team accepts leaving pure-static |
| **(c) Keep static export + separate proxy/backend** | Static app calls a small external service that holds the key | **Strong** — `fastapi-starter-for-ai-coding` proxy shell | Static app stays untouched; clear security boundary; provider-swappable | Second deployable to run/secure/monitor; CORS; latency hop | **Recommended fallback** / good if static hosting is a hard requirement |
| **(b) Provider key in client code** | Browser calls provider directly with a shipped key | **None / counter-evidence** | — | Key is public under static export — **rejected by repo rule** | **Do not pursue** |
| **(b′) User-supplied key, client-side only** | User pastes their own key; never persisted | Partial — pattern of optional/no-key fallback in `GitHubIssueTriager` `ai.ts` | No vendor key risk; static stays | UX friction; key handling in browser still delicate; not a product-grade default | Niche/demo only; scope explicitly if used |

**Recommended shape:** treat the *current simulated copilot as the permanent no-key fallback*
(mirroring `GitHubIssueTriager`'s deterministic fallback), and put real AI behind **either** (a) a
Next.js `/api` route (if dropping static export is acceptable) **or** (c) a thin proxy (if static
hosting must stay). Decision is the team's — see A.12.

## A.6 Security & Privacy Risk Analysis

- **Key exposure (Critical):** under `output:'export'` any key in client code is public. Both (a)
  and (c) keep the key server-side; (b) is correctly rejected. *Evidence:* `next.config.mjs`
  `output:'export'`; `.claude/rules/ai-copilot.md` "never put a privileged key in client code."
- **Prompt injection via job description (Medium):** free-text JD flows into the prompt. Mitigate
  with input framing + output validation (factuality check, A.7). No graph evidence specific to
  résumé JD injection — treat as standard untrusted-input handling.
- **PII (Conditional/High if real users):** sample data is fictional (`src/data/sample-cv.ts`,
  "Gábor Szabó"). The moment real candidate CVs enter, GDPR-style obligations appear. Currently
  out of scope — keep it that way for the Fast Path. *Open decision A.12.*
- **No persistence today** (verified: no `fetch`/`process.env`/`localStorage`/DB/auth under `src/`)
  — a security asset; any AI option should preserve "no candidate data at rest" unless explicitly
  approved.

## A.7 Architecture-Shape Recommendation (NOT an implementation plan)

A shape, not code:

```
[ Static studio (unchanged): editor → template-engine → LivePreviewCanvas A4 check ]
                                  │  user invokes copilot
                                  ▼
              ┌─────────────────────────────────────────────┐
              │  AI tailoring boundary (server-side key)      │
              │  option (a) Next.js /api/tailor  OR           │
              │  option (c) external proxy /tailor            │
              │   - named prompt template (PromptService-style)│
              │   - returns {optimized, diffs}                │
              └─────────────────────────────────────────────┘
                                  │
                                  ▼
   [ Deterministic gate ]  ── factuality check: no new named entities / numbers / employers
                                not present in source CV  (diff-based, no model needed)
                           ── A4-fit check: reuse print-validator.auditDocumentData +
                                LivePreviewCanvas scrollHeight ≤ pageCount*1122
                                  │ pass
                                  ▼
   [ Existing CopilotDiffPanel ]  ── human Commit/Discard (KEEP — already correct)
                                  │ commit
                                  ▼
              onUpdateContent → useState<CVDocument> (one-way flow preserved)
                                  │
                           [ optional LLM judge ]  (prod_judge-style, off the critical path,
                                                     logs a quality score over time)
```

**Invariants preserved:** A4 fidelity (existing static + dynamic checks become the *acceptance
signal*), Zod schema lock-step (AI only ever proposes `biographicalSummary` / `employmentTimeline`
values that re-validate), one-way `onUpdateContent`, no new state library.

## A.8 Copy / Adapt / Drop Table

| Source | Decision | Reason |
|---|---|---|
| `GitHubIssueTriager` `api/classify/[id]/route.ts` (route shape) | **ADAPT** | Reuse the "validate → call AI → return JSON" route shape; cvforge has no DB persist step. |
| `GitHubIssueTriager` `src/lib/ai.ts` no-key fallback idea | **ADAPT** | Make the existing simulated copilot the explicit fallback. |
| `fastapi-starter-for-ai-coding` `core/exceptions.py` + `core/logging.py` | **ADAPT** | Only if option (c); take the error/logging skeleton, drop the rest. |
| `human-in-the-loop-rag-agent` `ApprovalCard.tsx` / `Archon` `ApprovalPanel.tsx` | **DROP (as transplant)** | cvforge's `CopilotDiffPanel.tsx` already implements the gate — keep cvforge's, cite these only as validation. |
| `ai-agent-mastery` `prod_judge.py` `JudgeResult` | **ADAPT (optional)** | Typed judge verdict for the optional grader; Langfuse coupling is **DROP**. |
| `Archon-V2-Alpha` `prompt_service.py` | **ADAPT** | Named-prompt-template organization, not the Python service itself. |
| Any RAG / vector / retrieval node | **DROP** | RAG explicitly out of scope. |

## A.9 Template Pack (what fits)

- **Tailoring prompt template** (named, `PromptService`-style): inputs = source CV section + JD;
  hard instruction "rewrite for clarity/keywords; **introduce no facts, employers, dates, or
  numbers not present in the source**; preserve length budget."
- **Job-match prompt template**: gap analysis vs `skillsInventory`; output structured
  `{matched, missing, recommendation}` (mirrors the existing `matchJobDescription` contract).
- **Deterministic factuality checker** (no model): tokenize source vs optimized; flag any new
  capitalized entity / number / date. This is the *gate*; the LLM judge is advisory.
- **Approval-gate UI**: already present — `CopilotDiffPanel.tsx`. No new template needed.
- **Optional judge loop**: `prod_judge`-style `{score, pass, reason}` logged per acceptance.

## A.10 Risk Assessment (per `12-risk-assessment-framework.md`)

| Category | Level | Note / evidence |
|---|---|---|
| Technical | Medium | Static-export ↔ server-key conflict is the crux; both viable options well-evidenced. |
| Agent | Low | Single-shot copilot, human gate stays; no autonomous loops. |
| RAG | N/A | Out of scope. |
| Deployment | **High** | Option (a) changes the deploy model (`vercel.json` static → functions); re-verify A4 static render. |
| Security | **High** | Key handling under static export; mitigated by (a)/(c), never (b). |
| Cost | Medium | Per-tailoring LLM calls; cache + small model; judge off critical path. |
| Data | Low now / High later | Fictional data today; real CVs would flip this. |
| Evaluation | Medium | Factuality is partly novel; deterministic gate first reduces this. |
| Vendor | Medium | Provider uncommitted; isolate behind one prompt-service boundary to stay swappable. |

## A.11 Blueprint Confidence Score — **68 / 100 (Strong, with one weak axis)**

Per `13-blueprint-confidence-model.md`:

- Matching repos: good (hosting + approval + judge all have ≥1 solid source).
- Evidence file quality: high for **hosting** (`GitHubIssueTriager`) and **approval** (existing + 2 refs).
- Pattern recurrence: high for approval/prompt, moderate for judge (11 hits collection-wide).
- Stack compatibility: high — `GitHubIssueTriager` is itself Next.js.
- **Weak axis:** the *résumé-specific factuality gate* has **no direct graph evidence** (novel).
  This caps overall confidence; the architecture-shape and hosting decision are well-supported,
  the factuality-eval correctness is not yet proven by reuse.

**Per-capability:** Hosting decision 80 · Approval gate 82 · Prompt organization 72 ·
Factuality/eval 48. The lowest *required* axis (factuality) sets the real caution.

## A.12 Open Decisions (must answer before any build)

1. **Hosting:** accept dropping `output:'export'` (option a), or commit to a separate proxy (option c)?
2. **Real users / real candidate data:** in scope ever? (Flips the entire security/PII posture.)
3. **Provider commitment:** Claude (house default) or keep provider-agnostic behind the boundary?
4. **First AI slice:** factual optimizer only, or optimizer + job-match together?
5. **Factuality gate acceptance bar:** what counts as "fabrication"? (Defines the deterministic check.)

## A.13 What NOT to build yet

- Do **not** wire any LLM call while `output:'export'` is set and the hosting decision is open.
- Do **not** ship a provider key in client code (option b) under any circumstance.
- Do **not** add RAG/vector retrieval (out of scope).
- Do **not** add auth, persistence, multi-user, or real candidate data.
- Do **not** replace `CopilotDiffPanel` — it is already the correct approval gate.
- Do **not** introduce a state library, shadcn, or break the 500-line cap or A4/Zod contracts.

## A.14 MCP / Tool / Agent Opportunity (light, per Fast Path)

Low near-term value for the *product*. The only candidate is a "tailor-CV" tool/endpoint (option a/c
already covers this). No MCP server justified for a single-user studio. Reassess only if real
users + multiple AI features arrive.

## A.15 Agent Handoff Pack (for later — NOT now)

Deferred by design (no build approved). When the hosting decision is made, the handoff (per
`08-agent-handoff-pack-format.md`) would carry: goal (replace simulated copilot, factual + gated);
chosen hosting option; evidence files above; the deterministic-gate + keep-CopilotDiffPanel
decisions; constraints (A4/Zod/one-way/no-key); phases (boundary → prompt template → deterministic
gate → optional judge); validation (`npm run lint`, `npm run build`, manual `/studio` A4 preview);
success criteria (factual, reversible, A4-bounded, key never client-side).

---
---

# Track B — FPAT Umbrella 2 Deep Blueprint Research

## B.1 Deep Blueprint Project Fit Assessment

**Verdict: Strong fit for a Deep Blueprint — with one honest caveat.**

This is an evaluation-harness build over existing, well-structured signals: deterministic-first,
read-only, repeatable. The collection has strong **scorecard/aggregation/verdict** and
**read-only-audit-that-emits-a-report** patterns. **Caveat:** the collection has **no
delivery-metrics (DORA-style) harness** (the `reliability-throughput` graph query returned **0
hits**). So the *9-domain metric model* is largely original work; what's reusable is the harness
*shape*, the *scorecard packaging*, and the *deterministic-aggregation-to-verdict* pattern. Deep
Blueprint is still right because the architecture, risks, and phasing are substantial and
graph-supported — just not the metric definitions themselves.

## B.2 Context Quality Score — **92 / 100 (High)**

| Category | Score | Note |
|---|---:|---|
| Goal clarity | 20/20 | "Baseline measurement only; instrument so future cycles compare" — exact and disciplined. |
| User clarity | 9/10 | Owner, agents, maintainers, reviewers. |
| Workflow clarity | 14/15 | 5-step run→JSON→scorecard→limitations→recommendations. |
| Data clarity | 14/15 | Precise GitHub fields + local artifacts enumerated. |
| Stack clarity | 10/10 | Keep `scripts/fpat/*.mjs` + JSON/MD reports, no new deps. |
| AI behavior clarity | 14/15 | Deterministic-first; model grading optional, non-gating. |
| Constraints clarity | 10/10 | Read-only, no `src/**`, no board writes, mark inferred data. |
| Output-expectation clarity | 1/5 | Many deliverables requested — appropriate for Deep Blueprint. |

Unusually strong intake; the baseline-not-proof discipline (n=1) is exactly right and de-risks the
"Portfolio/Communication" failure mode.

## B.3 Best Matching Reference Patterns

| Need | Best-matching reference(s) | Why |
|---|---|---|
| **Deterministic scorecard JSON + pass/fail summary** | `dark-factory-experiment` `feedback/sprint-N-round-M.json` | Per-criterion scores + overall summary — the exact scorecard artifact shape. |
| **Score N dimensions → write a report file** | `dark-factory-experiment` `.archon/workflows/benchmark-evaluator.yaml` | Scores 7 dimensions, writes `evaluation.json` — maps onto the 9 FPAT domains. |
| **Deterministic aggregation → single verdict** | `dark-factory-experiment` `dark-factory-synthesize-verdict.md` | Aggregates multiple reviewer outputs into one approve/changes/reject — the scorecard roll-up logic. |
| **Read-only audit script that validates + emits report** | `harness-engineering-demo` `e2e_check.py`; `.claude/skills/review/SKILL.md` | "Drive checks → write a report" shape; review skill writes a review report. |
| **Aggregate run/event data into summary rows** | `Archon` `buildNodeSummaries`, `listDashboardRuns`, `StatusSummaryBar` | Aggregation of workflow runs into status counts/summaries → workflow-reliability report. |
| **Gather artifacts → follow-up/decision matrix → posted summary** | `Archon` `archon-issue-completion-report.md`, `archon-workflow-summary.md` | The "compile everything into one report" generator pattern. |
| **Handoff/resumability capture** | `Archon` `.claude/commands/handoff.md`, `hydrateResumableRun`, `RunActionBar` (resume) | Reference for scoring handoff completeness/continuation. |
| **GitHub issue/PR state reading** | `GitHubIssueTriager` (`issues/page.tsx getIssues`), cvforge's own `scripts/fpat/*` | Reading + joining issue state; cvforge already reads via `gh`. |

## B.4 Graph Evidence Pack

1. **Scorecard artifact schema**
   - repo: `dark-factory-experiment` · file: `feedback/sprint-1-round-0.json` · id: `config:feedback/sprint-1-round-0.json`
   - pattern: *"per-criterion scores, detailed feedback, and an overall summary (pass/fail)"*
   - **recommendation [ADAPT]:** model `docs/reports/<date>/fpat-scorecard.json` on this — one block per domain `{score, evidence[], notes, confidence}` + an overall `{summary, proven[], not_proven[]}`.

2. **Multi-dimension evaluator that writes a JSON report**
   - repo: `dark-factory-experiment` · file: `.archon/workflows/benchmark-evaluator.yaml` · id: `config:.archon/workflows/benchmark-evaluator.yaml`
   - pattern: scores N dimensions on a fixed scale, writes `evaluation.json`
   - **recommendation [ADAPT]:** the 9 FPAT domains become the dimensions; replace the model-critic with **deterministic graders** (counts/ratios/regex), keep the "dimensions → JSON" structure.

3. **Deterministic aggregation → one verdict**
   - repo: `dark-factory-experiment` · file: `.archon/commands/dark-factory-synthesize-verdict.md` · id: `document:.archon/commands/dark-factory-synthesize-verdict.md`
   - pattern: *"deterministically aggregates … into one approve/request_changes/reject"*
   - **recommendation [ADAPT]:** the scorecard aggregator that turns 9 domain results into an overall FPAT-health summary — deterministic, no model.

4. **Read-only audit → report file**
   - repo: `harness-engineering-demo` · file: `app/backend/e2e_check.py` · id: `function:app/backend/e2e_check.py:main`; `.claude/skills/review/SKILL.md`
   - pattern: drive a sequence of checks, emit a structured report
   - **recommendation [ADAPT]:** the shape of each `scripts/fpat/audit-*.mjs` (read → compute → write JSON).

5. **Run aggregation into status summaries (workflow reliability)**
   - repo: `Archon` · id: `function:packages/cli/src/commands/workflow.ts:buildNodeSummaries`, `function:packages/core/src/db/workflows.ts:listDashboardRuns`, `function:packages/web/src/components/dashboard/StatusSummaryBar.tsx:StatusSummaryBar`
   - pattern: aggregate run events → per-status counts/summaries
   - **recommendation [ADAPT]:** the success/skipped/cancelled tally + per-workflow ratios for the Automation-Reliability domain.

6. **Completion-report / summary generator**
   - repo: `Archon` · file: `.archon/commands/defaults/archon-issue-completion-report.md` (+ `archon-workflow-summary.md`)
   - pattern: gather all artifacts → follow-up matrix + decision matrix → one report
   - **recommendation [ADAPT]:** the Markdown scorecard generator that compiles all domain JSONs into the human-readable `fpat-scorecard.md`.

7. **Handoff capture / resumability**
   - repo: `Archon` · file: `.claude/commands/handoff.md` · id: `document:.claude/commands/handoff.md`; `function:packages/workflows/src/executor.ts:hydrateResumableRun`
   - pattern: capture session state so work continues; hydrate a resumable run
   - **recommendation [ADAPT]:** reference for the Agent-Handoff-Quality + Continuation-Success domain checks (required sections present, next-action present, resumable).

8. **GitHub issue-state read + join**
   - repo: `GitHubIssueTriager` · id: `function:src/app/issues/page.tsx:getIssues`
   - pattern: query issues joined with derived data, filterable
   - **recommendation [DROP as transplant / cite only]:** cvforge already reads GitHub via `gh` in `scripts/fpat/*`; reuse cvforge's own reading, not this DB-backed version.

> **No-evidence note (important):** **No repo in the collection computes delivery throughput,
> cycle time, merge time, or success/cancel ratios as a metric model** (`reliability-throughput`
> = 0 hits). The metric *definitions* for domains 1–9 are **build-from-scratch**. The graph
> supports *how to package and aggregate* them, not *what they should be*.

## B.5 Copy / Adapt / Drop Table

| Source / asset | Decision | Reason |
|---|---|---|
| `dark-factory-experiment` `feedback/*.json` scorecard schema | **ADAPT** | Per-criterion → per-domain JSON. |
| `dark-factory-experiment` `benchmark-evaluator.yaml` dimension loop | **ADAPT** | Keep structure, swap model-critic → deterministic graders. |
| `dark-factory-experiment` `synthesize-verdict.md` aggregation | **ADAPT** | Deterministic roll-up to overall health. |
| `harness-engineering-demo` `e2e_check.py` audit shape | **ADAPT** | Read→compute→report skeleton for `audit-*.mjs`. |
| `Archon` `buildNodeSummaries` / `StatusSummaryBar` | **ADAPT** | Run-status aggregation logic for reliability domain. |
| `Archon` `archon-issue-completion-report.md` | **ADAPT** | Markdown scorecard compiler shape. |
| `Archon` `handoff.md` | **ADAPT** | Handoff-completeness checklist source. |
| cvforge `scripts/fpat/validate-*.mjs`, `check-doc-consistency.mjs`, `test-negotiation-band.mjs` | **COPY/EXTEND (in-repo)** | Already read-only, deterministic, in the target style — the harness should sit beside these. |
| `GitHubIssueTriager` DB-backed issue reading | **DROP** | cvforge reads via `gh`; no DB wanted. |
| Any `.archon/workflows/*` runtime engine | **DROP** | cvforge wants plain `.mjs`, not the Archon workflow runtime. |
| Langfuse / model-grader infra (`ai-agent-mastery`) | **DROP (from baseline)** | Model grading is optional, non-gating. |

## B.6 Template Pack

- **`audit-*.mjs` skeleton** (read-only): parse args → read source (gh JSON / repo files) → compute
  deterministic metrics → write `docs/reports/<date>/<domain>.json` → print summary + exit code.
  *Shape from* `harness-engineering-demo/e2e_check.py` + cvforge's existing `validate-*.mjs`.
- **Domain JSON schema** (per `dark-factory` feedback): `{domain, generatedAt, inputs[], metrics{},
  findings[], confidence, proven[], not_proven[]}`.
- **Scorecard aggregator** (`synthesize-verdict`-style, deterministic): read all domain JSONs →
  `fpat-scorecard.json` + `fpat-scorecard.md` with an explicit "what these numbers do / do not
  prove" section.
- **Reliability tally** (`StatusSummaryBar`/`buildNodeSummaries`-style): success/skipped/cancelled
  per workflow + Project-Sync cancellation rate.
- **Handoff-quality checklist** (`handoff.md`-style): required sections present, next-action present,
  staleness, continuation output exists.

## B.7 Build Blueprint (target evaluation architecture)

```
scripts/fpat/eval/                      # NEW, read-only, sits beside existing scripts/fpat/*
  lib/
    gh.mjs            # thin read-only wrappers over `gh` (issues/PRs/runs/projects JSON)
    report.mjs        # writeReport(domain, obj) → docs/reports/<date>/<domain>.json
    schema.mjs        # domain JSON shape + validation (Zod already in repo)
  audit-throughput.mjs        # domain 1   (cycle time, merge time, issue/PR ratio, epic children)
  audit-quality.mjs           # domain 2   (fix-PR ratio, self-fix PRs, reverts)
  audit-reliability.mjs       # domain 3   (success/skipped/cancelled per workflow; sync cancel rate)
  audit-board.mjs             # domain 4   (Type/Phase/Area completeness, orphans, missing items)*
  audit-planning.mjs          # domain 5   (branch-naming + commit-format regex, 5-sub-issue rule)
  audit-handoff.mjs           # domain 6   (required sections, stale count, next-action)
  audit-continuation.mjs      # domain 7   (continuation output, negotiation-band consistency)
  audit-signal.mjs            # domain 8   (false-positive cancels, drift not caught)
  audit-portfolio.mjs         # domain 9   (scorecard exists, proves/doesn't-prove, dated chain)
  scorecard.mjs               # aggregates all domain JSONs → fpat-scorecard.{json,md}

* board/projects audits need read access to Projects v2 → FPAT_PROJECT_TOKEN (see B.8 risk).
```

- **Inputs:** `gh issue list/view --json`, `gh pr list --json`, `gh run list --json`, Projects v2
  GraphQL (read), `.claude/handoffs/*.md`, `HANDOFF.md`, `.claude/rules/flow-pack-agent-team/*`,
  `.github/ISSUE_TEMPLATE/fpat_*.yml`, prior `docs/reports/<date>/*`.
- **Outputs:** one JSON per domain + `fpat-scorecard.json` + `fpat-scorecard.md`, all under
  `docs/reports/<date>/`.
- **Aggregation:** deterministic; `scorecard.mjs` never grades with a model.
- **CI integration:** extend the existing `fpat-validate.yml` pattern (already runs `*.mjs` on PR)
  with a **read-only** scheduled job (like `fpat-blocked-sweep.yml`) that runs the audits and
  uploads reports as artifacts — **no board writes**.
- **Validation:** each script is deterministic and fixture-testable (mirror existing
  `test-negotiation-band.mjs`); `node scripts/fpat/eval/<x>.mjs` exits non-zero only on its own
  internal error, never on "low score" (scores are data, not gates).
- **Failure modes:** see B.8.

## B.8 Risk Assessment

| Category | Level | What to check / mitigation | Graph evidence |
|---|---|---|---|
| Technical | Low–Med | Pure `.mjs` + `gh`; no new deps. Keep scripts < 500 lines (repo rule). | cvforge `validate-*.mjs` style |
| GitHub/API | **High** | Projects v2 read needs `FPAT_PROJECT_TOKEN`; rate limits; pagination (board has 52 items, runs 100+). Mitigate: paginate, cache JSON to disk, mark token a hard dependency; degrade board audit gracefully if token absent. | `fpat-blocked-sweep.yml` already paginates |
| Workflow Signal | **High** | The 30 cancelled runs' root cause is **inferred**, not proven (intake says so). Don't score "cancel = failure"; classify cancels and label inference explicitly. | — (novel; honor intake caution) |
| Board Consistency | Med | Field taxonomy must match `board-spec.md`; orphan/missing detection needs the token. | cvforge `.claude/docs/.../board-spec.md` |
| Handoff Scoring | Med | "Required sections present" is deterministic; "usefulness" is subjective → keep optional/model-only, non-gating. | `Archon` `handoff.md` |
| Evaluation | **High** | n=1 umbrella: **do not claim improvement.** Report baseline only; every metric carries proven/not-proven. | intake discipline |
| Maintenance | Med | Scripts drift as FPAT rules change; co-locate with rules; add a consistency check (like `check-doc-consistency.mjs`). | cvforge `check-doc-consistency.mjs` |
| Portfolio/Communication | Med | Scorecard must state what numbers *don't* prove or it misleads reviewers. Bake "not_proven[]" into the schema. | `dark-factory` overall-summary field |

## B.9 Blueprint Confidence Score — **62 / 100 (Usable; needs careful adaptation)**

- **Strong (80+):** scorecard JSON shape, deterministic aggregation, audit-script-emits-report,
  run-status reliability tally — all directly evidenced (`dark-factory`, `harness-engineering`, `Archon`).
- **Moderate (55–65):** board-consistency + handoff/continuation scoring — patterns exist but need
  cvforge-specific wiring + token.
- **Weak (≈40, caps the score):** the **9-domain metric model itself** — `reliability-throughput`
  = 0 hits; no delivery-metrics harness in the collection. The definitions are original.

**Net:** the *harness architecture and packaging* are well-supported (high); the *metric semantics*
are build-from-scratch (low). 62 reflects "build it, but the metric definitions are your design, not
a transplant — validate them against the Umbrella #1 data before trusting them."

## B.10 MCP / Tool / Agent Opportunity Detection (opportunity analysis only)

Per `16-mcp-opportunity-detector.md` — *analysis, not scope*:

- **Eval harness:** ✅ strong — this *is* one. Build as plain scripts first (intake's preference).
- **Reusable skill:** ✅ plausible — a `/fpat-eval` skill wrapping the audit run + scorecard, modeled
  on cvforge's existing `.claude/commands/fpat-*` and `harness-engineering` SKILL pattern. Good
  later step.
- **Agent workflow:** ◑ maybe — chaining audits → scorecard is a small DAG, but plain script
  sequencing is simpler; don't over-engineer.
- **Human-in-the-loop:** ◑ only for interpreting qualitative findings (optional, non-gating).
- **Agent tool / MCP server:** ✗ not justified now — single-repo, single-user, read-only batch job.
  Reassess if multiple repos need the same scorecard.

## B.11 Agent Handoff Pack (for Claude Code / Codex to implement *later*)

Per `08-agent-handoff-pack-format.md`:

- **Goal:** Build a read-only, deterministic FPAT evaluation harness that baselines Umbrella #1 and
  produces a repeatable JSON+Markdown scorecard across 9 domains. Baseline only — no improvement claims.
- **Target architecture:** `scripts/fpat/eval/` tree in B.7; outputs to `docs/reports/<date>/`.
- **Evidence files (read first):** cvforge `scripts/fpat/validate-package.mjs`,
  `check-doc-consistency.mjs`, `test-negotiation-band.mjs`, `.github/workflows/fpat-blocked-sweep.yml`,
  `.claude/rules/flow-pack-agent-team/{branch-naming,commit-format}.md`,
  `.claude/docs/flow-pack-agent-team/board-spec.md`; reference shapes from `dark-factory-experiment`
  `feedback/*.json` + `benchmark-evaluator.yaml` + `synthesize-verdict.md`,
  `harness-engineering-demo` `e2e_check.py`, `Archon` `buildNodeSummaries`/`handoff.md`.
- **Copy/Adapt/Drop:** B.5.
- **Constraints:** read-only against GitHub; no `src/**`; no board/issue/PR/label/workflow writes;
  no new deps; no secrets in repo; `.mjs` style; < 500 lines/file; scores are data, never CI gates;
  mark all inferred data as inferred; never claim improvement from n=1.
- **Phases:** (1) `lib/` + schema + one domain (throughput) end-to-end; (2) reliability + planning
  (fully deterministic, no token); (3) board + continuation/handoff (needs token — gate on it);
  (4) `scorecard.mjs` aggregator + Markdown; (5) read-only scheduled CI job + Umbrella-3 recommendation loop.
- **Validation commands:** `node scripts/fpat/eval/<audit>.mjs` (each emits JSON + exit 0);
  `node scripts/fpat/eval/scorecard.mjs`; fixture tests in the `test-negotiation-band.mjs` style;
  `npm run lint`; `npm run build`.
- **Risks:** B.8 (token dependency, inferred-cancel signal, n=1 discipline are the top three).
- **Success criteria:** every domain emits a deterministic JSON; scorecard compiles with explicit
  proven/not-proven sections; runs read-only with zero GitHub mutations; reproducible from a clean
  checkout given the token; no claim of improvement.

## B.12 Explicit Assumptions, Ambiguities, Unresolved Decisions

- **Assumption:** `FPAT_PROJECT_TOKEN` (read scope) can be provisioned for Projects v2 audits; if
  not, board-consistency domain degrades to "label-only" inference. *(intake flags this risk)*
- **Assumption:** prior tallies (37 issues, 25 PRs, 56/14/30 run conclusions) are inputs to verify,
  not ground truth — the harness recomputes them.
- **Ambiguity:** the 30 cancelled runs' root cause (Project-Sync concurrency) is inferred; the
  harness must label it inferred, not score it as failure.
- **Unresolved:** exact numeric thresholds for "good" per domain — recommend reporting raw values
  first (no thresholds) until ≥2 umbrellas exist to compare.
- **Unresolved:** whether the scheduled CI job is wanted now or after the manual run is validated.

---
---

# Decision Requests

Before any implementation or GitHub issue creation, we need decisions on:

**Track A (Product Copilot):**
1. Hosting: option (a) drop `output:'export'` → `/api` route, or option (c) separate proxy? *(blocks everything)*
2. Are real users / real candidate data ever in scope? *(sets the security/PII posture)*
3. Provider: commit to Claude, or stay provider-agnostic behind the prompt boundary?
4. First AI slice: factual optimizer only, or optimizer + job-match?
5. Definition of "fabrication" for the deterministic factuality gate.

**Track B (FPAT Umbrella 2):**
6. Can `FPAT_PROJECT_TOKEN` (read scope) be provisioned? If not, accept degraded board audit?
7. Report raw metrics only (no thresholds) for the n=1 baseline — agreed?
8. Manual run first, or scheduled read-only CI job from the start?
9. Confirm scores are **data, never CI gates** (no PR fails on a "low score").

# Recommended Next Action

**Track A:** **(1) Wait for the hosting decision** (Decision Request #1). It is the single blocker;
no further vendor research changes until the team chooses (a) or (c). Once chosen, we issue the
Track A Agent Handoff Pack. *Do not create issues for Track A yet.*

**Track B:** **(2) Create a read-only FPAT eval dry-run** — implement Phase 1 only
(`lib/` + schema + `audit-throughput.mjs`) against Umbrella #1 data to validate the metric model on
real data **before** committing the full 9-domain harness. This is the highest-value next step and
honors the "baseline, deterministic, read-only" discipline.

Then **(3) create GitHub issues after approval** for the remaining Track B phases, and
**(4) revise the Track A intake** only if the hosting decision changes its constraints.

> This document is research, evidence mapping, and blueprint preparation only. No implementation,
> no repository writes, no GitHub mutations were performed in producing it.
