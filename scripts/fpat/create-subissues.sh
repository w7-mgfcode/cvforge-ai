#!/usr/bin/env bash
#
# Gated creation of FPAT sub-issues from an approved planning package.
#
# Consumes a package markdown file (the output of /fpat-plan-issue), validates it
# with scripts/fpat/validate-package.mjs, then for each H3 subtask block creates a
# GitHub sub-issue under a parent epic with:
#   - body prefixed `Sub-issue of #<epic>` + the subtask's 8 sections,
#   - labels: type:sub-issue, phase:<phase>, area:<area>, flow-pack,
#   - milestone,
#   - default assignee,
#   - native sub-issue linkage to the epic (addSubIssue GraphQL).
#
# DRY-RUN IS THE DEFAULT and performs ZERO mutations: it prints the exact `gh`
# commands it WOULD run. Pass `apply` to actually create + link the sub-issues.
#
# Area per subtask is read from a `**Area:** area:<x>` (or `**Area:** <x>`) line
# inside that subtask block. Phase defaults to `parallel` (override with --phase).
#
# Usage:
#   scripts/fpat/create-subissues.sh --epic <N> --package <file.md> [apply] \
#       [--phase parallel] [--milestone "M2 - Parallel Tracks"] [--count 5]
#
# Env overrides: FPAT_OWNER, FPAT_REPO, FPAT_ASSIGNEE.
set -euo pipefail

EPIC=""
PACKAGE=""
MODE="dry-run"
PHASE="parallel"
MILESTONE="M2 - Parallel Tracks"
COUNT="5"

while [[ $# -gt 0 ]]; do
  case "$1" in
    apply)         MODE="apply"; shift ;;
    dry-run)       MODE="dry-run"; shift ;;
    --epic)        EPIC="$2"; shift 2 ;;
    --package)     PACKAGE="$2"; shift 2 ;;
    --phase)       PHASE="$2"; shift 2 ;;
    --milestone)   MILESTONE="$2"; shift 2 ;;
    --count)       COUNT="$2"; shift 2 ;;
    *) echo "unknown arg: $1" >&2; exit 2 ;;
  esac
done

if [[ -z "$EPIC" || -z "$PACKAGE" ]]; then
  echo "usage: $0 --epic <N> --package <file.md> [apply] [--phase P] [--milestone M] [--count K]" >&2
  exit 2
fi

OWNER="${FPAT_OWNER:-w7-mgfcode}"
REPO="${FPAT_REPO:-cvforge-ai}"
ASSIGNEE="${FPAT_ASSIGNEE:-w7-mgfcode}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "FPAT sub-issue creation"
echo "owner=$OWNER repo=$REPO epic=#$EPIC package=$PACKAGE mode=$MODE"
echo

# 1. Hard gate: the package must be schema-valid before we offer to create anything.
echo "validating package..."
node "$SCRIPT_DIR/validate-package.mjs" "$PACKAGE" --count="$COUNT"
echo

# 2. Extract H3 subtask titles (same convention validate-package.mjs enforces).
mapfile -t TITLES < <(grep -E '^###[[:space:]]+\S' "$PACKAGE" | sed -E 's/^###[[:space:]]+//')

# Per-subtask body + area, sliced with awk on the `### ` boundaries.
get_block() {  # $1 = 1-based subtask index
  # NB: awk regex has no \S — use [^[:space:]].
  awk -v want="$1" '
    /^###[[:space:]]/ { n++; if (n>want) exit; if (n==want) { next } }
    /^##[[:space:]]/ && $0 !~ /^###/ { if (n==want) exit }
    n==want { print }
  ' "$PACKAGE"
}

i=0
for TITLE in "${TITLES[@]}"; do
  i=$((i+1))
  BLOCK="$(get_block "$i")"
  AREA_RAW="$(printf '%s\n' "$BLOCK" | grep -iE '^\s*[-*]?\s*\*\*Area:\*\*' | head -1 | sed -E 's/.*\*\*Area:\*\*\s*//; s/[`.]//g; s/\s.*$//' || true)"
  AREA="$AREA_RAW"
  [[ "$AREA" == area:* ]] || AREA="area:${AREA}"
  BODY="$(printf 'Sub-issue of #%s\n\n%s\n' "$EPIC" "$BLOCK")"
  LABELS="type:sub-issue,phase:${PHASE},${AREA},flow-pack"

  if [[ -z "$AREA_RAW" ]]; then
    echo "WARNING: subtask $i (\"$TITLE\") has no '**Area:**' line — area label will be '$AREA' (likely wrong)." >&2
  fi

  if [[ "$MODE" == "dry-run" ]]; then
    echo "--- subtask $i: $TITLE"
    echo "gh issue create --repo $OWNER/$REPO \\"
    echo "  --title \"$TITLE\" \\"
    echo "  --label \"$LABELS\" \\"
    echo "  --milestone \"$MILESTONE\" \\"
    echo "  --assignee $ASSIGNEE \\"
    echo "  --body <<8-section body, prefixed 'Sub-issue of #$EPIC'>>"
    echo "# then link as native sub-issue:"
    echo "gh api graphql -f query='mutation{addSubIssue(input:{issueId:<#$EPIC node>,subIssueId:<new node>}){subIssue{number}}}'"
    echo
  else
    url="$(gh issue create --repo "$OWNER/$REPO" \
      --title "$TITLE" --label "$LABELS" --milestone "$MILESTONE" \
      --assignee "$ASSIGNEE" --body "$BODY")"
    num="${url##*/}"
    echo "created #$num: $TITLE"
    parent_id="$(gh api graphql -f query="{repository(owner:\"$OWNER\",name:\"$REPO\"){issue(number:$EPIC){id}}}" --jq '.data.repository.issue.id')"
    child_id="$(gh api graphql -f query="{repository(owner:\"$OWNER\",name:\"$REPO\"){issue(number:$num){id}}}" --jq '.data.repository.issue.id')"
    gh api graphql -f query='mutation($p:ID!,$c:ID!){addSubIssue(input:{issueId:$p,subIssueId:$c}){subIssue{number}}}' \
      -f p="$parent_id" -f c="$child_id" --jq '.data.addSubIssue.subIssue.number' >/dev/null
    echo "  linked #$num -> #$EPIC"
  fi
done

if [[ "$MODE" == "dry-run" ]]; then
  echo "DRY-RUN complete — no GitHub writes were made. Re-run with 'apply' to create them."
fi
