# github-degraded — board-consistency degraded-path fixture set

This directory intentionally contains **no fixture files**. Pointing
`FPAT_EVAL_FIXTURES` here makes the board-consistency probe fail with the
deterministic loader error (`fixture not found or invalid: project-view.json`),
which exercises the degraded path offline: `access.degraded=true`,
`tokenSource='none'`, all board blocks `null`, exit 0.

Deliberate deviation from "copy the repo-side files here": the degraded run
makes no repo-side calls at all (that's signal-quality's domain), so duplicating
`issues-*.json`/`prs-*.json` would only invite fixture drift. Running any OTHER
audit against this directory fails as a tooling error — that is expected; only
`audit-board-consistency.mjs` is meaningful here.
