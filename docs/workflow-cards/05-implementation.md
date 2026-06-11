# FPAT Workflow Card — Implementation (Branch → PR → Merge)

## Flow

`approved sub-issue #N` -> `branch type/area-N-slug` -> `implement` -> `npm run lint + npm run build` -> `conventional commit type(scope): desc (#N) + Refs #epic` -> `gh pr create --label --milestone --assignee --reviewer + "Closes #N" in body` -> `PR checks (FPAT Validate + CodeRabbit + Sourcery + Socket + Vercel)` -> `squash merge → main` -> `issue auto-close` -> `fpat-project-sync: board Status → Done`

---

## Mermaid

```mermaid
flowchart TD
    A["Approved sub-issue #N"] --> B["Create branch\ntype/area-N-slug\neg. feat/claude-docs-19-board-spec"]
    B --> C["Implement\nfile changes"]
    C --> D["Validate\nnpm run lint\nnpm run build"]
    D --> E{"Gates\npassing?"}
    E -- no --> C
    E -- yes --> F["Commit\ntype(scope): desc (#N)\nRefs #epic in body if applicable"]
    F --> G["gh pr create\n--label type:* phase:* area:* flow-pack\n--milestone M1|M2|M3\n--assignee · --reviewer\nCloses #N in body"]
    G --> H["PR checks\nFPAT Validate · CodeRabbit\nSourcery · Socket · Vercel"]
    H --> I{"All checks\ngreen?"}
    I -- no --> C
    I -- yes --> J["Squash merge → main"]
    J --> K["Issue auto-close\nvia Closes #N keyword"]
    K --> L["fpat-project-sync.yml fires\nboard: Status → Done"]
```

---

## Summary

The core delivery unit. One branch per sub-issue, validated at lint+build, committed with conventional format, and PR-created with full metadata labels. The `Closes #N` keyword is mandatory — it powers the linked-PR board column and native sub-issue rollup. Squash merge keeps main linear.

---

## Ratings

`BUILD` · `COMMIT` · `VALIDATE` · `DELIVER` · `LINK` · `ENFORCE`
