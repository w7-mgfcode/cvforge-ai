// scripts/fpat/eval/audit-board-consistency.mjs
// FPAT Umbrella 2 — domain-4 board-consistency audit (Projects v2). Read-only.
// Raw metrics, no thresholds, no gating. DEGRADED-FIRST: user-owned Projects v2 data
// needs either the `project` scope on the gh login or a read-only FPAT_PROJECT_TOKEN
// (env var, applied per-call to project queries only — never to repo-side calls).
// With neither, the audit still writes a report: access.degraded=true, every board
// block null (null = "not measured", never "zero problems"), and it deliberately does
// NOT fall back to label-only checks — that is audit-signal-quality.mjs's domain.
//
// Checks (live mode):
//   1. board       — title/visibility/item count vs board-spec.md
//   2. fields      — expected fields + single-select options exist (option drift)
//   3. membership  — flow-pack issues/PRs ⊆ board items (auto-add effectiveness),
//                    board items without flow-pack. Membership is defined by the
//                    CURRENT flow-pack label — decided-unlabeled historical gaps
//                    (#12/#14, 2026-06-11 decision) are out of scope by construction.
//   4. labelFieldSync — type:/phase:/area: labels vs Type/Phase/Area field values
//                    (fpat-project-sync effectiveness; label absent → field skipped)
//   5. statusCoherence — closed/merged content not in Status=Done; Done with open content
//   6. scoreGate   — epics missing Score, or Score < 40 while off Backlog (the ship
//                    gate is REPORTED here, never enforced)
//
// Usage:
//   node scripts/fpat/eval/audit-board-consistency.mjs \
//     [--project 2] [--owner w7-mgfcode] [--limit 1000]
//
// Exit code: 0 on success (even when degraded or metrics look "bad"); non-zero only
// on tooling error.

import {
  listAllIssues, listAllPRs, viewProject, listProjectFields, listProjectItems,
} from './lib/gh.mjs';
import { writeReport } from './lib/report.mjs';
import { BoardConsistencyReportSchema } from './lib/schema.mjs';

// Expected board shape per .claude/docs/flow-pack-agent-team/board-spec.md.
const EXPECTED_FIELDS = {
  Status: ['Backlog', 'Ready', 'In Progress', 'In Review', 'Blocked', 'Done'],
  Type: ['Umbrella', 'Epic', 'Sub-issue'],
  Phase: ['Foundation', 'Parallel', 'Release'],
  Area: [
    'claude-rules', 'claude-docs', 'claude-commands', 'claude-skills',
    'github-workflows', 'github-projects', 'scripts',
  ],
  Priority: ['P0', 'P1', 'P2'],
  Score: null, // number field — existence only
  Estimate: null,
};

// label suffix → field option, mirroring fpat-project-sync.yml's by-name map.
const LABEL_TO_OPTION = {
  type: { umbrella: 'Umbrella', epic: 'Epic', 'sub-issue': 'Sub-issue' },
  phase: { foundation: 'Foundation', parallel: 'Parallel', release: 'Release' },
  area: Object.fromEntries(EXPECTED_FIELDS.Area.map((a) => [a, a])),
};

const SHIP_GATE = 40; // reported signal only — this audit never gates.

function arg(name, def = undefined) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return def;
  const next = process.argv[i + 1];
  return next && !next.startsWith('--') ? next : true;
}

const firstLine = (s) => String(s || '').split('\n')[0].trim();

// Probe order: env token first (explicit operator intent), else ambient gh auth.
// A successful probe returns the board view so live mode reuses it (no second call).
function resolveAccess(projectNumber, owner) {
  const envToken = (process.env.FPAT_PROJECT_TOKEN || '').trim() || undefined;
  const tokenSource = envToken ? 'env:FPAT_PROJECT_TOKEN' : 'gh-auth';
  try {
    const view = viewProject(projectNumber, owner, { token: envToken });
    return { tokenSource, degraded: false, probeError: null, token: envToken, view };
  } catch (err) {
    return {
      tokenSource: 'none', degraded: true,
      probeError: firstLine(err.stderr || err.message), token: undefined, view: null,
    };
  }
}

