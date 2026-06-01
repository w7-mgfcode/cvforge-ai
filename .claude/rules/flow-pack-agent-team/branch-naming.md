---
paths:
  - ".claude/**"
  - ".github/**"
  - "scripts/fpat/**"
---

# FPAT Branch Naming

Flow-Pack Agent-Team work uses issue-linked branches so GitHub Issues, PRs, and the CVForge AI Delivery Project can be reconciled without guessing.

## Format

Use:

```text
<type>/<area>-<issue-number>-<slug>
```

Examples:

```text
feat/claude-commands-12-fpat-prime
fix/github-workflows-18-project-sync
docs/claude-docs-21-board-spec
```

## Allowed Values

- `type`: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`.
- `area`: `claude-rules`, `claude-docs`, `claude-commands`, `claude-skills`, `github-workflows`, `github-projects`, `scripts`.
- `issue-number`: the GitHub issue number without `#`.
- `slug`: lowercase kebab-case summary.

## Rules

- Create FPAT implementation work from an approved umbrella, epic, or sub-issue.
- Keep `main` protected conceptually: do not commit directly to `main` for FPAT implementation unless the user explicitly asks.
- Use the issue number that owns the work item being implemented. If working from an epic but the change maps to a sub-issue, prefer the sub-issue number.
- Do not encode project IDs or field IDs in the branch name; those belong in `scripts/fpat/bootstrap-board.sh` output or issue metadata.

