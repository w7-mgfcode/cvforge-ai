// Preflight consistency guard for the /fpat-continuation contract (#52).
//
// Two invariants, asserted so release-blocking documentation drift cannot
// silently return:
//
//   1. CLAUDE.md describes /fpat-continuation as READ-ONLY and names the
//      negotiation list (it once drifted to "Write+Isolate" / "ship/defer").
//   2. The three score bands are BYTE-IDENTICAL across the command, the
//      flow-pack-agent-team-scoring skill, and continuation-discipline.md.
//
// Run: node scripts/fpat/check-doc-consistency.mjs   (exit 0 = pass, 1 = fail)

import fs from "node:fs";

let failures = 0;
function assert(cond, msg) {
  if (cond) {
    console.log(`ok   - ${msg}`);
  } else {
    console.error(`FAIL - ${msg}`);
    failures += 1;
  }
}

const CLAUDE = "CLAUDE.md";
const COMMAND = ".claude/commands/fpat-continuation.md";
const SKILL = ".claude/skills/flow-pack-agent-team-scoring/SKILL.md";
const DOC = ".claude/docs/flow-pack-agent-team/continuation-discipline.md";

const read = (p) => fs.readFileSync(p, "utf8");

// 1. CLAUDE.md /fpat-continuation row is accurate (read-only + 3-list).
const claudeRow =
  read(CLAUDE)
    .split("\n")
    .find((l) => l.includes("`/fpat-continuation`")) ?? "";
assert(claudeRow !== "", "CLAUDE.md has a /fpat-continuation row");
assert(/read-only/i.test(claudeRow), "CLAUDE.md row marks /fpat-continuation read-only");
assert(/negotiation/i.test(claudeRow), "CLAUDE.md row names the negotiation list");
assert(
  !/Write\+Isolate/.test(claudeRow),
  "CLAUDE.md row no longer mislabels /fpat-continuation as Write+Isolate",
);

// 2. The three canonical band tokens are byte-identical across command/skill/doc.
//    Note: `36–39` uses an EN DASH (U+2013), not a hyphen — that is the point of
//    a byte-identity check.
const BANDS = ["`>= 40`", "`< 36`", "`36–39`"];
for (const [label, file] of [
  ["command", COMMAND],
  ["skill", SKILL],
  ["doc", DOC],
]) {
  const content = read(file);
  for (const band of BANDS) {
    assert(content.includes(band), `${label} contains band token ${band}`);
  }
}

if (failures > 0) {
  console.error(`\ndoc-consistency guard FAILED with ${failures} failure(s).`);
  process.exit(1);
}
console.log("\ndoc-consistency guard passed.");
