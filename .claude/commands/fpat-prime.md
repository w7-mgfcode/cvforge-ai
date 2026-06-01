---
description: Prime Flow-Pack Agent-Team repo, issue, workflow, and Project state
argument-hint: "[owner/repo]"
---

# FPAT Prime

## Objective

Capture a fresh, cited baseline for Flow-Pack Agent-Team work before planning or mutating GitHub state.

## Process

Use `$ARGUMENTS` as `owner/repo`; default to `w7-mgfcode/cvforge-ai`.

1. Read:
   - `AGENTS.md`
   - `CLAUDE.md`
   - `.claude/rules/README.md`
   - `.claude/docs/flow-pack-agent-team/board-spec.md`
   - `.github/workflows/*.yml`
2. Run read-only GitHub commands:
   - `gh repo view <owner/repo> --json name,owner,visibility,defaultBranchRef,description,url,isArchived,createdAt,pushedAt`
   - `gh issue list --repo <owner/repo> --limit 50 --state all`
   - `gh project list --owner <owner> --limit 20 --format json`
   - `gh workflow list --repo <owner/repo>`
3. Report:
   - repo state
   - issue state
   - Project v2 state
   - workflow state
   - dirty working tree
   - missing or broken FPAT assets

## Output

Keep the output under 300 words and include file paths or `gh` command output for every claim. Do not create or edit anything.

