<!--
FPAT pull request. Keep the title in conventional-commit form with the issue ref,
e.g. `feat(github-workflows): wire fpat-project-sync.yml (#16)`.
See .claude/rules/flow-pack-agent-team/commit-format.md.
-->

## What this changes

<!-- One paragraph: what and why. -->

## Linked issue (required)

Closes #<!-- issue number -->

<!-- Use `Closes #N` / `Fixes #N` so GitHub creates the Development link that
     populates the board's "Linked pull requests" column and the sub-issue rollup.
     Use `Refs #N` in addition when this PR also contributes to a parent epic. -->

## Delivery metadata checklist

- [ ] **Labels** mirror the linked issue (`type:*`, `phase:*`, `area:*`, `flow-pack`).
- [ ] **Milestone** matches the linked issue (`M1`/`M2`/`M3`).
- [ ] **Project** = `CVForge AI Delivery` (auto-added for `flow-pack`/`agent-team`; add manually if missing).
- [ ] **Assignee** set (default `@w7-mgfcode`).
- [ ] **Reviewer** requested (CODEOWNERS requests one automatically; add others as needed).

> Create PRs with the metadata pre-filled:
> `gh pr create --assignee w7-mgfcode --reviewer w7-mgfcode --label <labels> --milestone "<milestone>" --body "... Closes #N"`

## Validation

- [ ] `npm run lint` (if TS/TSX/Tailwind/config changed)
- [ ] `npm run build` (if routing/imports/schema/rendering/config changed)
- [ ] Manual `/studio` print-preview across all 3 templates (if UI/template/print changed)
- [ ] FPAT script dry-run is green / zero unintended mutations (if `scripts/fpat/*` changed)

State any gate you could not run and why.