function checkFields(fieldList) {
  const present = fieldList.fields.map((f) => f.name);
  const missing = Object.keys(EXPECTED_FIELDS).filter((n) => !present.includes(n));
  const optionDrift = [];
  for (const [name, expectedOptions] of Object.entries(EXPECTED_FIELDS)) {
    if (!expectedOptions) continue;
    const field = fieldList.fields.find((f) => f.name === name);
    if (!field) continue; // already in `missing`
    const have = (field.options || []).map((o) => o.name ?? o);
    const missingOptions = expectedOptions.filter((o) => !have.includes(o));
    if (missingOptions.length) optionDrift.push({ field: name, missingOptions });
  }
  return { present, missing, optionDrift };
}

const itemRef = (it) => ({
  number: it.content?.number ?? null,
  title: it.content?.title ?? it.title ?? '',
  kind: it.content?.type ?? 'DraftIssue',
});

// One-line per-kind summary for findings/console, e.g.
// "Issue: 1 mismatched, 1 unset, 6 checked; PullRequest: 1 mismatched, 3 unset, 2 checked".
const kindNote = (byKind) => Object.entries(byKind)
  .map(([k, t]) => `${k}: ${t.mismatchCount} mismatched, ${t.missingFieldValueCount} unset, ${t.itemsChecked} checked`)
  .join('; ');

