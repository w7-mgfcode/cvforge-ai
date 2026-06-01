---
description: Create a comprehensive implementation plan for a CVForge AI feature
argument-hint: <feature-name-or-description>
---

# Plan Feature: CVForge AI Implementation Planning

## Objective

Produce a detailed, actionable plan for: **$ARGUMENTS**

Save it to `.claude/plans/{kebab-case-name}.md`, designed to be consumed by `/execute` in a
fresh session.

---

## Phase 1: Feature Understanding

Restate the request in your own words. Identify:

1. **Problem / capability gap** — what user need does this serve? (cross-check `PROJECT_CONTEXT.md`)
2. **Success criteria** — what does "done" look like and how do we verify it (incl. A4 print check)?
3. **Scope** — explicitly in vs. out of scope.
4. **Layer impact** — which of these are touched: schema, sample data, editor forms, design
   panel, copilot, canvas, template-engine, print css?
5. **Does it need a server?** If it needs persistence, real LLM calls, or secrets, STOP and note
   that `output: 'export'` must be resolved first (see `.claude/rules/ai-copilot.md`).

---

## Phase 2: Codebase Intelligence (Isolate — use subagents in parallel)

Spawn focused subagents so exploration noise stays out of the main session:

- **Subagent A — affected files:** read the components/lib files in the impacted layers; map the
  current data flow and list every file that must change.
- **Subagent B — the contract:** read `src/schemas/cv.schema.ts` and `src/data/sample-cv.ts`;
  determine if the schema changes and which of the 5 lock-step sites are affected.
- **Subagent C — prior art / patterns:** `git log --oneline | head -20` and read the closest
  existing component to mirror its pattern (controlled form, registry entry, etc.).

Scout `.claude/docs/` headers; load `architecture-deep-dive.md` or `print-fidelity-guide.md`
only if the change is cross-cutting or print-related. Synthesize: current state, gaps, constraints.

---

## Phase 3: External Research (if needed)

If the feature uses an unfamiliar library/API, web-search the docs and note version gotchas.
Only add a dependency if it materially reduces risk (per `AGENTS.md`).

---

## Phase 4: Strategic Thinking

- **Where does the logic belong?** Keep state in `studio/page.tsx`; children stay controlled.
- **Schema-first?** If data shape changes, schema → sample → forms → templates → print-validator.
- **A4 risk:** will this add height? Plan `.page-break-avoid` wrapping + a print-validator threshold.
- **500-line cap:** if a target file is near the cap, plan the split as part of the work.
- **Rollback:** what's the blast radius; is it reversible?

---

## Phase 5: Plan Generation

Write `.claude/plans/{kebab-case-name}.md`:

```markdown
# Plan: {Feature Name}

## Overview
{1–2 sentences: what this implements and why.}

## Success Criteria
- [ ] {Verifiable criterion}
- [ ] `npm run lint` clean
- [ ] `npm run build` passes (type-check)
- [ ] `/studio` print preview: no A4 overflow across dossier / ats / visual

## Affected Layers
- {schema | sample data | editor | design-panel | copilot | canvas | template-engine | print css} — {what changes}

## Architecture Notes
{Key decisions, schema changes, state/callback wiring, static-export implications.}

## Implementation Tasks
### Task 1: {name}
**File:** `src/{path}`  **Type:** Create | Modify | Delete  **Depends on:** {Task N | none}
**Description:** {what + why}
### Task 2: ...

## Validation Steps
1. `npm run lint`
2. `npm run build`
3. Manual: open `/studio`, exercise the feature, print-preview all 3 templates for A4 bounds.

## Rollback Notes
{How to revert safely.}
```

### Task Ordering
- Schema/type changes first → sample data → forms → templates → validator → canvas/UI.
- Split oversized files before extending them.

### Prohibited (flag if risk seen)
- `any` without justification; ad-hoc hex colors; second source of `CVDocument` state.
- Server-side calls under `output: 'export'`.
- Growing a file past 500 lines.

---

## Output

1. Save the plan to `.claude/plans/{kebab-case-name}.md`.
2. Print it to the conversation.
3. Summarize: task count, affected layers, complexity (low/med/high), risks/open questions,
   and whether a server-model decision is required before `/execute`.
