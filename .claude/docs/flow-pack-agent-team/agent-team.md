# FPAT Agent-Team Execution

Sources:

- `/home/w7-hector/_KB-BASE-BY-w7/context-engineering-intro-main/use-cases/build-with-agent-team/README.md`
- `/home/w7-hector/_KB-BASE-BY-w7/context-engineering-intro-main/use-cases/build-with-agent-team/SKILL.md`
- `/home/w7-hector/_KB-BASE-BY-w7/context-engineering-intro-main/use-cases/build-with-agent-team/example-plan/session-manager-plan.md`

## When To Use

Use normal subagents for read-only research and isolated analysis. Use agent teams only after epics and integration contracts exist and multiple workers must coordinate across boundaries.

## Contract-First Rule

Before spawning an agent team, the lead defines exact contracts:

- File ownership.
- Inputs and outputs.
- JSON shapes or command outputs.
- Cross-cutting concerns.
- Validation commands.
- What each agent must not touch.

For FPAT, the main integration contracts are between:

- `.claude` commands, docs, rules, and skills.
- `.github/workflows` automation.
- `scripts/fpat` bootstrap and validation tooling.
- GitHub Projects v2 fields and labels.

## Team Boundary

Agent-team execution is a release-phase capability for this adoption. Do not spawn teams before the board, labels, issue hierarchy, and foundation rules are approved.

