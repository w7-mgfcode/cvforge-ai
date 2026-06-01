---
paths:
  - ".claude/**"
  - ".github/**"
  - "scripts/fpat/**"
---

# FPAT Commit Format

FPAT commits use Conventional Commits with issue linkage so PR merge events can update issue and Project state.

## Format

```text
<type>(<scope>): <description> (#<issue>)
```

Examples:

```text
feat(claude-commands): add fpat-prime command (#12)
ci(github-workflows): validate FPAT issue templates (#18)
docs(claude-docs): document Projects v2 board spec (#21)
```

## Allowed Types

- `feat` - new command, rule, doc, skill, workflow, or board capability.
- `fix` - correction to an existing FPAT artifact.
- `docs` - documentation-only change.
- `chore` - mechanical repo maintenance.
- `refactor` - structure change without behavior change.
- `test` - validation scripts or checks.
- `ci` - GitHub Actions and branch-protection support.

## Allowed Scopes

- `claude-rules`
- `claude-docs`
- `claude-commands`
- `claude-skills`
- `github-workflows`
- `github-projects`
- `scripts`

## Rules

- The issue reference is required for FPAT implementation commits.
- PR titles should follow the same format as the main commit when using squash merge.
- If a commit updates context-engineering assets, include a `Context:` block in the commit body per `.claude/commands/commit.md`.
- Use `Refs #<epic>` in the body when a sub-issue commit also contributes to a parent epic.

