'use client';

import { useMemo } from 'react';
import type { AppState } from '@/lib/types';
import { TARGETS } from '@/lib/targets';

export type RingTotals = {
  calories: number;
  protein: number;
  fiber: number;
  steps: number;
  caloriesPlanned: number;
  proteinPlanned: number;
  fiberPlanned: number;
  caloriesPct: number;
  proteinPct: number;
  fiberPct: number;
  stepsPct: number;
  caloriesRemaining: number;
  proteinRemaining: number;
  fiberRemaining: number;
  stepsRemaining: number;
};

export function useRings(state: AppState): RingTotals {
  return useMemo(() => {
    const eaten = state.today.logs.filter((l) => l.status === 'eaten');
    const planned = state.today.logs.filter((l) => l.status === 'planned');
    const sum = (arr: typeof eaten, k: 'calories' | 'protein' | 'fiber') =>
      arr.reduce((acc, l) => acc + l[k], 0);

    const calories = sum(eaten, 'calories');
    const protein = sum(eaten, 'protein');
    const fiber = sum(eaten, 'fiber');
    const steps = state.today.steps;

    const cap = (n: number, t: number) => Math.round((n / t) * 100);

    return {
      calories,
      protein,
      fiber,
      steps,
      caloriesPlanned: sum(planned, 'calories'),
      proteinPlanned: sum(planned, 'protein'),
      fiberPlanned: sum(planned, 'fiber'),
      caloriesPct: cap(calories, TARGETS.caloriesMid),
      proteinPct: cap(protein, TARGETS.proteinMid),
      fiberPct: cap(fiber, TARGETS.fiberOptimal),
      stepsPct: cap(steps, TARGETS.stepsMin),
      caloriesRemaining: Math.max(0, TARGETS.caloriesMid - calories),
      proteinRemaining: Math.max(0, TARGETS.proteinMid - protein),
      fiberRemaining: Math.max(0, TARGETS.fiberOptimal - fiber),
      stepsRemaining: Math.max(0, TARGETS.stepsMin - steps),
    };
  }, [state]);
}
