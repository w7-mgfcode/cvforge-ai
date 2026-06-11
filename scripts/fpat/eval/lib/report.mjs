// scripts/fpat/eval/lib/report.mjs — writes ONLY under docs/reports/<date>/. No other side effects.
// Exception: FPAT_EVAL_REPORT_DIR overrides the target (flat, no date subdir), and fixture
// runs (FPAT_EVAL_FIXTURES set) without an explicit override fall back to a per-process
// temp dir — fixture reports must NEVER overwrite real docs/reports artifacts.
import { mkdirSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

let fixtureTmpDir = null;

export function reportDir(date = new Date().toISOString().slice(0, 10)) {
  const override = (process.env.FPAT_EVAL_REPORT_DIR || '').trim();
  if (override) {
    mkdirSync(override, { recursive: true });
    return override;
  }
  if ((process.env.FPAT_EVAL_FIXTURES || '').trim()) {
    if (!fixtureTmpDir) fixtureTmpDir = mkdtempSync(join(tmpdir(), 'fpat-eval-fixtures-'));
    return fixtureTmpDir;
  }
  const dir = join('docs', 'reports', date);
  mkdirSync(dir, { recursive: true });
  return dir;
}

export function writeReport(name, obj, date) {
  const dir = reportDir(date);
  const path = join(dir, `${name}.json`);
  writeFileSync(path, JSON.stringify(obj, null, 2) + '\n', 'utf8');
  return path;
}
