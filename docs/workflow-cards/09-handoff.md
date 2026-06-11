# FPAT Workflow Card — Handoff (Session Checkpoint)

## Flow

`session pause / stage complete` -> `/fpat-handoff <stage>` -> `determine state (DRY-RUN | APPLYING | BLOCKED)` -> `log Completed [x] items with evidence` -> `capture GitHub surface (repo + project + umbrella + epic + sub-issues)` -> `record Decisions + Files Changed + Validation` -> `define Next Action (exact steps)` -> `list Project mutations pending approval (DO NOT apply yet)` -> `write .claude/handoffs/fpat-<slug>.md` -> `next session reads file + resumes instantly`

---

## Mermaid

```mermaid
flowchart TD
    A["Session pause\nor stage complete"] --> B["/fpat-handoff <stage>"]
    B --> C["Determine state\nDRY-RUN · APPLYING · BLOCKED"]
    C --> D["Log Completed\n[x] items with evidence\neg. PR number · run ID"]
    D --> E["Capture GitHub surface\nrepo · branch · project\numbrella · epic · sub-issues"]
    E --> F["Record\nDecisions · Files Changed\nValidation results"]
    F --> G["Define Next Action\nexact steps for next session"]
    G --> H["List Project mutations\npending approval\nfield IDs + option IDs ready\nDO NOT apply yet"]
    H --> I["Write\n.claude/handoffs/fpat-slug.md"]
    I --> J["Next session\nreads handoff\nresumes instantly"]
    J --> K{"User approves\nmutations?"}
    K -- yes --> L["Apply board writes\nfrom pending list"]
    K -- no --> M["Wait · keep checkpoint\nas source of truth"]
```

---

## Summary

Compresses live session state into a resumable checkpoint file. State is one of three explicit modes: DRY-RUN (planning), APPLYING (executing), or BLOCKED (waiting). All pending GitHub board mutations are pre-computed with exact field and option IDs but held until the user explicitly approves each one. The handoff file is the single source of truth for mid-work sessions.

---

## Ratings

`CHECKPOINT` · `COMPRESS` · `PRESERVE` · `RESUME` · `GUARD` · `DOCUMENT`
