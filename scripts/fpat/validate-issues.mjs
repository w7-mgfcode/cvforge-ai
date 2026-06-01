import fs from "node:fs";
import path from "node:path";

const requiredTemplates = [
  ".github/ISSUE_TEMPLATE/fpat_umbrella.yml",
  ".github/ISSUE_TEMPLATE/fpat_epic.yml",
  ".github/ISSUE_TEMPLATE/fpat_sub_issue.yml",
];

const requiredDocs = [
  ".claude/docs/flow-pack-agent-team/board-spec.md",
  ".claude/docs/flow-pack-agent-team/decomposition.md",
  ".claude/docs/flow-pack-agent-team/execution-pipeline.md",
  ".claude/docs/flow-pack-agent-team/continuation-discipline.md",
  ".claude/docs/flow-pack-agent-team/agent-team.md",
];

const requiredRules = [
  ".claude/rules/flow-pack-agent-team/branch-naming.md",
  ".claude/rules/flow-pack-agent-team/commit-format.md",
];

let failures = 0;

function checkExists(file) {
  if (!fs.existsSync(file)) {
    console.error(`missing: ${file}`);
    failures += 1;
  }
}

function checkContains(file, needle) {
  const content = fs.readFileSync(file, "utf8");
  if (!content.includes(needle)) {
    console.error(`missing "${needle}" in ${file}`);
    failures += 1;
  }
}

[...requiredTemplates, ...requiredDocs, ...requiredRules].forEach(checkExists);

checkContains(".claude/docs/flow-pack-agent-team/board-spec.md", "CVForge AI Delivery");
checkContains(".claude/docs/flow-pack-agent-team/continuation-discipline.md", ">= 40");
checkContains(".claude/docs/flow-pack-agent-team/execution-pipeline.md", "exactly five");
checkContains(".github/ISSUE_TEMPLATE/fpat_umbrella.yml", "Success criteria");
checkContains(".github/ISSUE_TEMPLATE/fpat_sub_issue.yml", "Acceptance criteria");

const workflow = ".github/workflows/fpat-validate.yml";
checkExists(workflow);
if (fs.existsSync(workflow)) {
  checkContains(workflow, "scripts/fpat/validate-issues.mjs");
}

if (failures > 0) {
  console.error(`FPAT validation failed with ${failures} failure(s).`);
  process.exit(1);
}

console.log("FPAT validation passed.");

