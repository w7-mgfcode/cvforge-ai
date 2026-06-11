// scripts/fpat/eval/lib/report.mjs — writes ONLY under docs/reports/<date>/. No other side effects.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export function reportDir(date = new Date().toISOString().slice(0, 10)) {
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
