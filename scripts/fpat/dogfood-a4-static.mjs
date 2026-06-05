// Dogfood: STATIC A4 print-safety audit of the sample CV (#53).
//
// Runs the project's real `auditDocumentData` (src/lib/print-validator.ts) against the real
// sample dataset (src/data/sample-cv.ts) and reports its warnings + metrics. The audit is
// content-based (template-independent), so one run covers all three templates' shared content.
// Pair it with the rendered per-template check in dogfood-a4.mjs.
//
// Zero new deps: both source files import only the `CVDocument` TYPE (erased on transpile), so
// the in-repo `typescript` compiler can strip types and we import the resulting ESM directly.
//
// Run: node scripts/fpat/dogfood-a4-static.mjs   (exit 0 = audit ran; 1 = could not run)

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import ts from "typescript";

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "fpat-a4-"));

function loadTs(srcPath) {
  const src = fs.readFileSync(srcPath, "utf8");
  const out = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  // Defensive: drop any residual `@/...` import line (all are type-only here).
  const clean = out.replace(/^\s*import\s+[^;]*from\s+['"]@\/[^'"]+['"];?\s*$/gm, "");
  const file = path.join(tmp, path.basename(srcPath).replace(/\.ts$/, ".mjs"));
  fs.writeFileSync(file, clean);
  return file;
}

const { auditDocumentData, calculateOverflow } = await import(loadTs("src/lib/print-validator.ts"));
const { sampleCV } = await import(loadTs("src/data/sample-cv.ts"));

const report = auditDocumentData(sampleCV);

console.log("Static A4 audit — sample CV (shared across dossier / ats / visual)");
console.log("  isCompliant:", report.isCompliant);
console.log("  metrics:", JSON.stringify(report.metrics));
if (report.warnings.length) {
  console.log("  advisory warnings:");
  for (const w of report.warnings) console.log("   -", w);
} else {
  console.log("  advisory warnings: none");
}
// Sanity-check the page-model helper agrees with the A4 constant.
const spot = calculateOverflow(2244, 2);
console.log("  calculateOverflow(2244,2) =", spot, "(expect 0 — content within 2 A4 pages)");

fs.writeFileSync(
  "docs/reports/2026-06-05/a4-static-audit.json",
  JSON.stringify({ ...report, calculateOverflowSpotCheck: spot }, null, 2),
);
console.log("\nStatic audit ran. (Warnings are advisory content heuristics, not overflow.)");
