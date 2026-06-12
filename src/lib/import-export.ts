import { createEnvelope } from '@/lib/storage';
import type { CVDocument } from '@/schemas/cv.schema';

/**
 * Export serialization for the studio's CVDocument (#146).
 *
 * The document is downloaded wrapped in the same v1 {@link createEnvelope}
 * shape the persistence layer writes, so an exported file is re-parseable by
 * `src/lib/storage.ts`'s load path (and by the file import landing in #147).
 *
 * This module must stay side-effect-free at module scope: the app is built
 * with `output: 'export'`, so importing pages are pre-rendered at build time
 * where `document`/`URL` do not exist. All DOM access happens inside
 * {@link exportDocument}, which only ever runs from a click handler.
 */

/** Base filename used when the candidate name yields no usable slug. */
const FALLBACK_BASENAME = 'cv-export';

/**
 * Lowercase kebab-case slug derived from a candidate name. Diacritics are
 * folded to their ASCII base letters (NFKD + combining-mark strip); every
 * other non-alphanumeric run collapses to a single hyphen. Returns an empty
 * string when nothing usable survives — e.g. an empty name or one written
 * entirely in a non-Latin script — so callers can apply the
 * `cv-export` fallback at the filename level.
 */
export function slugifyCandidateName(name: string): string {
  return name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Local-date stamp in `YYYY-MM-DD` form for the export filename. */
function formatDateStamp(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Build the download filename: `cv-{slug}-{YYYY-MM-DD}.json`. Empty and
 * unicode-heavy names that produce no slug fall back to the
 * `cv-export-{YYYY-MM-DD}.json` form (acceptance-pinned fallback).
 */
export function buildExportFilename(name: string, now: Date = new Date()): string {
  const slug = slugifyCandidateName(name);
  const base = slug ? `cv-${slug}` : FALLBACK_BASENAME;
  return `${base}-${formatDateStamp(now)}.json`;
}

/**
 * Serialize `doc` into a pretty-printed v1 storage envelope and trigger a
 * browser download via Blob + `<a download>`. The object URL is revoked
 * immediately after the synthetic click (acceptance-pinned — the click
 * captures its own reference to the Blob, so revoking does not abort the
 * download and no object URL is leaked).
 */
export function exportDocument(doc: CVDocument): void {
  const json = JSON.stringify(createEnvelope(doc), null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = buildExportFilename(doc.content.candidateIdentity.fullName);
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
