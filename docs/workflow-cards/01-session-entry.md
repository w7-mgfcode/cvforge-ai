# FPAT Workflow Card — Session Entry (Prime)

## Flow

`/fpat-prime` -> `read AGENTS.md + CLAUDE.md + board-spec.md + rules/README.md` -> `gh repo view` -> `gh issue list --state all` -> `gh project list` -> `gh workflow list` -> `detect missing assets` -> `baseline report < 300 words`

---

## Mermaid

```mermaid
flowchart TD
    A["/fpat-prime"] --> B["Read local files\nAGENTS.md · CLAUDE.md\nboard-spec.md · rules/README.md"]
    B --> C["gh repo view\nname · visibility · branch · pushedAt"]
    C --> D["gh issue list\nstate:all · limit:50"]
    D --> E["gh project list\nowner · format json"]
    E --> F["gh workflow list"]
    F --> G{"Missing or broken\nFPAT assets?"}
    G -- yes --> H["Flag gaps in report"]
    G -- no --> I["Baseline report\ncited · read-only · done"]
    H --> I
```

---

## Summary

Read-only baseline capture. Loads local context first, then surveys live GitHub state across repo, issues, board, and workflows. Any broken or missing FPAT asset is flagged before any mutation is allowed. Entry gate for every FPAT session.

---

## Ratings

`SCOUT` · `READ-ONLY` · `BASELINE` · `VERIFY` · `SNAPSHOT` · `GUARD`
