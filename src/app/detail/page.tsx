'use client';

import { useMemo } from 'react';
import { Trash2 } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';
import { TARGETS } from '@/lib/targets';
import type { MealSection } from '@/lib/types';

const MEAL_LABELS: Record<MealSection, string> = {
  breakfast: 'Morning',
  afternoon: 'Afternoon',
  dinner: 'Dinner',
  'post-gym': 'Post-Gym',
  snacks: 'Snacks',
};

const MEAL_ORDER: MealSection[] = ['breakfast', 'afternoon', 'dinner', 'post-gym', 'snacks'];

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-card-elevated)' }}>
      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

export default function DetailPage() {
  const { state, hydrated, removeLog } = useAppState();

  const byMeal = useMemo(() => {
    const map: Record<MealSection, { calories: number; protein: number; fiber: number; logs: typeof state.today.logs }> = {
      breakfast: { calories: 0, protein: 0, fiber: 0, logs: [] },
      afternoon: { calories: 0, protein: 0, fiber: 0, logs: [] },
      dinner: { calories: 0, protein: 0, fiber: 0, logs: [] },
      'post-gym': { calories: 0, protein: 0, fiber: 0, logs: [] },
      snacks: { calories: 0, protein: 0, fiber: 0, logs: [] },
    };
    for (const l of state.today.logs) {
      if (l.status !== 'eaten') continue;
      map[l.mealSection].calories += l.calories;
      map[l.mealSection].protein += l.protein;
      map[l.mealSection].fiber += l.fiber;
      map[l.mealSection].logs.push(l);
    }
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.today.logs]);

  if (!hydrated) return null;

  return (
    <div className="px-4 pt-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Macro detail</h1>
      </header>

      {MEAL_ORDER.map((meal) => {
        const m = byMeal[meal];
        if (!m.logs.length) return null;
        return (
          <section key={meal} className="mb-6">
            <h2 className="text-sm uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>
              {MEAL_LABELS[meal]}
            </h2>
            <div className="p-3 rounded-xl space-y-2 mb-2" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div>
                <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                  <span>Calories</span>
                  <span className="tabular">{m.calories}</span>
                </div>
                <Bar value={m.calories} max={TARGETS.caloriesMid / 3} color="var(--ring-calories)" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                  <span>Protein</span>
                  <span className="tabular">{m.protein}g</span>
                </div>
                <Bar value={m.protein} max={TARGETS.proteinMid / 3} color="var(--ring-protein)" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                  <span>Fiber</span>
                  <span className="tabular">{m.fiber}g</span>
                </div>
                <Bar value={m.fiber} max={TARGETS.fiberOptimal / 3} color="var(--ring-steps)" />
              </div>
            </div>
            <ul className="space-y-1">
              {m.logs.map((l) => (
                <li
                  key={l.id}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg"
                  style={{ background: 'var(--bg-card-elevated)' }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{l.name}</div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {l.calories}c · {l.protein}gP · {l.fiber}gF
                    </div>
                  </div>
                  <button onClick={() => removeLog(l.id)} aria-label="Remove" className="p-2 -m-2">
                    <Trash2 size={16} style={{ color: 'var(--text-tertiary)' }} />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      {state.today.logs.filter((l) => l.status === 'eaten').length === 0 && (
        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
          Nothing logged yet today.
        </p>
      )}
    </div>
  );
}
