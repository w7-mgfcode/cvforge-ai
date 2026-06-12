'use client';

import React, { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { subscribeSaveState, type SaveState } from '@/lib/storage';

/**
 * Persistent, non-blocking warning shown while storage is in `unavailable`
 * no-op mode (private browsing, blocked storage, zero quota). Honest failure
 * beats silent pretend-saving: the studio keeps working fully in memory and
 * this banner only states that nothing will persist.
 *
 * Binds EXCLUSIVELY to the storage module's `subscribeSaveState` seam — the
 * same subscription `SaveStateBadge` uses. The subscription replays the
 * current state synchronously on subscribe, so the banner is correct from
 * first paint with zero props; the effect's returned unsubscribe runs on
 * unmount, so no callback outlives the component.
 *
 * ONLY the `unavailable` state renders anything. A one-off `error` (e.g. a
 * single quota-exceeded write) must NOT trigger it — transient failures are
 * the badge's concern; this banner reflects the module's flagged no-op mode.
 * No retry logic, no quota management, no dismissal persistence.
 *
 * Anchored to the bottom edge beside the 64px workflow nav so it stays
 * visible across all three workflow views without occluding any control
 * (`pointer-events-none` — editing must visibly continue to work). Yellow
 * palette mirrors the HUD compilation-warning rows in `studio/page.tsx`.
 * Hidden in print via `print:hidden`.
 */
export function StorageWarningBanner() {
  const [saveState, setSaveState] = useState<SaveState>('idle');

  useEffect(() => subscribeSaveState(setSaveState), []);

  if (saveState !== 'unavailable') {
    return null;
  }

  return (
    <div
      role="status"
      data-storage-warning="unavailable"
      className="fixed bottom-4 left-20 z-30 pointer-events-none flex items-start space-x-2 text-xs text-yellow-300 bg-yellow-950/20 border border-yellow-900/60 p-2.5 rounded shadow-lg print:hidden"
    >
      <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
      <span className="font-sans leading-normal">
        Saving unavailable — changes are kept in memory only
      </span>
    </div>
  );
}
