# FPAT Workflow Card — Execution Pipeline (Issue → 5 Subtasks)

## Flow

`issue ref` -> `resolve owner/repo#N` -> `load issue graph (title + body + labels + state + parent + sub-issues + PRs + comments)` -> `frame brief + source of truth + role scope + risks + blockers` -> `score directions (7D: Value + Risk + Readiness + Dep-load + Validation-ease + Rollback-safety + Evidence)` -> `critic pass (scope creep + weak evidence + blockers + over-engineering)` -> `exactly 5 subtasks (Title + Purpose + Scope + AC)` -> `present package` -> `STOP — await "approve"`

---

## Mermaid

```mermaid
flowchart TD
    A["Issue ref\n#N or full URL"] --> B["Resolve owner/repo#N"]
    B --> C["Load issue graph\ntitle · body · labels · state\nparent · sub-issues · PRs · comments"]
    C --> D["Frame\nBrief · Source of truth\nScope · Risks · Blockers"]
    D --> E["Score directions\n7D: Value · Risk · Readiness\nDep-load · Validation-ease\nRollback-safety · Evidence"]
    E --> F["Critic pass\nscope creep · weak evidence\nblockers · over-engineering"]
    F --> G["Decompose\nexactly 5 subtasks\nTitle · Purpose · Scope\nOut-of-scope · Deps · AC"]
    G --> H["Present package\nREAD-ONLY until approved"]
    H --> I{"User says\napprove?"}
    I -- yes --> J["Write GitHub state\ncreate sub-issues"]
    I -- no --> H
```

---

## Summary

Converts one approved epic into exactly five executable sub-issues. Loads the full issue graph, scores multiple candidate directions on seven dimensions, runs a critic pass for over-scoping, then halts for user approval before any GitHub write. The 5-subtask count is a hard default unless explicitly justified.

---

## Ratings

`PLAN` · `DECOMPOSE` · `CRITIQUE` · `SCORE` · `GUARD` · `EXECUTE`
