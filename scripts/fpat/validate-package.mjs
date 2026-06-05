#!/usr/bin/env node
// Schema-check for an FPAT planning package (see .claude/commands/fpat-plan-issue.md
// and .claude/docs/flow-pack-agent-team/execution-pipeline.md).
//
// Contract enforced:
//   - The package contains exactly N subtask blocks (default 5; override with --count=K
//     to allow an explicitly justified exception).
//   - Each subtask block is an H3 heading (`### ...`) — the heading is the "Title" section.
//   - Each subtask block also contains the 7 body sections as bold labels:
//       **Purpose:** **Scope:** **Out of scope:** **Dependencies:**
//       **Risks / blockers:** **Acceptance criteria:** **Why it matters now:**
//     Title (the H3) + 7 body labels = the canonical 8 sections.
//
// Usage:   node scripts/fpat/validate-package.mjs <package.md> [--count=5]
// Exit 0 = compliant, exit 1 = violations found (printed to stderr).

import fs from "node:fs";

const REQUIRED_BODY_SECTIONS = [
  "Purpose",
  "Scope",
  "Out of scope",
  "Dependencies",
  "Risks / blockers",
  "Acceptance criteria",
  "Why it matters now",
];

function parseArgs(argv) {
  const args = { file: null, count: 5 };
  for (const a of argv) {
    if (a.startsWith("--count=")) {
      args.count = Number.parseInt(a.slice("--count=".length), 10);
    } else if (!a.startsWith("--") && args.file === null) {
      args.file = a;
    }
  }
  return args;
}

// Split markdown into H3 subtask blocks. A block runs from one `### ` heading up to the
// next `### ` heading (or a higher-level `## ` heading, or EOF).
function extractSubtaskBlocks(md) {
  const lines = md.split("\n");
  const blocks = [];
  let current = null;
  for (const line of lines) {
    if (/^###\s+\S/.test(line)) {
      if (current) blocks.push(current);
      current = { title: line.replace(/^###\s+/, "").trim(), body: [] };
    } else if (/^##\s+\S/.test(line) && !/^###/.test(line)) {
      // A new H2 closes any open subtask block.
      if (current) {
        blocks.push(current);
        current = null;
      }
    } else if (current) {
      current.body.push(line);
    }
  }
  if (current) blocks.push(current);
  return blocks;
}

function missingSections(block) {
  const body = block.body.join("\n");
  return REQUIRED_BODY_SECTIONS.filter((label) => {
    // Match `**Label:**` or `**Label**:` tolerantly (case-sensitive on the label text).
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`\\*\\*\\s*${escaped}\\s*\\*\\*\\s*:|\\*\\*\\s*${escaped}\\s*:\\s*\\*\\*`, "i");
    return !re.test(body);
  });
}

function main() {
  const { file, count } = parseArgs(process.argv.slice(2));
  if (!file) {
    console.error("usage: node scripts/fpat/validate-package.mjs <package.md> [--count=5]");
    process.exit(1);
  }
  if (!fs.existsSync(file)) {
    console.error(`missing file: ${file}`);
    process.exit(1);
  }
  if (!Number.isInteger(count) || count < 1) {
    console.error(`invalid --count: ${count}`);
    process.exit(1);
  }

  const md = fs.readFileSync(file, "utf8");
  const blocks = extractSubtaskBlocks(md);
  const problems = [];

  if (blocks.length !== count) {
    problems.push(
      `expected exactly ${count} subtask(s) (H3 headings), found ${blocks.length}`,
    );
  }

  blocks.forEach((block, i) => {
    const missing = missingSections(block);
    if (missing.length > 0) {
      problems.push(
        `subtask ${i + 1} ("${block.title}") missing section(s): ${missing.join(", ")}`,
      );
    }
  });

  if (problems.length > 0) {
    console.error(`FPAT package validation FAILED (${problems.length} problem(s)):`);
    for (const p of problems) console.error(`  - ${p}`);
    process.exit(1);
  }

  console.log(
    `FPAT package validation passed: ${blocks.length} subtask(s), ${REQUIRED_BODY_SECTIONS.length + 1} sections each.`,
  );
}

main();
