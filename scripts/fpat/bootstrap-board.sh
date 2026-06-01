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

echo "FPAT board bootstrap"
echo "owner=$OWNER repo=$REPO project=$PROJECT_TITLE mode=$MODE"
echo

# ---------------------------------------------------------------------------
# Read-only existence snapshots.
# These are pure reads (safe in BOTH dry-run and apply) and make dry-run
# existence-aware. On any query failure we degrade to empty + an UNKNOWN note
# rather than aborting, so a dry-run never fails closed.
# ---------------------------------------------------------------------------
query_ok=1
existing_labels="$(gh label list --repo "$OWNER/$REPO" --limit 200 --json name --jq '.[].name' 2>/dev/null || { query_ok=0; true; })"
existing_milestones="$(gh api "repos/$OWNER/$REPO/milestones?state=all" --jq '.[] | "\(.number)\t\(.title)"' 2>/dev/null || { query_ok=0; true; })"
existing_project_num="$(gh project list --owner "$OWNER" --format json --jq ".projects[] | select(.title == \"$PROJECT_TITLE\") | .number" 2>/dev/null | head -1 || { query_ok=0; true; })"

if [[ "$query_ok" -eq 0 ]]; then
  echo "NOTE: one or more existence queries failed (auth/network?); items below may show UNKNOWN."
  echo
fi

milestone_number() { # title -> number ("" if absent)
  awk -F'\t' -v t="$1" '$2 == t { print $1; exit }' <<<"$existing_milestones"
}

labels=(
  "type:umbrella" "type:epic" "type:sub-issue"
  "phase:foundation" "phase:parallel" "phase:release"
  "area:claude-rules" "area:claude-docs" "area:claude-commands"
  "area:claude-skills" "area:github-workflows" "area:github-projects"
  "area:scripts" "flow-pack" "agent-team" "blocked"
)

echo "Labels"
lbl_exist=0
lbl_create=0
for label in "${labels[@]}"; do
  if grep -qxF "$label" <<<"$existing_labels"; then
    printf '  exists:        %s\n' "$label"
    lbl_exist=$((lbl_exist + 1))
  else
    printf '  would create:  %s\n' "$label"
    lbl_create=$((lbl_create + 1))
  fi
  # apply: create-or-update is idempotent thanks to --force
  if [[ "$MODE" == "apply" ]]; then
    gh label create "$label" --repo "$OWNER/$REPO" --color "2563EB" \
      --description "FPAT taxonomy: $label" --force >/dev/null
  fi
done
printf '  -> labels: %d exist / %d to create\n' "$lbl_exist" "$lbl_create"

echo
echo "Milestones"
ms_titles=("M1 - Foundation" "M2 - Parallel Tracks" "M3 - Release Gate")
ms_descs=("FPAT foundation phase" "FPAT parallel phase" "FPAT release gate phase")
ms_exist=0
ms_create=0
for i in "${!ms_titles[@]}"; do
  title="${ms_titles[$i]}"
  num="$(milestone_number "$title")"
  if [[ -n "$num" ]]; then
    printf '  exists:        %s (#%s)\n' "$title" "$num"
    ms_exist=$((ms_exist + 1))
  else
    printf '  would create:  %s\n' "$title"
    ms_create=$((ms_create + 1))
    if [[ "$MODE" == "apply" ]]; then
      gh api "repos/$OWNER/$REPO/milestones" -f title="$title" -f description="${ms_descs[$i]}" >/dev/null
    fi
  fi
done
printf '  -> milestones: %d exist / %d to create\n' "$ms_exist" "$ms_create"

echo
echo "Project v2"
if [[ -n "$existing_project_num" ]]; then
  printf '  exists:        %s (#%s)\n' "$PROJECT_TITLE" "$existing_project_num"
else
  printf '  would create:  %s\n' "$PROJECT_TITLE"
  if [[ "$MODE" == "apply" ]]; then
    gh project create --owner "$OWNER" --title "$PROJECT_TITLE"
  fi
fi

echo
if [[ "$MODE" == "dry-run" ]]; then
  echo "dry-run: existence-aware plan only — zero mutations performed."
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
Dry-run is existence-aware (reports exists vs would-create) and performs zero mutations.
Apply mode is idempotent: labels use --force; milestones and the project are created only
when absent.
NOTE
