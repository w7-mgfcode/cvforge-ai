// scripts/fpat/eval/check-scorecard.mjs
// Cycle-0 manifest conformance check. DEV TOOL — NOT an eval audit and NOT a
// CI gate: it parses the committed frozen baseline manifest against
// ScorecardSchema (lib/scorecard.mjs), turning epic #71's "schema parses the
// manifest" acceptance criterion into a re-runnable command. Read-only, no
// GitHub access, no writes.
//
// Exit code: 0 = the manifest conforms to the contract. Non-zero ONLY on
// schema/parse tooling errors (missing file, invalid JSON, contract mismatch)
// — NEVER on metric values; the schema carries no thresholds, so no number in
// the manifest can fail this check.
//
// Usage:
//   node scripts/fpat/eval/check-scorecard.mjs                       # frozen cycle-0 manifest
//   node scripts/fpat/eval/check-scorecard.mjs --manifest <path>     # another frozen scorecard

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { ScorecardSchema } from './lib/scorecard.mjs';

const EVAL_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(EVAL_DIR, '..', '..', '..');
const DEFAULT_MANIFEST = join(REPO_ROOT, 'docs', 'reports', '2026-06-11', 'baseline-manifest.json');

const flagIdx = process.argv.indexOf('--manifest');
const manifestPath = flagIdx !== -1 ? process.argv[flagIdx + 1] : DEFAULT_MANIFEST;
if (flagIdx !== -1 && !manifestPath) {
  console.error('[check-scorecard] --manifest requires a path argument');
  process.exit(1);
}

let raw;
try {
  raw = JSON.parse(readFileSync(manifestPath, 'utf8'));
} catch (err) {
  console.error(`[check-scorecard] cannot read/parse ${manifestPath}: ${err.message}`);
  process.exit(1);
}

const result = ScorecardSchema.safeParse(raw);
if (!result.success) {
  console.error(`[check-scorecard] CONTRACT MISMATCH — ${manifestPath} does not conform to ScorecardSchema:`);
  for (const issue of result.error.issues) {
    console.error(`  - ${issue.path.join('.') || '(root)'}: ${issue.message}`);
  }
  process.exit(1);
}

const m = result.data;
console.log(
  `[check-scorecard] OK — ${manifestPath} conforms ` +
  `(domain: ${m.domain}, schemaVersion: ${m.schemaVersion}, metric blocks: ${Object.keys(m.metrics).length})`,
);
