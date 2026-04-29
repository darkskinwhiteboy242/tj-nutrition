'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { AppState, LogEntry, Food, MealSection } from '@/lib/types';
import { defaultAppState, loadState, saveState, queueSync } from '@/lib/storage';
import { flushPending, fetchSteps } from '@/lib/sync';
import { todayISO, uid } from '@/lib/utils';

export function useAppState() {
  const [state, setState] = useState<AppState>(() => defaultAppState());
  const [hydrated, setHydrated] = useState(false);
  const writeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let mounted = true;
    loadState().then((s) => {
      if (mounted) {
        setState(s);
        setHydrated(true);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const persist = useCallback(async (next: AppState) => {
    await saveState(next);
    if (writeTimer.current) clearTimeout(writeTimer.current);
    writeTimer.current = setTimeout(() => {
      void queueSync({ type: 'state', payload: next });
      void flushPending();
    }, 800);
  }, []);

  const update = useCallback(
    (mutator: (prev: AppState) => AppState) => {
      setState((prev) => {
        const next = mutator(prev);
        void persist(next);
        return next;
      });
    },
    [persist]
  );

  const logFood = useCallback(
    (food: Food, mealSection: MealSection, status: 'planned' | 'eaten' = 'eaten', portionMultiplier = 1) => {
      const entry: LogEntry = {
        id: uid(),
        foodId: food.id,
        name: food.name,
        calories: Math.round(food.calories * portionMultiplier),
        protein: Math.round(food.protein * portionMultiplier),
        fiber: Math.round(food.fiber * portionMultiplier),
        status,
        mealSection,
        loggedAt: Date.now(),
        date: todayISO(),
        portionMultiplier,
      };
      update((prev) => ({
        ...prev,
        today: { ...prev.today, logs: [...prev.today.logs, entry] },
      }));
      return entry;
    },
    [update]
  );

  const togglePlannedToEaten = useCallback(
    (logId: string) => {
      update((prev) => ({
        ...prev,
        today: {
          ...prev.today,
          logs: prev.today.logs.map((l) =>
            l.id === logId ? { ...l, status: 'eaten', loggedAt: Date.now() } : l
          ),
        },
      }));
    },
    [update]
  );

  const removeLog = useCallback(
    (logId: string) => {
      update((prev) => ({
        ...prev,
        today: {
          ...prev.today,
          logs: prev.today.logs.filter((l) => l.id !== logId),
        },
      }));
    },
    [update]
  );

  const addCustomFood = useCallback(
    (food: Food) => {
      update((prev) => ({ ...prev, customFoods: [...prev.customFoods, food] }));
    },
    [update]
  );

  const addToChecklist = useCallback(
    (foodId: string) => {
      update((prev) =>
        prev.checklist.foodIds.includes(foodId)
          ? prev
          : { ...prev, checklist: { foodIds: [...prev.checklist.foodIds, foodId] } }
      );
    },
    [update]
  );

  const removeFromChecklist = useCallback(
    (foodId: string) => {
      update((prev) => ({
        ...prev,
        checklist: { foodIds: prev.checklist.foodIds.filter((id) => id !== foodId) },
      }));
    },
    [update]
  );

  const setFlag = useCallback(
    <K extends keyof AppState['flags']>(key: K, value: AppState['flags'][K]) => {
      update((prev) => ({ ...prev, flags: { ...prev.flags, [key]: value } }));
    },
    [update]
  );

  const setSteps = useCallback(
    (steps: number, activeCalories?: number) => {
      update((prev) => ({
        ...prev,
        today: {
          ...prev.today,
          steps,
          activeCalories: activeCalories ?? prev.today.activeCalories,
        },
      }));
    },
    [update]
  );

  const refreshSteps = useCallback(async () => {
    const data = await fetchSteps(todayISO());
    if (data) setSteps(data.steps, data.activeCalories);
  }, [setSteps]);

  const setTheme = useCallback(
    (theme: 'dark' | 'light') => {
      update((prev) => ({ ...prev, theme }));
    },
    [update]
  );

  return {
    state,
    hydrated,
    logFood,
    togglePlannedToEaten,
    removeLog,
    addCustomFood,
    addToChecklist,
    removeFromChecklist,
    setFlag,
    setSteps,
    refreshSteps,
    setTheme,
    update,
  };
}
