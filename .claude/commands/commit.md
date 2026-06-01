---
description: Create an atomic, context-enriched commit for current changes
---

# Commit Changes

## Process

### 1. Review
```bash
git status
git diff HEAD
git diff --stat HEAD
git ls-files --others --exclude-standard   # untracked
```

### 2. Stage
Stage the files relevant to the current work. **Never stage:** `.env`/credentials/tokens,
generated secrets, private candidate data, large binaries, or unrelated files.
(Per `AGENTS.md`: keep sample CV content fictional/sanitized.)

### 3. Commit message — conventional tag + WHY body

Tags: `feat` · `fix` · `refactor` · `docs` · `style` · `chore` · `perf`.
Use a scope when it clarifies the area:

```
feat(schema): add languages section to CV contract
fix(print): prevent dossier template overflow past 1122px
refactor(editor): split ExperienceForm into employment/projects/credentials
docs(context): add print-fidelity reference doc
```

Format:
```
tag(scope): concise description of what changed

[WHY this change was made — context not obvious from the diff.]

[Optional: Fixes #123]
```

### 4. Capture AI-context changes (the `Context:` section)

If this commit changed any context-engineering asset, append a `Context:` section so the git log
remains the project's long-term memory:

```
feat(schema): add languages section to CV contract

Adds CVContent.languages so multilingual candidates aren't dropped.
Propagated through sample data, editor, all 3 templates, and the validator.

Context:
- Updated .claude/rules/schema.md (languages field + lock-step note)
- Surfaced: print-validator needs a length threshold for long language lists

Fixes #12
```

**Counts as AI-context change:** `CLAUDE.md`, `.claude/rules/`, `.claude/commands/`,
`.claude/docs/`, `.claude/plans/`, `AGENTS.md`.

### 5. End the commit message with the required co-author trailer

```
Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
```

Only commit when the user has asked for it. If on the default branch (`main`), create a feature
branch first.
