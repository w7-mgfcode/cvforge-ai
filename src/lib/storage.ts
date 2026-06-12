import { z } from 'zod';
import { CVDocumentSchema, type CVDocument } from '@/schemas/cv.schema';
import { sampleCV } from '@/data/sample-cv';

/**
 * Versioned client-side persistence contract for the studio's CVDocument.
 *
 * The document is stored wrapped in a {@link StorageEnvelope} so the storage
 * shape can evolve independently of `CVDocumentSchema` (envelope versioning —
 * the schema lock-step is never triggered by persistence changes).
 *
 * This module must stay side-effect-free at module scope: the app is built
 * with `output: 'export'`, so importing pages are pre-rendered at build time
 * where `window`/`localStorage` do not exist. All storage access happens
 * inside the exported functions.
 */

/** Version of the storage envelope shape (not of `CVDocumentSchema`). */
export const SCHEMA_VERSION = 1;

/** localStorage key holding the current {@link StorageEnvelope}. */
export const STORAGE_KEY = 'cvforge.document';

/**
 * localStorage key preserving the last payload that failed validation, so a
 * corrupt document is never silently destroyed by the sample-CV fallback.
 */
export const BACKUP_KEY = 'cvforge.document.backup';

/** Persisted wrapper around a {@link CVDocument}. */
export interface StorageEnvelope {
  /** Envelope shape version — always {@link SCHEMA_VERSION} for v1 writes. */
  schemaVersion: number;
  /** ISO-8601 timestamp of the write; drives the last-write-wins guard. */
  savedAt: string;
  /** The validated CV document. */
  doc: CVDocument;
}

/**
 * Save lifecycle published through {@link subscribeSaveState}:
 * - `idle` — nothing persisted yet this session.
 * - `saving` — a write is in flight.
 * - `saved` — the last write landed.
 * - `error` — the last write failed (e.g. quota exceeded).
 * - `unavailable` — storage cannot be used; the module is in no-op mode.
 */
export type SaveState = 'idle' | 'saving' | 'saved' | 'error' | 'unavailable';

/** Result of {@link loadDocument}. */
export interface LoadResult {
  /** The document to hydrate the studio with — never null. */
  doc: CVDocument;
  /** `'storage'` when a valid envelope was read, `'fallback'` otherwise. */
  source: 'storage' | 'fallback';
  /** False when storage is missing or blocked (private mode, SSR, etc.). */
  storageAvailable: boolean;
}

/** Result of {@link saveDocument}. */
export type SaveResult =
  /** The envelope was written. */
  | { status: 'saved'; savedAt: string }
  /** Storage holds a strictly newer `savedAt`; the write was refused. */
  | { status: 'skipped-newer'; storedSavedAt: string }
  /** Storage is missing, blocked, or the write failed (e.g. quota). */
  | { status: 'unavailable' };

/** Callback receiving {@link SaveState} transitions. */
export type SaveStateListener = (state: SaveState) => void;

/** Function returned by {@link subscribeSaveState}; removes the listener. */
export type Unsubscribe = () => void;

/**
 * Envelope shell — the inner doc is validated separately with
 * `CVDocumentSchema.safeParse` so a future v2 migration can hook in between
 * the version check and the document check.
 */
const EnvelopeShellSchema = z.object({
  schemaVersion: z.literal(SCHEMA_VERSION),
  savedAt: z.string(),
  doc: z.unknown()
});

/**
 * Resolve localStorage inside a function body (never at module scope —
 * static export pre-renders at build time). Returns null when storage is
 * missing or property access itself throws (e.g. blocked storage).
 */
function getStorage(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

/**
 * Preserve a payload that failed validation under {@link BACKUP_KEY} so the
 * fallback never silently destroys user data. Best-effort: a failing backup
 * write (e.g. quota) must not block the fallback itself.
 */
function preserveCorruptPayload(storage: Storage, raw: string): void {
  try {
    storage.setItem(BACKUP_KEY, raw);
  } catch {
    // Quota or blocked write — the fallback still proceeds.
  }
}

/**
 * Read and validate the stored envelope.
 *
 * Any failure — missing key, invalid JSON, wrong envelope shape, wrong
 * `schemaVersion`, or a doc failing `CVDocumentSchema.safeParse` — resolves
 * to the sample-CV fallback without throwing. A corrupt payload is preserved
 * under {@link BACKUP_KEY} before falling back; a merely missing key is not
 * a corruption and writes no backup.
 */
export function loadDocument(): LoadResult {
  const storage = getStorage();
  if (!storage) {
    return { doc: sampleCV, source: 'fallback', storageAvailable: false };
  }

  let raw: string | null;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return { doc: sampleCV, source: 'fallback', storageAvailable: false };
  }
  if (raw === null) {
    return { doc: sampleCV, source: 'fallback', storageAvailable: true };
  }

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    preserveCorruptPayload(storage, raw);
    return { doc: sampleCV, source: 'fallback', storageAvailable: true };
  }

  const shell = EnvelopeShellSchema.safeParse(payload);
  if (!shell.success) {
    preserveCorruptPayload(storage, raw);
    return { doc: sampleCV, source: 'fallback', storageAvailable: true };
  }

  const doc = CVDocumentSchema.safeParse(shell.data.doc);
  if (!doc.success) {
    preserveCorruptPayload(storage, raw);
    return { doc: sampleCV, source: 'fallback', storageAvailable: true };
  }

  return { doc: doc.data, source: 'storage', storageAvailable: true };
}

/**
 * Wrap `doc` in a v1 envelope with a fresh `savedAt` and persist it.
 *
 * Refuses to overwrite an envelope carrying a strictly newer `savedAt`
 * (last-write-wins guard). Never throws: quota and availability failures
 * surface as {@link SaveResult} values.
 */
export function saveDocument(doc: CVDocument): SaveResult {
  void doc;
  throw new Error('Not implemented — lands with #137.');
}

/**
 * Remove the persisted document and its backup (both {@link STORAGE_KEY} and
 * {@link BACKUP_KEY}). Safe to call when storage is unavailable.
 */
export function clearDocument(): void {
  throw new Error('Not implemented — lands with #137.');
}

/**
 * Subscribe to {@link SaveState} transitions emitted by the save/clear paths.
 *
 * This is the only seam UI save-status surfaces may bind to — consumers must
 * never reach into this module's internals.
 */
export function subscribeSaveState(listener: SaveStateListener): Unsubscribe {
  void listener;
  throw new Error('Not implemented — lands with #138.');
}
