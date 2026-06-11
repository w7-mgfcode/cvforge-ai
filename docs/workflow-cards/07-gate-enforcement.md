# FPAT Workflow Card — Gate Enforcement (Rollup Gate)

## Flow

`issue close event (type:umbrella OR type:epic)` -> `fpat-rollup-gate.yml` -> `GITHUB_TOKEN issues:write` -> `query native subIssues + subIssuesSummary (paginated)` -> `open children found?` -> `YES: reopen parent + comment blocker list` -> `NO: stay closed` -> `cascade: same gate runs on parent's parent at next close`

---

## Mermaid

```mermaid
flowchart TD
    A["Issue closed event\ntype:umbrella or type:epic"] --> B["fpat-rollup-gate.yml\nGITHUB_TOKEN issues:write\nno FPAT_PROJECT_TOKEN needed"]
    B --> C["Query native subIssues\n+ subIssuesSummary\npaginated"]
    C --> D{"Any open\nchildren?"}
    D -- yes --> E["Reopen parent issue"]
    E --> F["Comment\nopen blockers list"]
    F --> G["Parent stays OPEN\nwaiting for children"]
    G --> H["Child closes later\nevent re-fires"]
    H --> B
    D -- no --> I["Parent stays CLOSED"]
    I --> J["Cascade upward\nsame gate on parent's parent\nat its close event"]
    J --> K["Issue tree fully\nclosed only when\nall descendants closed"]
```

---

## Summary

Prevents premature epic or umbrella closure. Detects open sub-issues by querying the native subIssues GraphQL connection, then reopens the parent and comments the blockers. One level deep per run, but cascades automatically since the same gate fires on every close event up the hierarchy. Uses only the default GITHUB_TOKEN — no PAT required. Touches issue state only, never the board.

---

## Ratings

`DEFEND` · `ENFORCE` · `BLOCK` · `GUARD` · `CASCADE` · `REVERT`
