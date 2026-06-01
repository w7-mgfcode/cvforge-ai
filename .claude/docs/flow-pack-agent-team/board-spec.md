# FPAT Board Spec: CVForge AI Delivery

## Purpose

The CVForge AI Delivery GitHub Projects v2 board is the source of truth for Flow-Pack Agent-Team adoption work. It tracks one dogfood umbrella, its epics, and the executable sub-issues that create `.claude/` and `.github/` artifacts.

## Board

- Name: `CVForge AI Delivery`
- Owner: `w7-mgfcode`
- Repository: `w7-mgfcode/cvforge-ai`
- Visibility: public, matching the repository.
- Scope: FPAT adoption and workflow orchestration. Product work belongs here only when explicitly labeled `flow-pack` or `agent-team`.

## Fields

| Field | Type | Values |
| --- | --- | --- |
| Status | single-select | Backlog, Ready, In Progress, In Review, Blocked, Done |
| Type | single-select | Umbrella, Epic, Sub-issue |
| Phase | single-select | Foundation, Parallel, Release |
| Area | single-select | claude-rules, claude-docs, claude-commands, claude-skills, github-workflows, github-projects, scripts |
| Priority | single-select | P0, P1, P2 |
| Score | number | 5-dimension epic score, ship gate `>= 40` |
| Estimate | number | rough size, normally 1, 2, 3, 5, or 8 |

Native fields `Parent issue` and `Sub-issues progress` should be visible where GitHub exposes them.

## Views

- Delivery Board: grouped by `Status`.
- Roadmap by Phase: grouped by `Phase`.
- Epics & Rollup: filtered to `Type = Epic`, with Score and Sub-issues progress visible.
- By Area: grouped by `Area`.
- Umbrella Rollup: grouped by parent issue where available.

## Labels

Create these beside GitHub defaults:

```text
type:umbrella
type:epic
type:sub-issue
phase:foundation
phase:parallel
phase:release
area:claude-rules
area:claude-docs
area:claude-commands
area:claude-skills
area:github-workflows
area:github-projects
area:scripts
flow-pack
agent-team
blocked
```

Use `blocked-by:<issue-number>` labels only when the dependency cannot be represented by issue hierarchy or body metadata.

## Milestones

- `M1 - Foundation`
- `M2 - Parallel Tracks`
- `M3 - Release Gate`

## Item Metadata Conventions

The board renders several native columns that are **not** custom fields — they mirror the
underlying issue/PR. Keep them populated at creation time:

- **Assignees** — the board's Assignees column mirrors the issue's assignees; it is not set
  independently. Every FPAT issue gets a default assignee from the issue templates
  (`assignees:` in `.github/ISSUE_TEMPLATE/fpat_*.yml`, default `@w7-mgfcode`). Backfill
  existing unassigned issues with `scripts/fpat/backfill-meta.sh`.
- **Linked pull requests** — populated from GitHub "Development" links, primarily PR closing
  keywords. A PR **must** carry `Closes #<issue>` (see `commit-format.md`) or the column and
  the native sub-issue rollup stay empty. Issues closed administratively (no PR) are
  legitimately blank.
- **Reviewers** — requested automatically via `.github/CODEOWNERS`. The Sourcery app review is
  separate from (and does not replace) a requested human reviewer.
- **Labels / Milestone / Project on PRs** — `gh pr create` does not inherit these from the
  linked issue; pass them explicitly (`--label`, `--milestone`, `--assignee`, `--reviewer`)
  or rely on the PR template checklist. Board membership for issues comes from native auto-add
  on `flow-pack`/`agent-team`, not from a template `projects:` key (unreliable for Projects v2).

## Sync Direction

Version 1 is one-directional: issue and PR state drive Project state. Moving a Project item to `Done` must not auto-close its issue until the first umbrella has completed and the automation has been reviewed.

## Gates

- Ready gate: issue body contains `## Acceptance criteria`.
- Foundation gate: `Phase = Parallel` work must not start while the Foundation epic is open.
- Release gate: Release epic must not close while any Parallel epic is open.
- Umbrella gate: umbrella must not close while any descendant issue remains open.

