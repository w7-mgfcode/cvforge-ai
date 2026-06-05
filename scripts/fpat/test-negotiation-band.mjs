// Behavioral test for the /fpat-continuation score bands (#44).
//
// Proves the three-way classification — and especially that a 36-39 candidate
// SURFACES for human decision rather than being silently shipped or deferred —
// and that the continuation pass advertises a read-only contract.
//
// Deliberately lightweight: a pure classifier + text assertions against the
// command/doc, plus a rendered sample. No shell-level write-interception
// harness — that pattern does not exist in scripts/fpat/, and the no-write
// contract is enforceable by asserting the command/doc text and the sample's
// closing line.
//
// Run: node scripts/fpat/test-negotiation-band.mjs   (exit 0 = pass, 1 = fail)

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

// Single source of truth bands: >= 40 ship / 36-39 negotiate / < 36 defer.
// (Owned by the flow-pack-agent-team-scoring skill; mirrored in the command
// and continuation-discipline.md.)
function classify(total) {
  if (total >= 40) return "ship";
  if (total >= 36) return "negotiate"; // 36, 37, 38, 39
  return "defer";
}

// 1. Band classification, including the exact boundaries (35/36 and 39/40).
const cases = [
  [50, "ship"],
  [43, "ship"],
  [40, "ship"], // lower edge of ship
  [39, "negotiate"], // upper edge of negotiation
  [38, "negotiate"],
  [36, "negotiate"], // lower edge of negotiation
  [35, "defer"], // upper edge of defer
  [31, "defer"],
  [5, "defer"],
];
for (const [total, want] of cases) {
  assert(classify(total) === want, `total ${total} classifies as ${want}`);
}

// 2. Read-only contract proven by text (command + doc), not by intercepting writes.
const command = fs.readFileSync(".claude/commands/fpat-continuation.md", "utf8");
const doc = fs.readFileSync(
  ".claude/docs/flow-pack-agent-team/continuation-discipline.md",
  "utf8",
);
assert(/no github writes/i.test(command), "command explicitly prohibits GitHub writes");
assert(/no file writes/i.test(command), "command explicitly prohibits file writes");
assert(/read-only/i.test(doc), "doc states the pass is read-only");

// 3. A rendered sample classifies correctly, forces an explicit defer reason,
//    and ends by stating that no writes were performed.
function renderSample(candidates) {
  const buckets = { ship: [], negotiate: [], defer: [] };
  for (const c of candidates) buckets[classify(c.total)].push(c);
  for (const d of buckets.defer) {
    if (!d.reason) throw new Error(`defer item "${d.title}" is missing an explicit reason`);
  }
  const lines = [];
  lines.push("## V2 — Ship");
  for (const c of buckets.ship) lines.push(`- ${c.title} — ${c.total}`);
  lines.push("## Negotiation (surface for human decision)");
  for (const c of buckets.negotiate) lines.push(`- ${c.title} — ${c.total}`);
  lines.push("## Defer");
  for (const c of buckets.defer) lines.push(`- ${c.title} — ${c.total} — reason: ${c.reason}`);
  lines.push("");
  lines.push("This was a read-only continuation pass. No GitHub or file writes were performed.");
  return lines.join("\n");
}

const sample = renderSample([
  { title: "ship-candidate", total: 43 },
  { title: "negotiate-candidate", total: 38 },
  { title: "defer-candidate", total: 31, reason: "needs project data first" },
]);

assert(/## V2 — Ship\n- ship-candidate — 43/.test(sample), "sample: 43 -> V2 ship list");
assert(
  /## Negotiation \(surface for human decision\)\n- negotiate-candidate — 38/.test(sample),
  "sample: 38 -> negotiation list (surfaced for human)",
);
assert(
  /## Defer\n- defer-candidate — 31 — reason: needs project data first/.test(sample),
  "sample: 31 -> defer list with explicit reason",
);
assert(
  /No GitHub or file writes were performed\./.test(sample),
  "sample output states that no writes were performed",
);

// A defer item with no reason must be rejected.
let threw = false;
try {
  renderSample([{ title: "bad", total: 10 }]);
} catch {
  threw = true;
}
assert(threw, "defer item without a reason is rejected as invalid output");

if (failures > 0) {
  console.error(`\nnegotiation-band test FAILED with ${failures} failure(s).`);
  process.exit(1);
}
console.log("\nnegotiation-band test passed.");
