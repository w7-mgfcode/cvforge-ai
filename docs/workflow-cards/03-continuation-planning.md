# FPAT Workflow Card — Continuation Planning (V1 → V2)

## Flow

`goal` -> `baseline capture (repo + docs + rules + issues + state)` -> `freeze timestamp` -> `draft V1 (5-10 unscored candidates)` -> `critique (weak assumptions + scope creep + missing evidence)` -> `3 research passes (Known Issues + Best Practices + Dependencies)` -> `5D score (Value + Risk + Readiness + Complexity + Evidence)` -> `bands: >=40 SHIP / 36-39 NEGOTIATE / <36 DEFER` -> `V2 ship list + negotiate list + defer list`

---

## Mermaid

```mermaid
flowchart TD
    A["Goal / ARGUMENTS"] --> B["Capture baseline\nrepo · docs · rules · issues · state"]
    B --> C["Freeze baseline timestamp"]
    C --> D["Draft V1\n5–10 unscored candidates"]
    D --> E["Critique V1\nweak assumptions\nscope creep · missing evidence"]
    E --> F["3 Read-only Research Passes"]
    F --> F1["Known Issues"]
    F --> F2["Best Practices"]
    F --> F3["Dependencies"]
    F1 & F2 & F3 --> G["Score every candidate\n5D: Value · Risk · Readiness\nComplexity · Evidence  (each 1–10)"]
    G --> H{"Score band?"}
    H -- ">= 40" --> I["V2 SHIP list"]
    H -- "36–39" --> J["NEGOTIATE with user"]
    H -- "< 36" --> K["DEFER list"]
    I & J & K --> L["Output V2 plan\nNO GitHub writes\nuntil user approves"]
```

---

## Summary

Turns a vague continuation goal into a scored, research-validated V2 ship list. Three independent research passes attack the naive V1 plan before any score is committed. Score bands create an explicit three-way split: ship, negotiate, or defer. Nothing is written to GitHub until the user approves.

---

## Ratings

`PLAN` · `SCORE` · `RESEARCH` · `NEGOTIATE` · `FILTER` · `VALIDATE`
