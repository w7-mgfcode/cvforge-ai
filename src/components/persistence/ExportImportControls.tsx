'use client';

import React, { useRef } from 'react';
import { Download, Upload } from 'lucide-react';

interface ExportImportControlsProps {
  /** Invoked when the user clicks Export. Serialization lands in #146. */
  onExport: () => void;
  /** Invoked with the chosen file when the user picks one. Parsing lands in #147. */
  onImportFile: (file: File) => void;
}

/**
 * Studio footer chrome for the JSON export/import round-trip (epic #132).
 * Pure controlled chrome: both handlers are passed in from the page owner
 * (`src/app/studio/page.tsx`), which keeps document state and persistence
 * logic out of this component.
 */
export function ExportImportControls({ onExport, onImportFile }: ExportImportControlsProps) {
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
