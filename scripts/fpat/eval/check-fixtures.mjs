// scripts/fpat/eval/check-fixtures.mjs
// Offline fixture checker for the eval audit suite. DEV TOOL — this is NOT an eval
// audit and NOT a CI gate: it runs every audit against the synthetic fixtureverse
// dataset (scripts/fpat/eval/__fixtures__/) and diffs each report against the
// committed goldens in __fixtures__/expected/. No GitHub access, no git access,
// no writes outside a temp dir. Unlike the audits, a golden MISMATCH exits 1 —
// that is the tool's whole job (catching unintended audit behavior changes).
//
// Usage:
//   node scripts/fpat/eval/check-fixtures.mjs            # compare against goldens
//   node scripts/fpat/eval/check-fixtures.mjs --update   # regold after intentional changes
//
// Goldens are stored NORMALIZED (volatile fields stripped): generatedAt, inputs
// (signal-quality embeds temp report paths), metrics.asOf, metrics.sources, and
// ISO timestamps inside findings strings (workflow-reliability embeds asOf there).

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual } from 'node:util';

const EVAL_DIR = dirname(fileURLToPath(import.meta.url));
const FIXTURES = join(EVAL_DIR, '__fixtures__');
const EXPECTED = join(FIXTURES, 'expected');
const UPDATE = process.argv.includes('--update');

const ISO_TS_RE = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z/g;

function normalize(report) {
  const r = JSON.parse(JSON.stringify(report));
  delete r.generatedAt;
  delete r.inputs;
  if (r.metrics && typeof r.metrics === 'object') {
    delete r.metrics.asOf;
    delete r.metrics.sources;
  }
  if (Array.isArray(r.findings)) {
    r.findings = r.findings.map((s) => String(s).replace(ISO_TS_RE, '<ts>'));
  }
  return r;
}

// Ordered: signal-quality consumes the planning + reliability reports from outDir.
const CASES = [
  {
    name: 'throughput',
    script: 'audit-throughput.mjs',
    args: ['--prior-issues', '33', '--prior-prs', '21', '--with-subissues'],
  },
  { name: 'planning-accuracy', script: 'audit-planning-accuracy.mjs', args: [] },
  {
    name: 'workflow-reliability',
    script: 'audit-workflow-reliability.mjs',
    args: ['--until', '2026-06-08'],
  },
  { name: 'signal-quality', script: 'audit-signal-quality.mjs', args: [] },
  { name: 'board-consistency', script: 'audit-board-consistency.mjs', args: [] },
  {
    name: 'board-consistency.degraded',
    script: 'audit-board-consistency.mjs',
    args: [],
    fixtureSet: 'github-degraded',
    outSubdir: 'degraded',
    reportFile: 'board-consistency.json',
  },
];

function main() {
  const outRoot = mkdtempSync(join(tmpdir(), 'fpat-fixture-check-'));
  let mismatches = 0;

  for (const c of CASES) {
    const outDir = c.outSubdir ? join(outRoot, c.outSubdir) : outRoot;
    mkdirSync(outDir, { recursive: true });
    execFileSync('node', [join(EVAL_DIR, c.script), ...c.args], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'], // audit stdout suppressed; this tool prints the verdicts
      env: {
        ...process.env,
        FPAT_EVAL_FIXTURES: join(FIXTURES, c.fixtureSet || 'github'),
        FPAT_EVAL_REPORT_DIR: outDir,
      },
    });

    const actualPath = join(outDir, c.reportFile || `${c.name}.json`);
    const actual = normalize(JSON.parse(readFileSync(actualPath, 'utf8')));
    const goldenPath = join(EXPECTED, `${c.name}.json`);

    if (UPDATE) {
      mkdirSync(EXPECTED, { recursive: true });
      writeFileSync(goldenPath, JSON.stringify(actual, null, 2) + '\n', 'utf8');
      console.log(`[check-fixtures] regolded ${c.name}`);
      continue;
    }

    const golden = JSON.parse(readFileSync(goldenPath, 'utf8'));
    if (isDeepStrictEqual(actual, golden)) {
      console.log(`[check-fixtures] PASS ${c.name}`);
    } else {
      mismatches += 1;
      console.error(`[check-fixtures] MISMATCH ${c.name}`);
      console.error(`  expected: ${goldenPath}`);
      console.error(`  actual:   ${actualPath} (normalized in-memory; diff against expected after`);
      console.error(`            stripping generatedAt/inputs/metrics.asOf/metrics.sources)`);
    }
  }

  if (UPDATE) {
    console.log('[check-fixtures] goldens updated — inspect the diff before committing.');
  } else if (mismatches) {
    console.error(`[check-fixtures] ${mismatches}/${CASES.length} mismatched`);
    process.exit(1);
  } else {
    console.log(`[check-fixtures] all ${CASES.length} fixture runs match goldens`);
  }
}

try {
  main();
} catch (err) {
  console.error('[check-fixtures] TOOLING ERROR:', err.message);
  if (err.stderr) console.error(String(err.stderr).trim());
  process.exit(1);
}
