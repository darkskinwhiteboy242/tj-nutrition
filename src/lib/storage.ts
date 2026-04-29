'use client';

import { openDB, type IDBPDatabase } from 'idb';
import type { AppState, DailyState } from './types';
import { todayISO } from './utils';
import { getDefaultDailyFoodIds } from './foodLibrary';

const DB_NAME = 'tj-nutrition';
const DB_VERSION = 1;

type PendingItem = {
  id: string;
  type: 'log' | 'state' | 'library';
  payload: unknown;
  timestamp: number;
};

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB(): Promise<IDBPDatabase> {
  if (typeof window === 'undefined') {
    throw new Error('IndexedDB not available on server');
  }
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('state')) {
          db.createObjectStore('state');
        }
        if (!db.objectStoreNames.contains('pendingSync')) {
          db.createObjectStore('pendingSync', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

export function emptyDailyState(date = todayISO()): DailyState {
  return {
    date,
    logs: [],
    steps: 0,
    activeCalories: 0,
    waterOz: 0,
  };
}

export function defaultAppState(): AppState {
  const date = todayISO();
  return {
    today: emptyDailyState(date),
    history: {},
    customFoods: [],
    archivedDefaults: [],
    checklist: { foodIds: getDefaultDailyFoodIds() },
    flags: {
      goingOutTonight: false,
      travelMode: false,
      isGymDay: true,
      todaysSplit: 'arms',
    },
    theme: 'dark',
    streak: 0,
    lastStreakDate: '',
  };
}

export async function loadState(): Promise<AppState> {
  if (typeof window === 'undefined') return defaultAppState();
  try {
    const db = await getDB();
    const stored = (await db.get('state', 'main')) as AppState | undefined;
    if (!stored) return defaultAppState();
    const today = todayISO();
    if (stored.today.date !== today) {
      const next: AppState = {
        ...stored,
        history: {
          ...stored.history,
          [stored.today.date]: stored.today,
        },
        today: emptyDailyState(today),
      };
      await saveState(next);
      return next;
    }
    return stored;
  } catch {
    return defaultAppState();
  }
}

export async function saveState(state: AppState): Promise<void> {
  if (typeof window === 'undefined') return;
  const db = await getDB();
  await db.put('state', state, 'main');
}

export async function queueSync(item: Omit<PendingItem, 'id' | 'timestamp'>): Promise<void> {
  if (typeof window === 'undefined') return;
  const db = await getDB();
  const id = crypto.randomUUID();
  await db.put('pendingSync', { ...item, id, timestamp: Date.now() });
}

export async function drainSync(): Promise<PendingItem[]> {
  if (typeof window === 'undefined') return [];
  const db = await getDB();
  const items = (await db.getAll('pendingSync')) as PendingItem[];
  return items;
}

export async function clearSyncItem(id: string): Promise<void> {
  if (typeof window === 'undefined') return;
  const db = await getDB();
  await db.delete('pendingSync', id);
}
