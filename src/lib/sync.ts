'use client';

import { drainSync, clearSyncItem } from './storage';
import type { AppState } from './types';

export async function pushState(state: AppState): Promise<void> {
  try {
    await fetch('/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state),
    });
  } catch {
    // offline; will retry next time
  }
}

export async function pullState(): Promise<AppState | null> {
  try {
    const res = await fetch('/api/state');
    if (!res.ok) return null;
    const data = await res.json();
    return (data?.state as AppState) ?? null;
  } catch {
    return null;
  }
}

export async function fetchSteps(date: string): Promise<{ steps: number; activeCalories: number } | null> {
  try {
    const res = await fetch(`/api/health/steps?date=${date}`);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      steps: typeof data.steps === 'number' ? data.steps : 0,
      activeCalories: typeof data.activeCalories === 'number' ? data.activeCalories : 0,
    };
  } catch {
    return null;
  }
}

export async function flushPending(): Promise<void> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) return;
  const items = await drainSync();
  for (const item of items) {
    try {
      if (item.type === 'state') {
        await fetch('/api/state', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.payload),
        });
      }
      await clearSyncItem(item.id);
    } catch {
      // try again later
    }
  }
}
