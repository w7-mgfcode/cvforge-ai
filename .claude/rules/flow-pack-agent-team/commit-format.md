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

## Pull Request Metadata & Linkage

A PR is the unit GitHub uses to populate the board's Development links, so create it with the
same metadata as its issue — none of it is inherited automatically:

- **`Closes #<issue>` is required** in the PR body. This is what creates the "Linked pull
  requests" board column entry and advances the native sub-issue rollup. Without it the PR
  implements work that the board cannot see (e.g. PR #14 shipped #13 but omitted the keyword,
  so #13 showed no link).
- Create PRs with metadata pre-filled rather than backfilling later:

  ```text
  gh pr create --assignee w7-mgfcode --reviewer w7-mgfcode \
    --label <type:*,phase:*,area:*,flow-pack> --milestone "<M1|M2|M3>" \
    --title "<conventional title> (#<issue>)" --body "... Closes #<issue>"
  ```

- Reviewers are auto-requested via `.github/CODEOWNERS`; add extra reviewers with `--reviewer`.
- Issues are created with a default assignee via the `.github/ISSUE_TEMPLATE/fpat_*.yml`
  templates; when scripting issue creation, pass `gh issue create --assignee w7-mgfcode`.
- The full board-side rationale lives in `.claude/docs/flow-pack-agent-team/board-spec.md`
  (Item Metadata Conventions).

