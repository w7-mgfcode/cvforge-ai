# FPAT Workflow Card — Audit Sweep (Blocked Sweep)

## Flow

`Monday 07:17 UTC / workflow_dispatch (optional project_number)` -> `fpat-blocked-sweep.yml` -> `FPAT_PROJECT_TOKEN reads board items + field values` -> `invariant 1: Parallel started while Foundation epic open?` -> `invariant 2: epic left Backlog with Score < 40?` -> `invariant 3: items labeled blocked or Status = Blocked?` -> `missing/renamed field? → warn` -> `job summary report` -> `STOP — no mutations`

---

## Mermaid

```mermaid
flowchart TD
    A["Monday 07:17 UTC\nor workflow_dispatch\noptional: project_number"] --> B["fpat-blocked-sweep.yml\nFPAT_PROJECT_TOKEN reads board"]
    B --> C["Read all board items\n+ field values\nType · Phase · Status · Score"]
    C --> D["Invariant 1\nParallel item In Progress\nwhile Foundation epic open?"]
    C --> E["Invariant 2\nEpic left Backlog\nwith Score < 40?"]
    C --> F["Invariant 3\nItem labeled blocked\nor Status = Blocked?"]
    D & E & F --> G{"Expected field\nmissing or renamed?"}
    G -- yes --> H["Warn: field not found\ncheck board config"]
    G -- no --> I["Collate findings\nfor all three invariants"]
    H --> I
    I --> J["Write job summary\nread-only report"]
    J --> K["STOP\nno mutations\nno issue edits\nno board writes"]
```

---

## Summary

Weekly invariant audit of the Project v2 board. Surfaces three classes of violations — phase-ordering violations, score gate bypasses, and blocked items — to the job summary. Completely read-only; raises visibility without touching any issue or board state. FPAT_PROJECT_TOKEN is used for reads only.

---

## Ratings

`PATROL` · `AUDIT` · `REPORT` · `READ-ONLY` · `MONITOR` · `ALERT`
