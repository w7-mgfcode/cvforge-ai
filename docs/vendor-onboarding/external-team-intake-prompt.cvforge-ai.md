# External Team Intake — CVForge AI / WorkflowCV Studio (FILLED)

> Filled instance of `external-team-intake-prompt.md`, derived from the actual cvforge-ai
> repository (code, `CLAUDE.md`/`AGENTS.md`, `.claude/rules/*`, `PROJECT_CONTEXT.md`,
> `src/lib/ai/copilot.ts`, `next.config.mjs`, schema, template engine, print validator).
> Claims are evidence-backed; unknowns are marked **[UNCERTAIN]** rather than invented.
> The blank template is left untouched at `external-team-intake-prompt.md`.

**Decision status (resolved by the team):** This is a **Fast Path orientation request, NOT a
build engagement.** We are *not* committing to a real-LLM implementation yet — the purpose is to
clarify the architecture shape and the hosting/security trade-off. Hosting preference: **no
privileged key in client code**; investigate a **separate proxy / hosted function first**
(keeps the current static app intact), with "drop `output:'export'` for a hosted runtime" as the
fallback. **RAG is out of scope** for now. **Single-user / fictional sample data only** — no real
candidate data, auth, persistence, or multi-user. The FPAT workflow/eval layer is handled in a
**separate intake** (`external-team-intake-prompt.fpat-umbrella-2.md`), not here.

---

