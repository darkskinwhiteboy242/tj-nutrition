'use client';

import { useMemo } from 'react';
import type { AppState, Food, MealSection } from '@/lib/types';
import { FOOD_LIBRARY } from '@/lib/foodLibrary';
import { FoodRow } from './FoodRow';

type Props = {
  state: AppState;
  onLog: (food: Food, meal: MealSection) => void;
  planMode?: boolean;
};

const MEAL_ORDER: MealSection[] = ['breakfast', 'afternoon', 'dinner', 'post-gym', 'snacks'];
const MEAL_LABELS: Record<MealSection, string> = {
  breakfast: 'Morning',
  afternoon: 'Afternoon',
  dinner: 'Dinner',
  'post-gym': 'Post-Gym',
  snacks: 'Snacks',
};

export function DailyChecklist({ state, onLog }: Props) {
  const grouped = useMemo(() => {
    const all: Food[] = [...FOOD_LIBRARY, ...state.customFoods];
    const ids = new Set(state.checklist.foodIds);
    const list = all.filter((f) => ids.has(f.id));
    const map: Record<MealSection, Food[]> = {
      breakfast: [],
      afternoon: [],
      dinner: [],
      'post-gym': [],
      snacks: [],
    };
    for (const f of list) {
      map[f.defaultMealSection].push(f);
    }
    return map;
  }, [state.checklist.foodIds, state.customFoods]);

  const statusFor = (foodId: string) => {
    const log = state.today.logs.find((l) => l.foodId === foodId);
    if (!log) return 'none' as const;
    return log.status;
  };

  return (
    <div className="space-y-6">
      {MEAL_ORDER.map((section) => {
        const foods = grouped[section];
        if (!foods.length) return null;
        return (
          <section key={section}>
            <h3
              className="text-xs uppercase tracking-wider mb-2 px-1"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {MEAL_LABELS[section]}
            </h3>
            <div className="space-y-2">
              {foods.map((food) => (
                <FoodRow
                  key={food.id}
                  food={food}
                  status={statusFor(food.id)}
                  onLog={() => onLog(food, section)}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
