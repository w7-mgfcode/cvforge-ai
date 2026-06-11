# 15 — Implementation Roadmap Template

**Purpose:** A phase-by-phase roadmap template, and how the graph evidence pack supports each phase.

---

For each phase: **goal · activities · expected outputs · owner · validation · risks · exit criteria**, plus **how the evidence pack helps**.

---

### Phase 1 — Discovery

- **Goal:** confirm the problem, scope, data, and constraints.
- **Activities:** review intake (`04`), resolve open questions, lock the must-have capabilities.
- **Expected outputs:** confirmed scope; Context Quality Score (`06`); Fast Path vs Deep Blueprint decision (`10`).
- **Owner:** product lead + our team.
- **Validation:** scope signed off; assumptions listed.
- **Risks:** vague goal, unknown data volume.
- **Exit criteria:** Context Quality ≥ 70 (or assumptions explicitly accepted).
- **Evidence pack helps:** surfaces comparable projects so scope is informed by what's actually been built.

### Phase 2 — Architecture

- **Goal:** decide the target architecture and stack.
- **Activities:** review Evidence Pack + Architecture Recommendation; resolve stack conflicts.
- **Expected outputs:** target architecture; Blueprint Confidence (`13`); Risk & Gap Report (`12`).
- **Owner:** engineering lead.
- **Validation:** architecture reviewed against evidence; conflicts resolved.
- **Risks:** incompatible stacks, weakly-covered components.
- **Exit criteria:** architecture approved; high-risk areas have a plan.
- **Evidence pack helps:** every architectural choice cites real files; coverage report flags build-from-scratch areas.

### Phase 3 — MVP

- **Goal:** build the thinnest end-to-end slice that proves the core flow.
- **Activities:** adapt COPY/ADAPT files; wire the primary path; stub the rest.
- **Expected outputs:** working core flow (e.g. retrieve → answer).
- **Owner:** dev team / coding agent (via Agent Handoff Pack, `08`).
- **Validation:** run the phase's validation commands; core flow works on sample data.
- **Risks:** integration friction, coupling in adapted files.
- **Exit criteria:** core path works end to end.
- **Evidence pack helps:** the reading list and Copy/Adapt/Drop table tell devs exactly what to take.

### Phase 4 — Pilot

- **Goal:** run with real (limited) data and real users/reviewers.
- **Activities:** add human-in-the-loop gates; collect feedback; start eval tracking.
- **Expected outputs:** pilot results; first quality metrics.
- **Owner:** product + dev.
- **Validation:** eval scores recorded; human approval flow exercised.
- **Risks:** quality below bar, approval bottlenecks.
- **Exit criteria:** quality meets the agreed threshold on pilot data.
- **Evidence pack helps:** eval/judge and approval patterns provide a proven starting design.

### Phase 5 — Production

- **Goal:** harden, secure, and deploy.
- **Activities:** security review, secrets, scaling, monitoring, deployment.
- **Expected outputs:** deployed system; runbook.
- **Owner:** engineering lead + ops.
- **Validation:** security checks pass; deploy reproducible; monitoring live.
- **Risks:** deployment/security gaps (`12`).
- **Exit criteria:** running in production with monitoring and rollback.
- **Evidence pack helps:** reuses infra/deploy/security patterns from reference repos.

### Phase 6 — Optimization

- **Goal:** improve quality, cost, and latency over time.
- **Activities:** tune retrieval, right-size models, expand evals, address gaps.
- **Expected outputs:** measurable improvements; closed gaps.
- **Owner:** dev team.
- **Validation:** eval trends improve; cost/latency tracked.
- **Risks:** regression, cost creep.
- **Exit criteria:** targets met; eval regression gates in place.
- **Evidence pack helps:** caching/model-routing and eval-regression patterns guide tuning.

---

## Roadmap principles

- Phases are gated: don't advance until exit criteria are met.
- Every phase has **validation** — progress is checked, not assumed.
- The evidence pack is the through-line: each phase consumes cited files rather than re-researching.