```text
We want to use your graph-powered solution packaging service to turn our project idea into a practical build blueprint.

Please analyze our idea using your Understand-Anything Graph knowledge base and prepare a graph-grounded solution package.

Our goal is not to receive generic AI advice. We want you to identify relevant reference patterns, exact evidence files, reusable architecture ideas, risks, stack conflicts, and a practical implementation direction.

Important expectation:
Every recommendation should be backed by evidence from your graph knowledge base. If there is weak evidence for part of the request, say so clearly instead of inventing a solution.

PROJECT IDEA

CVForge AI / WorkflowCV Studio is a Next.js 14 (App Router) application, statically exported
(`output: 'export'`, no server runtime), that models a résumé as a structured CVDocument
(Content / Design / Metadata) with TypeScript + Zod and renders it into three print-bounded A4
templates (dossier / ats / visual). Its differentiator is strict A4 print fidelity: 1122px per
page @ 96 DPI, with a static content-length auditor and a live DOM-height overflow check so
variable-length CVs never silently clip or overflow. It currently ships a *simulated* AI copilot
(factual wording optimizer + job-description keyword matcher) that does not call any LLM. We want
a graph-grounded blueprint for replacing that mock with a real, factual, evidence-checked AI
tailoring capability — including the hosting decision that the current static-export model forces —
while preserving A4 fidelity, the Zod schema contract, and the one-way data flow. A secondary
interest is the repo's existing "FPAT" agent-team delivery-automation layer, which is being
evaluated as its own workflow/eval engineering effort.

SHORT INTAKE

Project name or working title:
CVForge AI / WorkflowCV Studio

What are we trying to build?
Present: a print-bounded A4 résumé studio (structured CV model, 3 templates, design-token panel,
live A4 overflow detection, simulated AI copilot). Desired: replace the simulated copilot with a
real, factual, eval-gated AI tailoring/job-match capability without breaking A4 fidelity or the
static-export hosting model — which means making an explicit hosting decision first.

Who will use it?
Per PROJECT_CONTEXT.md personas: technical job candidates, an "AI workflows engineer" wanting
transparency in data mutation, recruitment helpers toggling templates/density, and design-driven
developers. In practice today it is a portfolio-grade single-user studio (no auth, no multi-user).
[UNCERTAIN] whether real external end-users are a near-term target.

What problem does it solve?
Variable-length, style-sensitive CVs that overflow or get truncated on a fixed A4 page; and
blank-page résumé tailoring. It enforces clean data modeling (Zod), declarative design tokens,
and precise print compilation so content fits A4 without silent clipping. (PROJECT_CONTEXT.md UC-1..UC-4)

What should the AI component do?
Today (mock, src/lib/ai/copilot.ts): optimizeTextSection() rewrites a bullet/summary with a
side-by-side diff; matchJobDescription() does keyword gap analysis vs a fixed skill list.
Desired: real, *factual* tailoring that does not fabricate experience, keeps edits reversible via
the existing diff view, and ideally checks suggestions against the source CV / job description.
The factual-truthfulness and human-verifiable-diff constraints are explicit in
`.claude/rules/ai-copilot.md`.

What data or documents will it use?
Currently one in-memory sample dataset (`src/data/sample-cv.ts`) conforming to
`src/schemas/cv.schema.ts`; no database, upload, or persistence. Desired AI would additionally
consume a user-supplied job description (free text) and the live CVDocument. [UNCERTAIN] whether
real candidate CVs / uploads / storage are in scope.

What stack do we currently use or prefer?
Next.js 14.2.35 (App Router, static export), React 18, TypeScript 5 (strict, no `any`),
Tailwind CSS 3.4, Zod 4, lucide-react. No backend, no DB, no test runner. Deployment target
appears to be Vercel static (session tooling references Vercel). Preferred stack for the AI
addition is [UNCERTAIN] — blocked on the hosting decision below.

What output do we want from you?
(Confirmed selection. Fast Path orientation — architecture shape + hosting trade-off, not a build.)
[x] Build Blueprint
[x] Architecture Recommendation
[x] Agent Handoff Pack
[x] Eval/Judge Loop Design
[x] Human Approval Workflow
[x] Risk and Gap Report
[ ] RAG Pipeline Design          (only if we decide retrieval/grounding is in scope)
[ ] MCP / Tool / Agent Opportunity Analysis  (relevant to the FPAT layer)
[ ] Context Pack / Evidence Pack / Template Pack / ROI/Confidence  (optional add-ons)

DETAILED CONTEXT

1. Current situation

A working, statically-exported Next.js 14 app. State is owned by `src/app/studio/page.tsx`
(`useState<CVDocument>(sampleCV)`) and flows one-way to controlled child panels (editor forms,
canvas, design panel, copilot). `src/lib/template-engine.tsx` holds a `templatesRegistry` +
`renderActiveTemplate` for three templates (dossier/ats/visual). `src/lib/print-validator.ts`
runs static content-length heuristics; `src/components/canvas/LivePreviewCanvas.tsx` measures
real DOM `scrollHeight` vs `pageCount * 1122`. The AI copilot
(`src/lib/ai/copilot.ts` + `src/components/ai-assistant/CopilotDiffPanel.tsx`) is fully
simulated — no network, no LLM, some logic hardcoded to sample content. There is no API route,
server action, auth, database, or persistence anywhere in `src/` (verified by grep: no
`fetch`/`process.env`/`localStorage`). Validation = `npm run lint` + `npm run build` +
manual `/studio` print preview; there is no automated test runner. The repo also carries a
substantial agent-delivery layer ("FPAT": `.claude/` commands/rules/docs, `.github/` workflows,
`scripts/fpat/`) used to run the work itself.

2. Desired outcome

A concrete, evidence-grounded plan to turn the simulated copilot into a real AI tailoring loop
that (a) makes an explicit hosting-model decision compatible with — or deliberately replacing —
`output: 'export'`; (b) preserves A4 fidelity, the Zod schema lock-step, and the one-way
`onUpdateContent` contract; (c) keeps edits factual, reversible, and human-verifiable; and
(d) is measurable (eval/judge loop) so quality can be gated over time. Success = a blueprint +
agent handoff pack our coding agents can execute, with risks and stack conflicts called out.

3. Users and workflow

Who are the users?
Job candidates editing a CV; (aspirationally) recruiters/AI-workflow engineers. Today: single,
unauthenticated studio user.

What should happen step by step?
1. User edits CVDocument content via the editor forms (identity / timeline), validated against the Zod schema.
2. User picks a template (dossier/ats/visual), typography, density, and color tokens in the design panel.
3. The canvas live-renders and flags any A4 overflow (static warnings + dynamic scrollHeight check).
4. User invokes the copilot: factual wording optimization or job-description keyword/skill gap match.
5. User reviews the side-by-side diff and accepts/rejects; accepted edits flow back through `onUpdateContent`; user prints/exports to A4 PDF via the browser.

4. AI capabilities needed

[x] Human-in-the-loop approval   (the diff accept/reject gate already exists and must stay)
[x] Evaluation / judge loop      (desired: gate factuality / A4-fit quality)
[x] Prompt system                (desired: structured tailoring/match prompts)
[ ] Retrieval / RAG              [UNCERTAIN] — only if grounding against a corpus is wanted
[ ] Tool calling                 [UNCERTAIN]
[ ] Agent workflow / Subagents   [UNCERTAIN] for the product; already present in the FPAT layer
[ ] MCP server                   [UNCERTAIN] — candidate for the FPAT layer, not the product
[ ] Data ingestion / Knowledge base   Not currently; [UNCERTAIN] if CV upload is added
[x] UI for AI interaction        (CopilotDiffPanel exists)
Other: factual-only rewriting (must-not-fabricate) is a hard behavioral constraint.

5. Data sources

Today: a single fictional sample dataset `src/data/sample-cv.ts` (typed by `cv.schema.ts`),
held only in React memory; plus free-text job descriptions typed into the copilot at runtime.
No files, APIs, databases, tickets, logs, or transcripts. No persistence layer. Real candidate
data / uploads / storage are [UNCERTAIN] / out of current scope.

6. Stack preferences

Current stack:
Next.js 14.2.35 (App Router, `output: 'export'`), React 18, TypeScript 5 strict, Tailwind 3.4,
Zod 4, lucide-react. Static deploy (Vercel-style). No server, DB, or test runner.

Preferred stack:
Not finalized for the AI layer — clarifying it is the *point* of this Fast Path request. Team
preference among the documented options (`.claude/rules/ai-copilot.md`): **(c) a separate
proxy/backend in front of the provider is the first direction to evaluate** (least disruptive to
the current static app), with **(a) dropping `output:'export'` for a hosted runtime** as the
fallback. Option **(b) — a provider key in client code — is explicitly rejected** (client code
ships publicly under static export). Anthropic Claude is the house default per repo tooling, but
no provider is committed yet.

Stacks or vendors we want to avoid:
Do not introduce a state library (Redux/Zustand) — `useState` + callbacks is mandated. Do not add
shadcn (repo uses a custom template engine + Tailwind). Do not commit secrets or ship a privileged
API key in client code. Avoid anything that breaks A4 fidelity or the Zod schema contract.

7. Integrations

Currently none (no third-party APIs, auth providers, databases, messaging, or AI providers are
wired in). Deployment is static hosting. A real AI feature would add exactly one new integration:
an LLM provider (or a proxy/backend in front of one) — choice pending the hosting decision.

8. Security, privacy, and compliance constraints

- Sample/candidate content must stay fictional or sanitized unless explicitly approved (AGENTS.md).
- No secrets in the repo; **no privileged API key may ship in client code** (static export means
  client-side code is public) — this is the central security constraint on real AI.
- No auth, no PII storage, no audit logging today; CV content is potentially personal data if
  real users are onboarded → [UNCERTAIN] compliance posture (GDPR-style) if that happens.
- Static-export hosting = no server-side secret handling, which directly shapes any AI design.

9. Evaluation and quality requirements

Today: `npm run lint`, `npm run build` (the type gate), and a manual `/studio` print-preview
check across all three templates; there is **no automated test runner**. For real AI we want a
factuality/quality gate: tailored output must not fabricate experience, must remain reversible via
the diff, and must not push the document past A4 bounds (the existing static + dynamic overflow
checks are the natural acceptance signal). A judge/eval loop to measure this over time is desired.
The repo's broader posture favors deterministic checks first, model-graders only where necessary.

10. Timeline and priority

[UNCERTAIN] — no dates in-repo. Stated priorities by evidence: A4 fidelity and factual safety are
non-negotiable; correctness/maintainability over novelty. MVP for the AI step is likely "make the
hosting decision + a real factual optimizer behind the existing diff gate," with job-match second.

11. Similar products or inspiration

[UNCERTAIN] — none named in-repo. Conceptually adjacent: ATS-oriented résumé builders and
LLM "tailor my CV to this job" tools; the differentiator here is strict A4 print compilation and
a fact-locked, human-verified diff.

12. What we do not want

- A server-side LLM call while `output: 'export'` is set (forbidden until the hosting model is
  explicitly changed — `.claude/rules/ai-copilot.md`).
- Any API key embedded in client-shipped code.
- Mock output presented as a real model result without a clear "simulated" signal.
- Changes that overflow/clip/hide résumé content without an explicit warning/mitigation.
- Schema changes that aren't propagated lock-step to sample data, forms, templates, and validator.
- New state libraries, shadcn, or growing the already-large files past the 500-line cap.

PLEASE PRODUCE

1. Project Fit Assessment (Fast Path vs Deep Blueprint).
2. Context Quality Score (0-100) with what's clear/unclear/missing.
3. Best Matching Reference Patterns (per-repo graph evidence).
4. Graph Evidence Pack (Repo -> File -> Symbol -> Pattern -> Evidence -> Recommendation; no chain, no line).
5. Copy / Adapt / Drop Table.
6. Template Pack (prompts / agents / eval loops / approval-gate UI that fit).
7. Build Blueprint (components, modules, data flow, agent/tool flow, UI/backend split, validation) —
   must explicitly resolve the static-export-vs-hosted-runtime decision for the LLM call.
8. Risk Assessment (Technical, Agent, RAG, Deployment, Security, Cost, Data, Evaluation, Vendor).
9. Blueprint Confidence Score (0-100) with reasoning.
10. MCP / Tool / Agent Opportunity Detection.
11. Agent Handoff Pack (per format 08: goal, architecture, evidence files, copy/adapt/drop,
    constraints, phases, validation commands, risks, success criteria).

RULES

- No generic AI advice; ground every recommendation in graph evidence.
- Per-repo graphs for exact file evidence; unified graph only for breadth/frequency/confidence.
- If evidence is weak, say so. If our stack (esp. static export) conflicts with a recommended
  pattern, warn us — the LLM-hosting conflict is the most important one to address.
- Do not claim this will auto-generate a production system.
```
