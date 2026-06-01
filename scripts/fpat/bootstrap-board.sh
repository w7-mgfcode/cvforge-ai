#!/usr/bin/env bash
set -euo pipefail

OWNER="${OWNER:-w7-mgfcode}"
REPO="${REPO:-cvforge-ai}"
PROJECT_TITLE="${PROJECT_TITLE:-CVForge AI Delivery}"
MODE="${1:-dry-run}"

if [[ "$MODE" != "dry-run" && "$MODE" != "apply" ]]; then
  echo "usage: $0 [dry-run|apply]" >&2
  exit 2
fi

run() {
  printf '+ %s\n' "$*"
  if [[ "$MODE" == "apply" ]]; then
    "$@"
  fi
}

echo "FPAT board bootstrap"
echo "owner=$OWNER repo=$REPO project=$PROJECT_TITLE mode=$MODE"
echo

labels=(
  "type:umbrella"
  "type:epic"
  "type:sub-issue"
  "phase:foundation"
  "phase:parallel"
  "phase:release"
  "area:claude-rules"
  "area:claude-docs"
  "area:claude-commands"
  "area:claude-skills"
  "area:github-workflows"
  "area:github-projects"
  "area:scripts"
  "flow-pack"
  "agent-team"
  "blocked"
)

echo "Create labels"
for label in "${labels[@]}"; do
  run gh label create "$label" --repo "$OWNER/$REPO" --color "2563EB" --description "FPAT taxonomy: $label" --force
done

echo
echo "Create milestones"
create_milestone() {
  local title="$1"
  local description="$2"
  printf '+ ensure milestone "%s"\n' "$title"
  if [[ "$MODE" == "apply" ]]; then
    local existing
    existing="$(gh api "repos/$OWNER/$REPO/milestones?state=all" --jq ".[] | select(.title == \"$title\") | .number" || true)"
    if [[ -n "$existing" ]]; then
      echo "  exists: milestone #$existing"
    else
      gh api "repos/$OWNER/$REPO/milestones" -f title="$title" -f description="$description"
    fi
  fi
}

create_milestone "M1 - Foundation" "FPAT foundation phase"
create_milestone "M2 - Parallel Tracks" "FPAT parallel phase"
create_milestone "M3 - Release Gate" "FPAT release gate phase"

echo
echo "Create Project v2"
printf '+ ensure project "%s"\n' "$PROJECT_TITLE"
if [[ "$MODE" == "apply" ]]; then
  existing_project="$(gh project list --owner "$OWNER" --format json --jq ".projects[] | select(.title == \"$PROJECT_TITLE\") | .number" || true)"
  if [[ -n "$existing_project" ]]; then
    echo "  exists: project #$existing_project"
  else
    gh project create --owner "$OWNER" --title "$PROJECT_TITLE"
  fi
fi

cat <<'NOTE'

Next manual/API steps after project creation:
1. Capture the project number from `gh project list --owner "$OWNER"`.
2. Add custom fields:
   - Status: Backlog, Ready, In Progress, In Review, Blocked, Done
   - Type: Umbrella, Epic, Sub-issue
   - Phase: Foundation, Parallel, Release
   - Area: claude-rules, claude-docs, claude-commands, claude-skills, github-workflows, github-projects, scripts
   - Priority: P0, P1, P2
   - Score: number
   - Estimate: number
3. Enable built-in auto-add for issues labeled flow-pack or agent-team if available in the UI.
4. Configure views from `.claude/docs/flow-pack-agent-team/board-spec.md`.

This script intentionally starts with reproducible labels, milestones, and project creation.
Project field/view mutation is kept explicit because gh Project v2 field APIs require project
node IDs and are easier to review after the project exists.
NOTE
