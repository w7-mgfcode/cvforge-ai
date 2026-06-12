'use client';

import React, { useState } from 'react';
import { RotateCcw, Trash2, X } from 'lucide-react';
import { clearDocument } from '@/lib/storage';

interface ResetToSampleControlProps {
  /**
   * Restores the page-owned document to the sample. The page passes
   * `() => setCvData(sampleCV)` — controlled-component pattern, the page
   * stays the single owner of document state.
   */
  onReset: () => void;
}

/**
 * Reset-to-sample escape hatch for the studio footer chrome (issue #151).
 *
 * Destructive action, so the confirm step is mandatory: an inline two-step
 * confirm (idle button → compact confirm row) matching the dense footer
 * style, instead of a `window.confirm` dialog. Cancel returns to the idle
 * button with zero state change.
 *
 * On confirm this component clears persistence itself via `clearDocument()`
 * (which removes both the main and backup storage keys and publishes the
 * `idle` save-state), then invokes `onReset` so the page restores sampleCV.
 * The page's autosave effect will persist sampleCV on the next debounce
 * tick — expected, it matches the established initial-save semantics.
 */
export function ResetToSampleControl({ onReset }: ResetToSampleControlProps) {
  const [confirming, setConfirming] = useState(false);

  const handleConfirm = () => {
    setConfirming(false);
    clearDocument();
    onReset();
  };

  if (confirming) {
    return (
      <div
        role="group"
        aria-label="Confirm reset to sample document"
        className="flex items-center space-x-2 print:hidden"
      >
        <span className="text-[10px] font-mono text-yellow-300 whitespace-nowrap">
          Erase saved data?
        </span>
        <button
          type="button"
          onClick={handleConfirm}
          title="Erase saved data and reset to the sample document"
          className="px-3 py-1.5 bg-red-700 hover:bg-red-600 text-white rounded text-xs font-bold shadow-md transition-all flex items-center space-x-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          title="Cancel — keep the current document"
          className="px-3 py-1.5 bg-workspace-card hover:bg-workspace-border text-slate-200 border border-workspace-border rounded text-xs font-bold shadow-md transition-all flex items-center space-x-1.5"
        >
          <X className="w-3.5 h-3.5" />
          <span>Cancel</span>
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      title="Reset to sample document (clears saved data)"
      className="px-4 py-1.5 bg-workspace-card hover:bg-workspace-border text-slate-200 border border-workspace-border rounded text-xs font-bold shadow-md transition-all flex items-center space-x-1.5 print:hidden"
    >
      <RotateCcw className="w-3.5 h-3.5" />
      <span>Reset</span>
    </button>
  );
}
