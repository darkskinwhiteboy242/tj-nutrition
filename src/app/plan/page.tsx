'use client';

import { useAppState } from '@/hooks/useAppState';
import { DailyChecklist } from '@/components/DailyChecklist';
import type { Food, MealSection } from '@/lib/types';

export default function PlanPage() {
  const { state, hydrated, logFood, togglePlannedToEaten } = useAppState();

  if (!hydrated) return null;

  const onLog = (food: Food, meal: MealSection) => {
    const existing = state.today.logs.find((l) => l.foodId === food.id);
    if (!existing) {
      logFood(food, meal, 'planned');
    } else if (existing.status === 'planned') {
      togglePlannedToEaten(existing.id);
    }
  };

  return (
    <div className="px-4 pt-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Plan today</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Tap once to plan. Tap again when eaten.
        </p>
      </header>
      <DailyChecklist state={state} onLog={onLog} planMode />
    </div>
  );
}
