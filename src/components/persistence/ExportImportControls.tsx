'use client';

import React, { useRef } from 'react';
import { AlertCircle, Download, Upload, X } from 'lucide-react';
import type { ImportError } from '@/lib/import-export';

interface ExportImportControlsProps {
  /** Invoked when the user clicks Export. Serialization lands in #146. */
  onExport: () => void;
  /** Invoked with the chosen file when the user picks one. Parsing lands in #147. */
  onImportFile: (file: File) => void;
  /**
   * Latest import failure (#148). The page owner parks every
   * `importDocumentFromFile` result here — `null` on success/cancel — so the
   * surface auto-clears on the next attempt without extra wiring.
   */
  importError?: ImportError | null;
  /** Invoked when the user dismisses the error (X). Owner nulls the state. */
  onDismissError?: () => void;
}

/**
 * Studio footer chrome for the JSON export/import round-trip (epic #132).
 * Pure controlled chrome: both handlers are passed in from the page owner
 * (`src/app/studio/page.tsx`), which keeps document state and persistence
 * logic out of this component.
 *
 * Also renders the SINGLE inline import-error surface (#148): each
 * `ImportError` member already carries a distinct human-readable `message`
 * (top-level reason + first Zod issue path where applicable), so the element
 * renders it directly off the `kind`/`message` pair. Red treatment mirrors
 * the existing error chrome (`CopilotDiffPanel` missing-keywords panel);
 * `data-import-error` exposes the failure class for browser verification.
 */
export function ExportImportControls({
  onExport,
  onImportFile,
  importError,
  onDismissError
}: ExportImportControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImportFile(file);
    }
    // Clear the value so re-selecting the same file re-fires the change event.
    event.target.value = '';
  };

  return (
    <div className="flex items-center space-x-2 print:hidden">
      {importError && (
        <div
          role="alert"
          data-import-error={importError.kind}
          className="flex min-w-0 items-center space-x-1.5 max-w-sm px-2 py-1 bg-red-950/20 border border-red-900/60 rounded text-[11px] text-red-300 print:hidden"
        >
          <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
          <span className="truncate font-sans" title={importError.message}>
            <span className="font-bold text-red-400">Import failed:</span> {importError.message}
          </span>
          <button
            type="button"
            onClick={onDismissError}
            aria-label="Dismiss import error"
            title="Dismiss"
            className="p-0.5 text-red-400 hover:text-red-200 rounded transition-colors flex-shrink-0"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
      <button
        type="button"
        onClick={onExport}
        title="Export document as JSON"
        className="px-4 py-1.5 bg-workspace-card hover:bg-workspace-border text-slate-200 border border-workspace-border rounded text-xs font-bold shadow-md transition-all flex items-center space-x-1.5"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Export JSON</span>
      </button>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        title="Import document from JSON"
        className="px-4 py-1.5 bg-workspace-card hover:bg-workspace-border text-slate-200 border border-workspace-border rounded text-xs font-bold shadow-md transition-all flex items-center space-x-1.5"
      >
        <Upload className="w-3.5 h-3.5" />
        <span>Import JSON</span>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
