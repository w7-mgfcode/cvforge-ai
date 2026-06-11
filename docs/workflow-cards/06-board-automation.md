# FPAT Workflow Card — Board Automation (Labels → Fields)

## Flow

`issue event (opened / labeled / unlabeled / reopened)` -> `fpat-project-sync.yml` -> `GITHUB_TOKEN reads labels` -> `addProjectV2ItemById (idempotent)` -> `FPAT_PROJECT_TOKEN writes board via fetch GraphQL` -> `resolve field + option by name at runtime` -> `type:* → Type field` / `phase:* → Phase field` / `area:* → Area field` -> `board updated (one-directional, never Status or Score)`

---

## Mermaid

```mermaid
flowchart TD
    A["Issue event\nopened · labeled · unlabeled\nreopened · workflow_dispatch"] --> B["fpat-project-sync.yml"]
    B --> C["GITHUB_TOKEN\nread issue labels\nissues:read"]
    C --> D["addProjectV2ItemById\nidempotent — no duplicates"]
    D --> E["Resolve field + option\nby name at runtime\nno hardcoded IDs"]
    E --> F{"Label prefix?"}
    F -- "type:*" --> G["Set Type field"]
    F -- "phase:*" --> H["Set Phase field"]
    F -- "area:*" --> I["Set Area field"]
    F -- "no match" --> J["Leave field untouched\nnot cleared"]
    G & H & I & J --> K["Board updated\nFPAT_PROJECT_TOKEN writes\none-directional only\nStatus + Score never touched"]
```

---

## Summary

Keeps the Project v2 board field values in sync with issue labels automatically. Dual-token model: GITHUB_TOKEN reads, FPAT_PROJECT_TOKEN writes via a raw fetch GraphQL client. Options are resolved by name at runtime — no hardcoded IDs. Strictly one-directional and idempotent; missing labels leave fields untouched rather than clearing them.

---

## Ratings

`SYNC` · `AUTOMATE` · `MAP` · `ONE-WAY` · `IDEMPOTENT` · `WIRE`
