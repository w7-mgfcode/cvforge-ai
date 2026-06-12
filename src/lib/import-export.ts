import type { ZodError } from 'zod';
import { createEnvelope, EnvelopeShellSchema, SCHEMA_VERSION } from '@/lib/storage';
import { CVDocumentSchema, type CVDocument } from '@/schemas/cv.schema';

/**
 * Export serialization (#146) and file-import parse pipeline (#147) for the
 * studio's CVDocument.
 *
 * The document is downloaded wrapped in the same v1 {@link createEnvelope}
 * shape the persistence layer writes, so an exported file is re-parseable by
 * `src/lib/storage.ts`'s load path and by {@link parseImportFile}, which
 * reuses storage's {@link EnvelopeShellSchema} (never a duplicate schema).
 *
 * This module must stay side-effect-free at module scope: the app is built
 * with `output: 'export'`, so importing pages are pre-rendered at build time
 * where `document`/`URL`/`window` do not exist. All DOM access happens inside
 * {@link exportDocument} / {@link importDocumentFromFile}, which only ever
 * run from user-event handlers.
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

/**
 * Discriminated import failure (#147). Every member carries a human-readable
 * `message`, so #148's inline error surface can render any result directly
 * off the `kind`/`message` pair without re-deriving details.
 */
export type ImportError =
  /** The picked file could not be read from disk. */
  | { kind: 'file-read'; message: string }
  /** The file content is not valid JSON. */
  | { kind: 'invalid-json'; message: string }
  /** The payload declares a `schemaVersion` other than {@link SCHEMA_VERSION}. */
  | { kind: 'wrong-version'; message: string; foundVersion: unknown }
  /** The payload is not a v1 storage envelope ({@link EnvelopeShellSchema}). */
  | { kind: 'invalid-envelope'; message: string; firstIssuePath: string }
  /** The envelope's `doc` payload fails `CVDocumentSchema`. */
  | { kind: 'invalid-document'; message: string; firstIssuePath: string };

/** Typed result of {@link parseImportFile}. */
export type ImportParseResult =
  | { ok: true; doc: CVDocument }
  | { ok: false; error: ImportError };

/** Dotted path of the first Zod issue, e.g. `doc.content.skillsInventory.2.name`. */
function firstIssuePath(error: ZodError, prefix = ''): string {
  const path = error.issues[0]?.path.join('.') ?? '';
  if (prefix && path) {
    return `${prefix}.${path}`;
  }
  return prefix || path || '(root)';
}

/**
 * Parse exported-file text into a {@link CVDocument}: JSON parse → explicit
 * `schemaVersion` check → envelope-shell `safeParse` (reused from
 * `src/lib/storage.ts`) → `CVDocumentSchema.safeParse` on the envelope's
 * `doc` payload. Pure and synchronous; never throws and mutates nothing —
 * callers decide what to do with the typed result.
 */
export function parseImportFile(text: string): ImportParseResult {
  let payload: unknown;
  try {
    payload = JSON.parse(text);
  } catch {
    return {
      ok: false,
      error: { kind: 'invalid-json', message: 'The file is not valid JSON.' }
    };
  }

  // A mismatched version is reported as its own kind before the shell parse —
  // the shell's `z.literal(SCHEMA_VERSION)` would otherwise fold it into a
  // generic shape failure.
  if (payload !== null && typeof payload === 'object') {
    const { schemaVersion } = payload as { schemaVersion?: unknown };
    if (schemaVersion !== undefined && schemaVersion !== SCHEMA_VERSION) {
      return {
        ok: false,
        error: {
          kind: 'wrong-version',
          message: `Unsupported schemaVersion ${JSON.stringify(schemaVersion)} — this build reads version ${SCHEMA_VERSION}.`,
          foundVersion: schemaVersion
        }
      };
    }
  }

  const shell = EnvelopeShellSchema.safeParse(payload);
  if (!shell.success) {
    const path = firstIssuePath(shell.error);
    return {
      ok: false,
      error: {
        kind: 'invalid-envelope',
        message: `The file is not a CVForge export envelope (first problem at: ${path}).`,
        firstIssuePath: path
      }
    };
  }

  const doc = CVDocumentSchema.safeParse(shell.data.doc);
  if (!doc.success) {
    const path = firstIssuePath(doc.error, 'doc');
    return {
      ok: false,
      error: {
        kind: 'invalid-document',
        message: `The envelope's document fails the CV schema (first problem at: ${path}).`,
        firstIssuePath: path
      }
    };
  }

  return { ok: true, doc: doc.data };
}

/**
 * Full import flow for the studio's file-input path (#147): read the file via
 * `file.text()`, run {@link parseImportFile}, and — only on a valid parse —
 * ask for explicit confirmation before handing the parsed document to
 * `applyDocument` (a whole-document replacement, e.g. `setCvData`).
 *
 * Returns the {@link ImportError} on any failure and `null` on success or
 * cancel, so the page can park the latest error in state for #148's error
 * surface. On failure or cancel `applyDocument` is never called — the current
 * document is untouched. `window.confirm` is the #147-approved confirm
 * surface; this function runs only from the file-input change handler, never
 * at module scope (static-export safe).
 */
export async function importDocumentFromFile(
  file: File,
  applyDocument: (doc: CVDocument) => void
): Promise<ImportError | null> {
  let text: string;
  try {
    text = await file.text();
  } catch {
    return { kind: 'file-read', message: `Could not read "${file.name}".` };
  }

  const result = parseImportFile(text);
  if (!result.ok) {
    return result.error;
  }

  const confirmed = window.confirm(
    `Import "${file.name}"?\n\nThis will replace the entire current document (content, design, and metadata).`
  );
  if (confirmed) {
    applyDocument(result.doc);
  }
  return null;
}
