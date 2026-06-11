# 08 — Agent Handoff Pack Format

**Purpose:** Define the ideal package to hand to a coding agent (Claude Code, Codex, or another) so it can execute with minimal ambiguity.

---

## Design goal

A coding agent works best with a tight, ordered, *verifiable* brief: clear goal, the exact files to read, explicit decisions already made, and commands it can run to check itself. This format encodes that.

## Required sections

```
AGENT HANDOFF PACK

1. PROJECT GOAL
   One paragraph: what to build and what "done" means.

2. TARGET ARCHITECTURE
   The components, how they connect, and the chosen stack.
   (Diagram-as-text or a short component list.)

3. SELECTED SOURCE REPOS
   The reference repos the evidence comes from, with a one-line reason each.

4. EXACT EVIDENCE FILES
   The reading list. For each:
     - repo name
     - graph node id
     - file path
     - node type (file/function/class/config/pipeline/…)
     - one-line summary
     - why it matters
   (This is the Evidence Pack, condensed — see 14 for the full chain.)

5. REUSABLE PATTERNS
   Named patterns to apply (e.g. "answer → approve → respond gate"),
   each pointing to its evidence file(s).

6. COPY / ADAPT / DROP DECISIONS
   Per file: COPY (portable), ADAPT (rewire deps), or DROP (skip) — with reason.

7. CONSTRAINTS
   Hard rules the agent must not violate (stack, security, must-avoid,
   "local-only", licensing, etc.).

8. IMPLEMENTATION PHASES
   Ordered steps (maps to 15). Each phase: goal + concrete tasks.

9. VALIDATION COMMANDS
   Exact commands to run to verify each phase
   (build, lint, type-check, tests, eval run). The agent runs these itself.

10. RISKS
    Known risks and where they'll bite (from 12), so the agent proceeds carefully.

11. SUCCESS CRITERIA
    Objective, checkable conditions that mean the work is complete and correct.
```

## Authoring rules

- **Be explicit about decisions.** The agent should not have to re-derive the architecture; sections 2, 6, and 7 remove ambiguity.
- **Every evidence file carries a citation.** No file appears without `{repo, node id, file path}`.
- **Validation is non-optional.** Section 9 makes the agent's progress self-checking, not self-reported.
- **No unverifiable claims.** If a pattern isn't backed by an evidence file, it does not go in section 5.

## Tip

Keep the pack as a single Markdown file the agent can load as context. Order matters: goal → architecture → constraints early, so they shape everything the agent does next.
