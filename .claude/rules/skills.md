---
paths:
  - ".claude/skills/**"
  - ".agents/skills/**"
  - "skills-lock.json"
---

# Agent Skills Management

This repo uses the open agent-skills ecosystem via the `skills` CLI (`npx skills`, from
`vercel-labs/skills`). Full reference: `.claude/docs/skills-cli-guide.md`.

## Layout

- Installed skills live in `.claude/skills/<name>/` (Claude Code, project scope). In this
  environment they are **copies**, not symlinks (symlink fallback). `.agents/` separately holds
  MCP config + plugins — don't conflate the two.
- `skills-lock.json` (repo root) is the reproducibility manifest: `name → { source, sourceType,
  skillPath, computedHash }`. **It is the source of truth — always commit it.**
- Each skill is a managed bundle (`SKILL.md` + optional `rules/`, `metadata.json`, refs).

## Installed Skills (CVForge-relevant set)

`deploy-to-vercel`, `vercel-optimize`, `web-design-guidelines`, `vercel-react-best-practices`,
`vercel-composition-patterns`, `vercel-react-view-transitions`. (Skipped: react-native,
cli-with-tokens.)

These complement the local Tier-2 rules — e.g. `vercel-composition-patterns` is the tool to reach
for when splitting the 522-line `ExperienceForm.tsx` (`.claude/rules/components.md`), and
`web-design-guidelines` pairs with print/UI work.

## Rules

1. **Manage skills only through the CLI.** Add/remove/update via `npx skills …`; never hand-create
   or hand-delete skill folders. After any change, the diff must include the updated `skills-lock.json`.
2. **Don't edit installed skill files.** Files under `.claude/skills/<name>/` are managed copies —
   edits are overwritten on `npx skills update`. To customize, author your own with
   `npx skills init <name>` or fork upstream.
3. **List before installing.** Run `npx skills add <source> -l` to get real `name:` values; the
   `--skill` flag matches `name:`, not the folder (React skills are prefixed `vercel-`).
4. **Review before trusting.** Skills run with full agent permissions. Read a new skill's `SKILL.md`
   (and `rules/`) before relying on it; heed the install-time Socket/Snyk risk assessment.
5. **Pin the agent + scope.** Default to project scope + `--agent claude-code` so the team shares the
   same set. Use `-g` (global) only for personal, cross-project skills (not committed here).
6. **Restore, don't re-pick.** Teammates/CI reproduce the set with `npx skills experimental_install`
   (reads `skills-lock.json`) — not by re-running `add` with a guessed list.

## Authoring a project-local skill

`npx skills init <name>` scaffolds `<name>/SKILL.md`. Keep its `name:` unique, write a precise
`description:` (it's what the agent matches on to auto-invoke), and document when NOT to use it.

## Anti-patterns
- Committing skill copies without `skills-lock.json` (breaks reproducibility).
- Editing managed skill files in place (lost on update).
- Installing the whole catalog when only a few apply — keep the set lean and relevant.
- Guessing `--skill` names from folder names instead of listing first.
