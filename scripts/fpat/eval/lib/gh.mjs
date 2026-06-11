// scripts/fpat/eval/lib/gh.mjs — read-only `gh` JSON wrappers. NO write commands here.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Offline fixture mode: when FPAT_EVAL_FIXTURES points at a fixture dir
// (scripts/fpat/eval/__fixtures__/<set>), every wrapper returns its canonical
// fixture file instead of spawning gh — fully deterministic, no GitHub access.
// A missing fixture file throws with a path-free, deterministic message; the
// board-consistency probe turns that into its degraded path.
const FIXTURES = (process.env.FPAT_EVAL_FIXTURES || '').trim();

function fixture(name) {
  try {
    return JSON.parse(readFileSync(join(FIXTURES, name), 'utf8'));
  } catch {
    throw new Error(`fixture not found or invalid: ${name}`);
  }
}

function gh(args) {
  // READ-ONLY commands only. Throws on non-zero exit; callers handle.
  const out = execFileSync('gh', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  return JSON.parse(out);
}

export function listClosedIssues({ label = 'flow-pack', limit = 1000 } = {}) {
  if (FIXTURES) return fixture('issues-closed.json');
  return gh([
    'issue', 'list', '--state', 'closed', '--label', label, '--limit', String(limit),
    '--json', 'number,title,createdAt,closedAt,labels,milestone,state',
  ]);
}

export function listMergedPRs({ limit = 1000 } = {}) {
  if (FIXTURES) return fixture('prs-merged.json');
  return gh([
    'pr', 'list', '--state', 'merged', '--limit', String(limit),
    '--json', 'number,title,createdAt,mergedAt,headRefName,labels,milestone',
  ]);
}

export function listAllIssues({ limit = 1000 } = {}) {
  if (FIXTURES) return fixture('issues-all.json');
  return gh([
    'issue', 'list', '--state', 'all', '--limit', String(limit),
    '--json', 'number,title,state,labels',
  ]);
}

export function listAllPRs({ limit = 1000 } = {}) {
  if (FIXTURES) return fixture('prs-all.json');
  return gh([
    'pr', 'list', '--state', 'all', '--limit', String(limit),
    '--json', 'number,title,state,labels,headRefName,body,createdAt,mergedAt',
  ]);
}

export function listRuns(workflowFile, { limit = 1000 } = {}) {
  if (FIXTURES) return fixture(`runs-${workflowFile.replace(/\.yml$/, '')}.json`);
  return gh([
    'run', 'list', '--workflow', workflowFile, '--limit', String(limit),
    '--json', 'databaseId,conclusion,status,createdAt,updatedAt,event',
  ]);
}

// ---------------------------------------------------------------------------
// Projects v2 (read-only) — domain-4 board-consistency audit.
// User-owned Projects v2 needs the `project` scope on the gh login, OR a read-only
// FPAT_PROJECT_TOKEN passed via opts.token. The token is applied ONLY to the spawned
// gh process env (per-call GH_TOKEN); repo-side calls above keep normal auth.
// Callers handle throws (no access → degraded report, never a crash).
// ---------------------------------------------------------------------------

function ghProject(args, token) {
  const env = token ? { ...process.env, GH_TOKEN: token } : process.env;
  const out = execFileSync('gh', args, {
    encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, env, stdio: ['ignore', 'pipe', 'pipe'],
  });
  return JSON.parse(out);
}

export function viewProject(number, owner, { token } = {}) {
  if (FIXTURES) return fixture('project-view.json');
  return ghProject(['project', 'view', String(number), '--owner', owner, '--format', 'json'], token);
}

export function listProjectFields(number, owner, { token, limit = 100 } = {}) {
  if (FIXTURES) return fixture('project-fields.json');
  return ghProject([
    'project', 'field-list', String(number), '--owner', owner,
    '--format', 'json', '--limit', String(limit),
  ], token);
}

export function listProjectItems(number, owner, { token, limit = 1000 } = {}) {
  if (FIXTURES) return fixture('project-items.json');
  return ghProject([
    'project', 'item-list', String(number), '--owner', owner,
    '--format', 'json', '--limit', String(limit),
  ], token);
}

// Optional, best-effort: native sub-issue counts per epic (normal auth, issues:read).
// Degrades to null if unavailable — Phase-1 does NOT depend on this and needs no PAT.
export function subIssueCount(issueNumber, owner, repo) {
  try {
    if (FIXTURES) {
      const map = fixture('subissue-counts.json'); // missing file -> catch -> null (best-effort)
      return map[String(issueNumber)] ?? null;
    }
    const data = gh([
      'api', 'graphql', '-f', `query=
        query($owner:String!,$repo:String!,$n:Int!){
          repository(owner:$owner,name:$repo){
            issue(number:$n){ subIssues(first:100){ totalCount } }
          }
        }`,
      '-F', `owner=${owner}`, '-F', `repo=${repo}`, '-F', `n=${issueNumber}`,
    ]);
    return data?.data?.repository?.issue?.subIssues?.totalCount ?? null;
  } catch {
    return null;
  }
}
