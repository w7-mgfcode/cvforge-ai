---
description: Plan an approved initiative into an FPAT umbrella + 5-epic creation package
argument-hint: "<initiative-goal>"
---

# FPAT Plan Umbrella

## Objective

Turn `$ARGUMENTS` (an approved large initiative, typically a `/fpat-continuation` outcome) into
a read-only, review-ready **umbrella + epic creation package**: exactly 1 umbrella issue
proposal and exactly 5 epic issue proposals. The command is read-only until the user approves
GitHub writes.

Example:

```text
/fpat-plan-umbrella "Umbrella 2 — FPAT Workflow Automation Evaluation & Effectiveness Measurement System"
```

## Where this command sits

```text
/fpat-prime
→ /fpat-continuation "<large initiative>"      (scored ship / negotiation / defer lists)
→ /fpat-plan-umbrella "<approved initiative>"  (THIS COMMAND — umbrella + 5-epic package)
→ user approval ("approve umbrella planning package")
→ create 1 umbrella + 5 epic issues, per the package's creation order
→ /fpat-plan-issue <epic-number>               (one epic → exactly 5 sub-issues)
→ user approval ("approve")
→ create that epic's 5 sub-issues
```

This command fills the previously missing layer between `/fpat-continuation`
(initiative-level scoring) and `/fpat-plan-issue` (issue-level decomposition). It plans the
**top level only**:

- It does **not** create issues.
- It does **not** create or plan sub-issues — never the full `1 + 5 + 25` tree at once.
- It does **not** replace `/fpat-plan-issue`; after the umbrella and epics exist, each epic is
  decomposed separately with `/fpat-plan-issue <epic-number>`, each behind its own approval.

## Canonical contract (locked)

These counts are the single source of truth — do not let later wording drift from them.

- **Process: exactly 11 steps** (below).
- **Package framing: exactly 5 sections** — Brief, Source of truth, Initiative context,
  Risks/blockers/dependencies, Role-relevant scope (mirrors `/fpat-plan-issue` and
  `.claude/docs/flow-pack-agent-team/execution-pipeline.md`).
- **Output: exactly 1 umbrella proposal + exactly 5 epic proposals** — 1 Foundation, 3
  Parallel, 1 Release. `.claude/docs/flow-pack-agent-team/decomposition.md` allows N Parallel
  epics; 3 is the umbrella-1 precedent and this command's default — any other Parallel count
  must be explicitly justified.
- **Umbrella body: the 7-section umbrella contract** — Summary, Approach, Decomposition, Out of
  scope, Success criteria, Risks, Tracking
  (`.claude/docs/flow-pack-agent-team/decomposition.md`).
- **Epic proposal: exactly 12 fields each** — Title, Purpose, Body outline, Labels, Milestone,
  Assignee, Parent relationship, Board field recommendations, Acceptance criteria,
  Dependencies, Out of scope, Validation path.
- **Scoring: the 5-dimension continuation rubric** (Value, Risk, Readiness, Complexity,
  Evidence) for comparing candidate epic structures. Reuse the `flow-pack-agent-team-scoring`
  skill for the rubric; the board's `Score` field stores this 5-dimension total (ship gate
  `>= 40`).
- **Critic: exactly one pass, five named failure modes** — scope creep, weak evidence,
  blockers, phase mistakes, over-engineering.

## Process

1. Resolve the initiative goal from `$ARGUMENTS`. If empty or ambiguous, stop and ask.
2. Capture baseline reality (cite every claim by path or read-only `gh` output):
   - repo state (`gh repo view`)
   - issue state (`gh issue list --repo <owner/repo> --limit 50 --state all`)
   - Project v2 board state (`.claude/docs/flow-pack-agent-team/board-spec.md` + read-only
     `gh project` commands)
   - relevant FPAT docs (`decomposition.md`, `continuation-discipline.md`, `board-spec.md`)
   - latest handoff (`HANDOFF.md`, `.claude/handoffs/`) and baseline manifest
     (`docs/reports/<date>/baseline-manifest.json`) if present
3. Confirm whether an umbrella already exists for this initiative
   (`gh issue list --label type:umbrella --state all`). If one matches, stop and report it
   instead of proposing a duplicate.
4. Write the 5-section package framing:
   - Brief
   - Source of truth
   - Initiative context
   - Risks, blockers, dependencies
   - Role-relevant scope
5. Score 2–3 candidate top-level epic structures on the 5-dimension continuation rubric via the
   `flow-pack-agent-team-scoring` skill; pick the winner and say why.
6. Run exactly one critic pass over the winning draft:
   - scope creep
   - weak evidence
   - blockers
   - phase mistakes (work in the wrong phase, Release work that should be Parallel, etc.)
   - over-engineering
7. Produce exactly 5 epic proposals: 1 Foundation (blocking), 3 Parallel (start only after
   Foundation closes), 1 Release (closes only after all Parallel epics close).
8. For the umbrella, write the 7-section umbrella contract body; for each epic, fill all 12
   fields. Defaults (override only with stated reason):
   - Labels: umbrella `type:umbrella, flow-pack, agent-team`; epics
     `type:epic, phase:<foundation|parallel|release>, area:<area>, flow-pack`.
   - Milestones: Foundation → `M1 - Foundation`; Parallel → `M2 - Parallel Tracks`;
     Release → `M3 - Release Gate`.
   - Assignee: `w7-mgfcode` (mirrors `.github/ISSUE_TEMPLATE/fpat_*.yml`).
   - Parent relationship: each epic is a native sub-issue of the umbrella.
   - Board fields: membership and Type/Phase/Area come from labels (native auto-add +
     `fpat-project-sync.yml`) — recommend, never write. Status and Score are deliberate manual
     fields: recommend a Status and the epic's 5-dimension Score total, never write them.
   - Every proposed body includes `## Acceptance criteria` (Ready gate,
     `.claude/docs/flow-pack-agent-team/board-spec.md`).
9. State the exact creation order for the approved write step:
   1. create the umbrella issue
   2. create the Foundation epic
   3. create the 3 Parallel epics
   4. create the Release epic
   5. link each epic as a native sub-issue of the umbrella
   6. verify board auto-add picked every item up (read-only check)
   7. **stop — do not create any sub-issues**
10. State the follow-on commands:
    - `/fpat-plan-issue <Foundation epic number>` — first.
    - after the Foundation epic closes: `/fpat-plan-issue <Parallel epic number>`, one at a
      time.
    - after all Parallel epics close: `/fpat-plan-issue <Release epic number>`.
11. Present the package and stop. No GitHub writes.

## Guardrails

- **No GitHub writes.** Do not create, edit, label, close, or comment on issues/PRs, and do not
  touch the Project board (no Status/Score writes). Even after approval, the write step creates
  the umbrella + epics only — sub-issues always go through `/fpat-plan-issue`.
- **No file writes.** This command produces chat output only, unless the user explicitly asks
  to persist the package (e.g. to `.claude/plans/`).
- Cite every repo claim by path or read-only `gh` output.

## Required closing line

End with:

```text
Ready for your review. I will not create umbrella or epic issues until you say "approve umbrella planning package".
```
