---
name: flow-pack-agent-team-scoring
description: FPAT scoring rubrics — the 7-dimension execution rubric for shaping subtasks inside an epic, and the 5-dimension continuation rubric (ship gate >= 40) for deciding which epics ship. Use when running /fpat-plan-issue, /fpat-continuation, or otherwise scoring FPAT directions, subtasks, or epics. No Python — the agent applies the rubric inline.
metadata:
  author: w7-mgfcode
  version: "1.0.0"
  scope: project-local
---

# Flow-Pack Agent-Team Scoring

Project-local skill. Hand-authored for the CVForge AI FPAT workflow — **not** installed via
`npx skills add`, so it is intentionally absent from `skills-lock.json`. Do not let
`npx skills update` manage or overwrite it. Scaffolded with `npx skills init` per
`.claude/rules/skills.md` ("Authoring a project-local skill").

## When to use

- Scoring candidate **directions** or **subtasks** inside a chosen epic → use the
  **7-dimension execution rubric**.
- Deciding which **epics ship** in a V1→V2 continuation pass → use the
  **5-dimension continuation rubric** and its ship bands.
- Invoked by `/fpat-plan-issue` (step 4) and `/fpat-continuation`.

## When NOT to use

- Do not write Score values to the board from here. Board field writes are out of scope; the
  board's `Score` field is set deliberately, and `fpat-project-sync.yml` never touches Status/Score
  (see `.claude/docs/flow-pack-agent-team/board-spec.md`).
- Do not invent a Python scorer. Scoring is applied inline by the agent.

## 7-Dimension Execution Rubric (subtask / direction shaping)

Score each dimension 1–10. Higher = more favorable (frame Risk and Dependency load as
low-burden favorability, so low risk → high score). Source:
`.claude/docs/flow-pack-agent-team/execution-pipeline.md`.

1. **Value** — delivered value of the direction.
2. **Risk** — favorability of the risk profile (low risk scores high).
3. **Readiness** — how ready the work is to start (deps met, scope clear).
4. **Dependency load** — favorability of the dependency burden (few deps score high).
5. **Validation ease** — how cheaply the result can be validated.
6. **Rollback safety** — how safely the change can be reverted.
7. **Evidence strength** — how well claims are backed by file paths / command output.

Use this rubric to compare directions and to sanity-check that each subtask earns its place.

## 5-Dimension Continuation Rubric (epic ship gate)

Score each dimension 1–10. Source:
`.claude/docs/flow-pack-agent-team/continuation-discipline.md`.

1. **Value**
2. **Risk**
3. **Readiness**
4. **Complexity**
5. **Evidence**

### Ship bands (keep verbatim for the first CVForge AI adoption umbrella)

- `>= 40` — **ship**.
- `< 36` — **defer**.
- `36–39` — **negotiate with the user**.

The board's `Score` field stores this 5-dimension total; `fpat-blocked-sweep.yml` audits epics
that left Backlog with `Score < 40`.

## Instructions

1. Pick the rubric: 7-dimension for subtasks/directions, 5-dimension for epic ship decisions.
2. Score every dimension 1–10 with a one-line justification grounded in evidence.
3. Sum the total; for the 5-dimension rubric apply the ship bands above.
4. Present the scores as a table; never write them to GitHub or the board from this skill.
