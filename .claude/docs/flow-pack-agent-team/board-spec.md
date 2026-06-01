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

## Sync Direction

Version 1 is one-directional: issue and PR state drive Project state. Moving a Project item to `Done` must not auto-close its issue until the first umbrella has completed and the automation has been reviewed.

## Gates

- Ready gate: issue body contains `## Acceptance criteria`.
- Foundation gate: `Phase = Parallel` work must not start while the Foundation epic is open.
- Release gate: Release epic must not close while any Parallel epic is open.
- Umbrella gate: umbrella must not close while any descendant issue remains open.

