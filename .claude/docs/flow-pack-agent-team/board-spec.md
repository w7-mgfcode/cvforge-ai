# FPAT Board Spec: CVForge AI Delivery

## Purpose

The FPAT delivery board (GitHub Projects v2 — live GitHub title **CVForge AI — WorkflowCV Studio Roadmap**) is the source of truth for Flow-Pack Agent-Team adoption work. It tracks one dogfood umbrella, its epics, and the executable sub-issues that create `.claude/` and `.github/` artifacts.

## Board

- **Live title (GitHub):** `CVForge AI — WorkflowCV Studio Roadmap` — the board's actual display name.
- **FPAT identifier:** `CVForge AI Delivery` — the title `scripts/fpat/bootstrap-board.sh`
  (`PROJECT_TITLE`) creates, the PR-template checklist references, and `scripts/fpat/validate-issues.mjs`
  asserts. The GitHub display title was set to the portfolio-facing name after creation; FPAT tooling
  still addresses the board by this identifier and by its stable number / node ID below. We document the
  live title here rather than rename the public board.
- Number: `2` · Node ID: `PVT_kwHOCghNdc4BZZCU` · URL: https://github.com/users/w7-mgfcode/projects/2
- Owner: `w7-mgfcode` (user-owned Projects v2)
- Repository: `w7-mgfcode/cvforge-ai`
- **Visibility: public** — deliberately, to match the public repository and act as a recruiter-facing
  portfolio artifact. This records the S1 (#15) resolution, where the board was flipped from private to
  public.
- Scope: FPAT adoption and workflow orchestration. Product work belongs here only when explicitly
  labeled `flow-pack` or `agent-team`.

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

The board ships these five views. Use this as a checklist when (re)creating the board:

- [ ] **Delivery Board** — grouped by `Status`.
- [ ] **Roadmap by Phase** — grouped by `Phase`.
- [ ] **Epics & Rollup** — filtered to `Type = Epic`, with `Score` and `Sub-issues progress` visible.
- [ ] **By Area** — grouped by `Area`.
- [ ] **Umbrella Rollup** — grouped by parent issue where available.

**Verification recipe.** Views themselves are not exposed by the GitHub CLI, so confirm their
existence/layout in the UI (`https://github.com/users/w7-mgfcode/projects/2`). Verify the data each
view groups/filters by with read-only CLI checks:

```bash
# 1. The fields the views group/filter by must exist (Status, Type, Phase, Area, Score):
gh project field-list 2 --owner w7-mgfcode --format json | jq -r '.fields[].name'

# 2. Items carry Type/Phase/Area/Status so each grouping is non-empty:
gh project item-list 2 --owner w7-mgfcode --format json \
  | jq -r '.items[] | "\(.content.number)\t\(.type)\t\(.phase)\t\(.area)\t\(.status)"'
```

A grouped/filtered view is valid when its grouping field exists (check 1) and items carry that field
(check 2). `fpat-project-sync.yml` keeps Type/Phase/Area populated from labels (see **Automation &
secrets**), so the grouped views stay non-empty automatically.

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
  (filter `is:issue,pr label:flow-pack`; see **Automation & secrets**), not from a template
  `projects:` key (unreliable for Projects v2).

## Sync Direction

Version 1 is one-directional: issue and PR state drive Project state. Moving a Project item to `Done` must not auto-close its issue until the first umbrella has completed and the automation has been reviewed.

## Gates

- Ready gate: issue body contains `## Acceptance criteria`.
- Foundation gate: `Phase = Parallel` work must not start while the Foundation epic is open.
- Release gate: Release epic must not close while any Parallel epic is open.
- Umbrella gate: umbrella must not close while any descendant issue remains open.

The umbrella/epic close gate is enforced by `.github/workflows/fpat-rollup-gate.yml`: closing a
`type:umbrella`/`type:epic` issue while any of its **direct** sub-issues is still open reopens the
parent and comments the open blockers (detect-and-reopen — GitHub cannot block the close itself).
The check is one level deep, but because the same gate runs on every close it cascades: an epic
cannot stay closed with an open sub-issue, so an umbrella whose epics all read closed already has a
fully closed tree. It pages through the native `subIssues` connection (cross-checked against
`subIssuesSummary`) with the default `GITHUB_TOKEN` (`issues: write`), independent of the Projects
v2 PAT, and is one-directional: it touches issue state only, never the board.

## Automation & secrets

Three GitHub Actions workflows operate the board. All are **one-directional** (issue/PR state →
board, never board → issue) per **Sync Direction** above, and pin marketplace actions to a commit SHA.

### Auto-add (native Projects v2 workflow)

Built-in project auto-add uses the filter `is:issue,pr label:flow-pack`: any issue or PR labeled
`flow-pack` is added to the board automatically. `agent-team` items also carry `flow-pack`, so they are
covered too. `fpat-project-sync.yml` additionally calls `addProjectV2ItemById` (idempotent — returns
the existing item), so an item is never duplicated even if both paths add it.

### `FPAT_PROJECT_TOKEN` (repository secret)

A PAT with Projects v2 read+write scope, provisioned in **S1 (#15)**. It exists because the default
`GITHUB_TOKEN` cannot read or write **user-owned** Projects v2 data.

| Workflow | `FPAT_PROJECT_TOKEN`? | Why |
| --- | --- | --- |
| `fpat-project-sync.yml`  | yes — writes | set Type/Phase/Area field values |
| `fpat-blocked-sweep.yml` | yes — reads  | read board items + field values |
| `fpat-rollup-gate.yml`   | no           | default `GITHUB_TOKEN` (`issues: write`); issue hierarchy only |

Both project workflows resolve the board owner-agnostically via
`repositoryOwner(login:) { ... on ProjectV2Owner { projectV2(number:) } }` (works for user- and
org-owned boards).

### `fpat-project-sync.yml` — labels → fields (S2 / #16)

- **Triggers:** `issues` (`opened`, `labeled`, `unlabeled`, `reopened`) + `workflow_dispatch` (with an
  `issue_number` input for manual re-sync / branch testing).
- **Behavior:** maps `type:*` → **Type**, `phase:*` → **Phase**, `area:*` → **Area** via
  `updateProjectV2ItemFieldValue`. Field and option IDs are resolved at runtime **by name** (no
  hardcoded option IDs); the documented label-suffix → option-name map lives in the workflow.
- **Dual-token:** default `GITHUB_TOKEN` reads the issue's labels (`issues: read`);
  `FPAT_PROJECT_TOKEN` writes the board (via a direct `fetch` GraphQL client, since github-script
  cannot load a second Octokit).
- **Idempotent:** re-setting a single-select to its current value is a no-op; a missing label leaves
  that field untouched (it does not clear).
- **Out of scope (deliberately):** does not touch **Status** or **Score**, and never closes/edits issues.

### `fpat-blocked-sweep.yml` — read-only invariant audit (S3 / #18)

- **Triggers:** `schedule` (Mondays 07:17 UTC) + `workflow_dispatch` (optional `project_number`).
- **Behavior (strictly read-only):** reports three invariants to the job summary:
  1. Parallel-phase items started while a Foundation epic is still open.
  2. Epics that left Backlog with `Score < 40` (the ship gate).
  3. Items labeled `blocked` or in `Status = Blocked`.
- Warns if an expected field (Type/Phase/Status/Score) is missing/renamed. Performs no mutations.

### `fpat-rollup-gate.yml` — epic/umbrella close gate (S4 / #17)

Mechanics of the umbrella/epic close gate described under **Gates** above. It pages the native
`subIssues` connection, cross-checked against `subIssuesSummary`, with the default `GITHUB_TOKEN`
(`issues: write`) — independent of `FPAT_PROJECT_TOKEN`. It touches issue state only, never the board;
one level deep, but cascades because the same gate runs on every close.

