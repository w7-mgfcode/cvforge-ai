# FPAT Continuation Discipline

Source: `/home/w7-hector/_KB-BASE-BY-w7/JOB/DIA-FLOW/ai_engineering_mermaid_flow_pack/docs/flow-analysis/03-continuation-discipline.md`.

## Purpose

Continuation discipline turns a baseline-grounded V1 plan into a research-surviving V2 ship list plus an explicit defer list.

## Procedure

1. Capture baseline reality: repo, docs, rules, issues, and current state.
2. Freeze the baseline before drafting V1.
3. Draft V1 as a naive 5-10 item continuation list with no scores.
4. Critique V1 for weak assumptions, scope creep, and missing evidence.
5. Spawn exactly three read-only research agents:
   - Known Issues
   - Best Practices
   - Dependencies
6. Synthesize findings and score every candidate.
7. Emit V2 ship list, negotiation list, and defer list.

## Five-Dimension Score

Each dimension is 1-10:

- Value
- Risk
- Readiness
- Complexity
- Evidence

Score bands:

- `>= 40`: ship
- `< 36`: defer
- `36–39`: negotiate with the user

Keep the bands verbatim for the first CVForge AI adoption umbrella. These bands are owned by the
`flow-pack-agent-team-scoring` skill and applied at `/fpat-continuation` step 7 — keep them
byte-identical across the skill, that command, and this doc.

## Output Templates (V2 ship / negotiation / defer)

`/fpat-continuation` (step 8) emits exactly three lists. Every item carries its five-dimension
score breakdown and total; every **defer** item additionally carries an explicit `reason:`, in
the same style as umbrella #1's `## Out of scope` ("reason: ..."). The pass is read-only — it
proposes these lists, it never writes them to GitHub or the board.

Score notation per item: `Value/Risk/Readiness/Complexity/Evidence = total` (each dimension 1-10,
total out of 50).

### V2 ship list (`total >= 40`)

```text
## V2 — Ship
- <candidate title> — 9/8/9/8/9 = 43
  - what ships: <one line of concrete scope>
- <candidate title> — 8/9/8/8/8 = 41
  - what ships: <one line of concrete scope>
```

### Negotiation list (`36 <= total <= 39`)

```text
## Negotiation (surface for human decision)
- <candidate title> — 8/7/8/7/8 = 38
  - open question: <why it is borderline — the call the user must make>
```

### Defer list (`total < 36`)

```text
## Defer
- <candidate title> — 6/7/7/6/8 = 34
  - reason: <explicit, specific defer reason — never blank>
- <candidate title> — 5/6/7/6/7 = 31
  - reason: <explicit, specific defer reason>
```

A defer item with a blank or missing `reason:` is invalid output. A `36–39` item must land in the
negotiation list — it is never silently shipped or deferred.

## Feeding an approved V2 into the umbrella (gated)

The continuation pass is read-only and produces the three lists above. Promoting them into the
delivery hierarchy is a **separate, explicitly gated step** — it is the only write the flow ever
makes, and it happens only after the user approves the V2 ship list.

Gate and procedure:

1. **Approval gate.** Do not touch any issue until the user approves the V2 ship list. The
   planning pass itself never writes (see **Guardrails** in
   `.claude/commands/fpat-continuation.md`).
2. **Feed only V2 ship items.** For each approved V2 item, append one epic line under umbrella
   #1's `## Decomposition` section (the umbrella body — see the umbrella contract in
   `decomposition.md`), with its phase/area. Negotiation-list items are **not** fed until the
   user resolves them into ship or defer; defer items are recorded with their `reason:` and are
   not fed.
3. **No board field writes.** This step edits issue bodies / hierarchy only. It never sets the
   board `Status` or `Score` — board membership and Type/Phase/Area come from labels + native
   auto-add (`board-spec.md` → Automation & secrets).
4. **Close gate still applies.** New epics appended under #1 keep the umbrella open until they
   close, enforced by `fpat-rollup-gate.yml` (`board-spec.md` → Gates).

This keeps V1→V2 continuation one-directional and human-gated: research-survived items flow into
the umbrella only on explicit approval, and nothing the pass discovers mutates GitHub on its own.

