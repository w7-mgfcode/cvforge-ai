#!/usr/bin/env bash
#
# Backfill delivery metadata on existing FPAT issues.
# Today: assign a default owner to any OPEN issue that has no assignee.
# Dry-run is the DEFAULT and performs ZERO mutations (existence-aware: only
# issues that are actually unassigned are reported / changed).
#
# Usage: scripts/fpat/backfill-meta.sh [dry-run|apply]
# Env:   FPAT_OWNER, FPAT_REPO, FPAT_ASSIGNEE override the defaults below.
set -euo pipefail

MODE="${1:-dry-run}"
if [[ "$MODE" != "dry-run" && "$MODE" != "apply" ]]; then
  echo "usage: $0 [dry-run|apply]" >&2
  exit 2
fi

OWNER="${FPAT_OWNER:-w7-mgfcode}"
REPO="${FPAT_REPO:-cvforge-ai}"
ASSIGNEE="${FPAT_ASSIGNEE:-w7-mgfcode}"

echo "FPAT metadata backfill"
echo "owner=$OWNER repo=$REPO assignee=$ASSIGNEE mode=$MODE"
echo

# Read-only snapshot of OPEN issues lacking an assignee. On query failure we
# degrade to "nothing to do" rather than failing closed (matches bootstrap-board.sh).
query_ok=1
unassigned="$(gh issue list --repo "$OWNER/$REPO" --state open --limit 200 \
  --json number,assignees,title \
  --jq '.[] | select((.assignees | length) == 0) | "\(.number)\t\(.title)"' 2>/dev/null \
  || { query_ok=0; true; })"

if [[ "$query_ok" -eq 0 ]]; then
  echo "NOTE: could not query issues (auth/network?); nothing backfilled."
  exit 0
fi

echo "Assignees"
count=0
if [[ -z "$unassigned" ]]; then
  echo "  all open issues already have an assignee"
else
  while IFS=$'\t' read -r num title; do
    [[ -z "$num" ]] && continue
    count=$((count + 1))
    if [[ "$MODE" == "apply" ]]; then
      gh issue edit "$num" --repo "$OWNER/$REPO" --add-assignee "$ASSIGNEE" >/dev/null
      printf '  assigned:      #%s -> @%s  (%s)\n' "$num" "$ASSIGNEE" "$title"
    else
      printf '  would assign:  #%s -> @%s  (%s)\n' "$num" "$ASSIGNEE" "$title"
    fi
  done <<< "$unassigned"
fi
printf '  -> %d open issue(s) %s\n' "$count" "$([[ "$MODE" == apply ]] && echo assigned || echo "to assign")"

echo
if [[ "$MODE" == "dry-run" ]]; then
  echo "dry-run: report only — zero mutations performed."
  echo "Re-run with 'apply' to set assignees."
fi
