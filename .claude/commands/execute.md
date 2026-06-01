---
description: Execute a CVForge AI implementation plan file
argument-hint: <path-to-plan.md>
---

# Execute: Implement a CVForge AI Plan

## Objective

Read and implement every task in the plan at **$ARGUMENTS**, following repo conventions, then
validate and report.

---

## Step 1: Read the Entire Plan

Read `$ARGUMENTS` start to finish before writing any code: all tasks + dependencies, affected
layers, architecture notes, prohibited patterns, and the validation steps. Do not start until
you have the full picture.

## Step 2: Verify Current State

```bash
git status
git branch --show-current
```

Flag any unrelated uncommitted changes before proceeding.

## Step 3: Execute Tasks in Dependency Order

For each task:

1. **Read** the target file(s) before editing — never edit blind.
2. **Implement** with Edit/Write.
3. **Honor the auto-loaded rules** for the files you touch (`.claude/rules/*` load by path):
   - Schema change → propagate to all 5 lock-step sites (`schema.md`).
   - Template change → registry + `renderActiveTemplate` + `.page-break-avoid` (`templates.md`).
   - Component → keep state in `studio/page.tsx`, controlled children, `'use client'` only if
     needed, Tailwind tokens, ≤ 500 lines (`components.md`).
   - Print/layout → preserve `.a4-page-context`, `.print-hide`, 1122px math (`print.md`).
   - AI/copilot → no server LLM under static export (`ai-copilot.md`).
4. **Type-check incrementally** after touching TS/TSX — don't accumulate errors:
   ```bash
   npm run build 2>&1 | tail -20
   ```
   (`npm run build` runs the Next.js type-check; there is no standalone `tsc` script.)

## Step 4: Run Validation Gates

```bash
npm run lint     # ESLint (next/core-web-vitals + next/typescript)
npm run build    # production build + type-check
```

Fix all failures. There is **no test runner** — do not run `npm test`.

## Step 5: Manual Print Verification

For any UI/template/schema/print change, manually verify:

- `npm run dev` → open `/studio`.
- Exercise the feature; switch through all three templates (`dossier`, `ats`, `visual`).
- Print-preview and confirm no A4 overflow / clipped / hidden content (1122px/page bound).

If you cannot run a gate (e.g. no browser available), say so explicitly in the report.

## Step 6: Output Report

```
## Execution Report: {Plan Name}

### Tasks Completed
- [x] Task 1: {description} — {files}
...

### Files Created / Modified
- `src/{path}` — {what changed}

### Validation Results
- lint: PASS / FAIL (N warnings)
- build (type-check): PASS / FAIL
- manual print check: DONE (templates verified) / NOT RUN (reason)

### Notes
{Deviations from plan, follow-ups, server-model decisions surfaced, etc.}
```

Then suggest `/commit` to capture the change (with a `Context:` section if any `.claude/` assets changed).
