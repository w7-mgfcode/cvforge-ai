// scripts/fpat/eval/lib/stats.mjs — deterministic, dependency-free numeric helpers.
export function distribution(values, unit = 'hours') {
  const v = values.filter((x) => typeof x === 'number' && !Number.isNaN(x)).sort((a, b) => a - b);
  const n = v.length;
  if (n === 0) return { count: 0, min: null, max: null, mean: null, median: null, p90: null, unit };
  const sum = v.reduce((a, b) => a + b, 0);
  const at = (q) => v[Math.min(n - 1, Math.floor(q * (n - 1)))];
  const round = (x) => Math.round(x * 100) / 100;
  return {
    count: n,
    min: round(v[0]),
    max: round(v[n - 1]),
    mean: round(sum / n),
    median: round(n % 2 ? v[(n - 1) / 2] : (v[n / 2 - 1] + v[n / 2]) / 2),
    p90: round(at(0.9)),
    unit,
  };
}

export function hoursBetween(startISO, endISO) {
  if (!startISO || !endISO) return null;
  const ms = new Date(endISO).getTime() - new Date(startISO).getTime();
  return Number.isFinite(ms) ? ms / 3_600_000 : null;
}
