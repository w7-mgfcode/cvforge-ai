# Skills CLI Guide (`npx skills`)

> **Summary:** How the open agent-skills ecosystem (`vercel-labs/skills`, the `skills` CLI)
> works in this repo — commands, where skills install, the `skills-lock.json` manifest, and the
> six skills we installed. Read before adding/removing/updating skills or onboarding a teammate.

## What it is

`vercel-labs/skills` is **the CLI tool**, published to npm as `skills` (`npx skills`, v1.5.x at
install time). Tagline: *"the open agent skills ecosystem."* It is a package manager for **agent
skills** — modular `SKILL.md` bundles that extend a coding agent's capabilities. It is NOT itself
a skill collection; the skills live in registries like **`vercel-labs/agent-skills`** (browse at
https://skills.sh). The repo ships exactly one bundled skill, `find-skills` (discovery).

It supports 55+ agents (Claude Code, Cursor, Codex, OpenCode, …) and auto-detects which are
installed.

## Commands (verified via `npx skills --help`)

| Command | Syntax | Purpose |
|---------|--------|---------|
| `add` (`a`) | `npx skills add <source> [opts]` | Install skills from a repo/URL/local path |
| `list` (`ls`) | `npx skills list [opts]` | List installed skills |
| `find` | `npx skills find [query]` | Search the ecosystem (interactive or by keyword) |
| `remove` (`rm`) | `npx skills remove [skills] [opts]` | Uninstall skills |
| `update` (`upgrade`) | `npx skills update [skills...] [opts]` | Update to latest versions |
| `init` | `npx skills init [name]` | Scaffold a new `SKILL.md` |
| `experimental_install` | `npx skills experimental_install` | Restore skills from `skills-lock.json` |
| `experimental_sync` | `npx skills experimental_sync [-y]` | Sync skills from `node_modules` into agent dirs |

### Key `add` flags
- `-s, --skill <names...>` — install specific skills (space-separated). **Match the SKILL `name:`
  field, NOT the folder name** (see gotcha below).
- `-a, --agent <agents...>` — target agents, e.g. `claude-code`; `*` = all detected.
- `-g, --global` — install to user-level (`~/…`) instead of the project.
- `--copy` — copy files instead of symlinking.
- `-y, --yes` — non-interactive; `--all` = `--skill '*' --agent '*' -y`.
- `-l, --list` — list available skills in a source WITHOUT installing (great for discovering names).
- `--full-depth` — search all subdirs even when a root `SKILL.md` exists.

### Source formats (verbatim)
```
npx skills add vercel-labs/agent-skills                       # GitHub shorthand
npx skills add https://github.com/vercel-labs/agent-skills    # full URL
npx skills add git@github.com:vercel-labs/agent-skills.git    # git URL
npx skills add ./my-local-skills                              # local path
```

## Where skills install (in THIS repo)

- Detected agent: **Claude Code**. Project scope.
- Symlink is the documented default, **but this environment fell back to `copy`** — skills are
  real directory copies under **`.claude/skills/<name>/`** (not symlinks; `.agents/skills/` stayed
  empty in copy mode).
- Each skill is a full bundle: `SKILL.md` (+ optional `rules/`, `README.md`, `metadata.json`,
  reference files). Skills run with **full agent permissions** — review before trusting.

## `skills-lock.json` (repo root)

The reproducibility manifest. Maps each installed skill `name` → `{ source, sourceType,
skillPath, computedHash }`. Commit it. A teammate restores the exact set with:

```
npx skills experimental_install
```

## Installed in this project (CVForge-relevant set)

| Skill (`name:`) | Source folder | Why it fits CVForge |
|-----------------|---------------|---------------------|
| `deploy-to-vercel` | `skills/deploy-to-vercel` | Ship the static export to Vercel |
| `vercel-optimize` | `skills/vercel-optimize` | Cost/perf + Core Web Vitals for Next.js |
| `web-design-guidelines` | `skills/web-design-guidelines` | UI / a11y / UX review of the studio |
| `vercel-react-best-practices` | `skills/react-best-practices` | React 18/19 perf + structure rules |
| `vercel-composition-patterns` | `skills/composition-patterns` | Refactor large components (e.g. ExperienceForm) |
| `vercel-react-view-transitions` | `skills/react-view-transitions` | View Transition API for studio/route animations |

Deliberately skipped: `vercel-react-native-skills` (no React Native here),
`vercel-cli-with-tokens` (token-auth CLI; we use interactive `vercel login`).

## Gotcha: folder name ≠ skill name

The `--skill` flag matches the `name:` in each `SKILL.md`, which can differ from the directory.
The React skills are prefixed `vercel-` even though their folders are not. Always run
`npx skills add <source> -l` first to read the real names.

## Common workflows

```bash
npx skills add vercel-labs/agent-skills -l                    # discover real skill names
npx skills add vercel-labs/agent-skills -s <name...> -a claude-code -y   # install specific
npx skills list                                               # what's installed (project)
npx skills update                                             # update all
npx skills remove <name> -y                                   # uninstall
npx skills experimental_install                               # restore from lockfile
```

## Anti-patterns
- Don't guess `--skill` names from folders — list first (`-l`).
- Don't forget to commit `skills-lock.json` — it's the team's reproducible source of truth.
- Don't blindly trust an installed skill — it executes with full agent permissions; review `SKILL.md`.
- Don't hand-edit files inside `.claude/skills/<name>/` — they're managed copies; changes are lost
  on `update`. Fork the skill or author your own with `npx skills init`.