async function main() {
  const projectNumber = Number(arg('project', 2));
  const owner = arg('owner', 'w7-mgfcode');
  const limit = Number(arg('limit', 1000));

  const access = resolveAccess(projectNumber, owner);

  let board = null;
  let fields = null;
  let membership = null;
  let labelFieldSync = null;
  let statusCoherence = null;
  let scoreGate = null;
  const inputs = [
    `gh project view ${projectNumber} --owner ${owner} --format json (probe)`,
  ];

  if (!access.degraded) {
    const fieldList = listProjectFields(projectNumber, owner, { token: access.token });
    const itemList = listProjectItems(projectNumber, owner, { token: access.token, limit });
    // Repo-side state (normal gh auth) — only fetched in live mode so the degraded
    // path duplicates nothing that signal-quality already measures.
    const issues = listAllIssues({});
    const prs = listAllPRs({});
    inputs.push(
      `gh project field-list ${projectNumber} --owner ${owner} --format json`,
      `gh project item-list ${projectNumber} --owner ${owner} --format json --limit ${limit}`,
      'gh issue list --state all --json number,title,state,labels',
      'gh pr list --state all --json number,title,state,labels,headRefName,body,createdAt,mergedAt',
    );

    const items = itemList.items || [];
    board = {
      number: projectNumber,
      title: access.view.title,
      owner: access.view.owner?.login ?? owner,
      visibility: access.view.public ? 'public' : 'private',
      itemCount: itemList.totalCount ?? items.length,
      possiblyTruncated: (itemList.totalCount ?? items.length) > items.length,
      url: access.view.url ?? '',
    };

    fields = checkFields(fieldList);

    // Cross-reference maps. Issue and PR numbers share one space in a repo.
    const contentByNumber = new Map();
    for (const i of issues) contentByNumber.set(i.number, { state: i.state, labels: (i.labels || []).map((l) => l.name) });
    for (const p of prs) contentByNumber.set(p.number, { state: p.state, labels: (p.labels || []).map((l) => l.name) });

    const boardNumbers = new Set(items.map((it) => it.content?.number).filter((n) => n != null));

    // 3. membership
    const flowPack = [
      ...issues.filter((i) => (i.labels || []).some((l) => l.name === 'flow-pack'))
        .map((i) => ({ number: i.number, title: i.title, kind: 'Issue' })),
      ...prs.filter((p) => (p.labels || []).some((l) => l.name === 'flow-pack'))
        .map((p) => ({ number: p.number, title: p.title, kind: 'PullRequest' })),
    ];
    membership = {
      flowPackTotal: flowPack.length,
      onBoard: flowPack.filter((x) => boardNumbers.has(x.number)).length,
      flowPackNotOnBoard: flowPack.filter((x) => !boardNumbers.has(x.number)),
      boardItemsNotFlowPack: items
        .filter((it) => !(it.labels || []).includes('flow-pack'))
        .map(itemRef),
    };

    // 4. label ↔ field sync (only where the label exists — sync never clears fields)
    // Per-kind split (#72/#87): each entry carries its content `kind`, and `byKind`
    // tallies Issue vs PullRequest separately — fpat-project-sync.yml triggers on
    // issue events only, so the PR-side share of this population is the measured
    // precondition for the parked PR-event-sync decision (data, never the decision).
    const mismatches = [];
    const missingFieldValues = [];
    let itemsChecked = 0;
    const byKind = {
      Issue: { itemsChecked: 0, mismatchCount: 0, missingFieldValueCount: 0 },
      PullRequest: { itemsChecked: 0, mismatchCount: 0, missingFieldValueCount: 0 },
    };
    for (const it of items) {
      const number = it.content?.number;
      if (number == null) continue; // DraftIssue — no labels to sync from
      const kind = it.content.type; // numbered content is always Issue | PullRequest
      itemsChecked += 1;
      byKind[kind].itemsChecked += 1;
      for (const dimension of ['type', 'phase', 'area']) {
        const label = (it.labels || []).find((n) => n.startsWith(`${dimension}:`));
        if (!label) continue;
        const expected = LABEL_TO_OPTION[dimension][label.slice(dimension.length + 1)];
        if (!expected) continue; // unknown suffix — taxonomy drift is signal-quality's domain
        const fieldValue = it[dimension];
        if (fieldValue == null) {
          missingFieldValues.push({ number, kind, dimension, label });
          byKind[kind].missingFieldValueCount += 1;
        } else if (fieldValue !== expected) {
          mismatches.push({ number, kind, dimension, label, fieldValue });
          byKind[kind].mismatchCount += 1;
        }
      }
    }
    labelFieldSync = { itemsChecked, byKind, mismatches, missingFieldValues };

    // 5. status coherence (one-directional sync means drift here is legal — measured, not judged)
    const closedNotDone = [];
    const doneButOpen = [];
    let coherenceChecked = 0;
    for (const it of items) {
      const number = it.content?.number;
      if (number == null) continue;
      const content = contentByNumber.get(number);
      if (!content) continue; // e.g. transferred/inaccessible content
      coherenceChecked += 1;
      const isOpen = content.state === 'OPEN';
      const status = it.status ?? null;
      if (!isOpen && status !== 'Done') closedNotDone.push({ number, title: it.content?.title ?? '', status });
      if (isOpen && status === 'Done') doneButOpen.push({ number, title: it.content?.title ?? '' });
    }
    statusCoherence = { itemsChecked: coherenceChecked, closedNotDone, doneButOpen };

    // 6. score gate signal (epics by Type field, falling back to the type:epic label)
    const epics = items.filter(
      (it) => it.type === 'Epic' || (it.labels || []).includes('type:epic'),
    );
    scoreGate = {
      epicsChecked: epics.length,
      missingScore: epics
        .filter((it) => typeof it.score !== 'number')
        .map((it) => ({ number: it.content?.number ?? null, title: it.content?.title ?? it.title ?? '' })),
      belowGateOffBacklog: epics
        .filter((it) => typeof it.score === 'number' && it.score < SHIP_GATE && it.status !== 'Backlog')
        .map((it) => ({
          number: it.content?.number ?? null,
          title: it.content?.title ?? it.title ?? '',
          score: it.score,
          status: it.status ?? null,
        })),
    };
  }

  const degradedNote = access.degraded
    ? ' DEGRADED RUN: no Projects v2 read access (no `project` scope, no FPAT_PROJECT_TOKEN); board blocks are null = not measured.'
    : '';

  const report = {
    domain: 'board-consistency',
    schemaVersion: '1.0.0',
    generatedAt: new Date().toISOString(),
    scope: {
      label: 'flow-pack',
      umbrella: 'all-flow-pack',
      note:
        `Domain-4 board↔issue consistency for Projects v2 board #${projectNumber} (${owner}). ` +
        'Read-only; raw metrics, never a gate. Membership is defined by the CURRENT flow-pack ' +
        'label (the 2026-06-11 no-mutation decision on historical gaps is honored by construction). ' +
        'null board blocks mean "not measured", never "zero problems".' + degradedNote,
    },
    inputs,
    metrics: {
      access: { tokenSource: access.tokenSource, degraded: access.degraded, probeError: access.probeError },
      board, fields, membership, labelFieldSync, statusCoherence, scoreGate,
    },
    findings: access.degraded
      ? ['Board unreadable — all six board checks not measured (see access.probeError).']
      : [
          `Board "${board.title}" (#${projectNumber}, ${board.visibility}): ${board.itemCount} items.`,
          `Fields: ${fields.missing.length} missing, ${fields.optionDrift.length} with option drift.`,
          `Membership: ${membership.onBoard}/${membership.flowPackTotal} flow-pack items on board; ${membership.flowPackNotOnBoard.length} missing; ${membership.boardItemsNotFlowPack.length} board items without flow-pack.`,
          `Label↔field sync: ${labelFieldSync.mismatches.length} mismatches, ${labelFieldSync.missingFieldValues.length} labeled-but-unset field values across ${labelFieldSync.itemsChecked} items (${kindNote(labelFieldSync.byKind)}).`,
          `Status coherence: ${statusCoherence.closedNotDone.length} closed-not-Done, ${statusCoherence.doneButOpen.length} Done-but-open (legal under one-directional sync; measured).`,
          `Score gate signal: ${scoreGate.missingScore.length}/${scoreGate.epicsChecked} epics missing Score; ${scoreGate.belowGateOffBacklog.length} below ${SHIP_GATE} while off Backlog.`,
        ],
    inferred: access.degraded
      ? []
      : [
          'Labeled-but-unset field values predate fpat-project-sync.yml or missed its triggers — candidates for a manual workflow_dispatch re-sync, not auto-fixed here.',
          'PullRequest-side sync gaps are structural, not re-sync candidates — fpat-project-sync.yml triggers on issue events only; the per-kind counts are the data for the parked PR-event-sync decision (measured here, decided nowhere).',
          'closed-not-Done items reflect the deliberate one-directional sync (issue state never drives Status automatically).',
        ],
    proven: access.degraded
      ? ['The degraded path itself: the audit runs, reports access state, and exits 0 without project access.']
      : [
          'Board metadata, field catalog, and item field values are durable Projects v2 state readable via gh project (read-only).',
          'Membership and sync findings are exact set comparisons, not heuristics.',
        ],
    notProven: access.degraded
      ? [
          'Board metadata/visibility vs board-spec (not measured — no access).',
          'Field catalog and option integrity (not measured).',
          'flow-pack ↔ board membership (not measured).',
          'Label ↔ Type/Phase/Area field sync (not measured).',
          'Status ↔ issue-state coherence (not measured).',
          'Epic Score ship-gate signal (not measured).',
          'Whether FPAT IMPROVED delivery — single baseline (n=1), no comparison cohort.',
        ]
      : [
          'WHY any field value drifted (sync-trigger history is non-stationary; only current state is read).',
          'That closed-not-Done items are errors — one-directional sync makes manual Status updates the designed mechanism.',
          'Whether FPAT IMPROVED delivery — single baseline (n=1), no comparison cohort.',
        ],
    confidence: access.degraded ? 'low' : 'medium',
  };

  BoardConsistencyReportSchema.parse(report); // internal-error guard only; never gates on metric values
  const path = writeReport('board-consistency', report);

  console.log(`[board-consistency] wrote ${path}`);
  console.log(`  access: ${access.tokenSource}${access.degraded ? ` (degraded: ${access.probeError})` : ''}`);
  if (!access.degraded) {
    console.log(`  board: "${board.title}" #${projectNumber} ${board.visibility}, ${board.itemCount} items`);
    console.log(`  fields: missing ${fields.missing.length}, option drift ${fields.optionDrift.length}`);
    console.log(`  membership: ${membership.onBoard}/${membership.flowPackTotal} on board, ${membership.flowPackNotOnBoard.length} missing, ${membership.boardItemsNotFlowPack.length} non-flow-pack on board`);
    console.log(`  label↔field: ${labelFieldSync.mismatches.length} mismatches, ${labelFieldSync.missingFieldValues.length} unset (${kindNote(labelFieldSync.byKind)})`);
    console.log(`  status: ${statusCoherence.closedNotDone.length} closed-not-Done, ${statusCoherence.doneButOpen.length} Done-but-open`);
    console.log(`  score: ${scoreGate.missingScore.length}/${scoreGate.epicsChecked} epics missing Score, ${scoreGate.belowGateOffBacklog.length} below ${SHIP_GATE} off Backlog`);
  }
}

main().catch((err) => {
  console.error('[board-consistency] INTERNAL ERROR (not a metric failure):', err.message);
  process.exit(1);
});
