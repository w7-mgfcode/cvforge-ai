'use client';

import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  Check,
  Cloud,
  CloudOff,
  Loader2,
  type LucideIcon,
} from 'lucide-react';
import { subscribeSaveState, type SaveState } from '@/lib/storage';

/**
 * Icon-scale save-status indicator for the studio's 64px left nav.
 *
 * Binds EXCLUSIVELY to the storage module's `subscribeSaveState` seam — never
 * to `studio/page.tsx` state, autosave internals, or props carrying save
 * state. The subscription emits the current state synchronously on subscribe,
 * so the component needs no separate getter and works with zero props.
 *
 * Sized and styled to mirror the existing `r{n}` revision badge it sits
 * beside (w-8 h-8 rounded-full bg-slate-800). No text label — a `title`
 * attribute is the only tooltip surface. Hidden in print via `print:hidden`
 * (and the nav itself is already chrome-hidden by `src/styles/print.css`).
 */

interface StateVisual {
  icon: LucideIcon;
  /** Icon tone — theme/palette classes only, no one-off colors. */
  tone: string;
  /** Tooltip + accessible label for the icon-only badge. */
  label: string;
  spin?: boolean;
}

const STATE_VISUALS: Record<SaveState, StateVisual> = {
  idle: {
    icon: Cloud,
    tone: 'text-slate-500',
    label: 'Autosave idle — nothing persisted yet this session',
  },
  saving: {
    icon: Loader2,
    tone: 'text-workspace-accent',
    label: 'Saving changes…',
    spin: true,
  },
  saved: {
    icon: Check,
    tone: 'text-emerald-500',
    label: 'All changes saved',
  },
  error: {
    icon: AlertCircle,
    tone: 'text-yellow-500',
    label: 'Save failed — recent changes are kept in memory only',
  },
  unavailable: {
    icon: CloudOff,
    tone: 'text-slate-500',
    label: 'Storage unavailable — changes will not persist',
  },
};

interface SaveStateBadgeProps {
  /** Cosmetic-only extension point (e.g. nav spacing). Never save state. */
  className?: string;
}

export function SaveStateBadge({ className = '' }: SaveStateBadgeProps) {
  const [saveState, setSaveState] = useState<SaveState>('idle');

  // Subscribe on mount; `subscribeSaveState` immediately replays the current
  // state, then pushes every transition. The returned unsubscribe runs on
  // unmount, so no callback outlives the component.
  useEffect(() => subscribeSaveState(setSaveState), []);

  const { icon: Icon, tone, label, spin } = STATE_VISUALS[saveState];

  return (
    <div
      role="status"
      aria-label={label}
      title={label}
      data-save-state={saveState}
      className={`w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center ${tone} print:hidden ${className}`}
    >
      <Icon className={spin ? 'w-4 h-4 animate-spin' : 'w-4 h-4'} />
    </div>
  );
}
