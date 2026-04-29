'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';
import { useRings } from '@/hooks/useRings';
import { useTimeOfDay } from '@/hooks/useTimeOfDay';
import { Rings } from '@/components/Rings';
import { DailyChecklist } from '@/components/DailyChecklist';
import { SmartSuggestions } from '@/components/SmartSuggestions';
import { EndOfDayCard } from '@/components/EndOfDayCard';
import { AddFoodSheet } from '@/components/AddFoodSheet';
import { InstallPrompt } from '@/components/InstallPrompt';
import type { Food, MealSection } from '@/lib/types';

export default function HomePage() {
  const { state, hydrated, logFood, addCustomFood, addToChecklist } = useAppState();
  const totals = useRings(state);
  const { isPastSix } = useTimeOfDay();
  const [sheetOpen, setSheetOpen] = useState(false);

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
          Loading...
        </div>
      </div>
    );
  }

  const onLog = (food: Food, meal: MealSection) => {
    logFood(food, meal, 'eaten');
  };

  return (
    <div className="px-4 pt-6">
      <header className="flex items-baseline justify-between mb-6">
        <h1 className="text-2xl font-semibold">Today</h1>
        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
      </header>

      <InstallPrompt />

      <div className="flex justify-center mb-4">
        <Rings totals={totals} />
      </div>

      <div className="text-center text-sm tabular" style={{ color: 'var(--text-secondary)' }}>
        Remaining: {totals.caloriesRemaining} cal · {totals.proteinRemaining}g protein ·{' '}
        {totals.stepsRemaining.toLocaleString()} steps
      </div>

      {isPastSix ? (
        <EndOfDayCard state={state} totals={totals} />
      ) : (
        <SmartSuggestions state={state} totals={totals} />
      )}

      <div className="mt-8">
        <DailyChecklist state={state} onLog={onLog} />
      </div>

      <button
        onClick={() => setSheetOpen(true)}
        aria-label="Add food"
        className="fixed bottom-24 right-4 w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
        style={{ background: 'var(--ring-protein)', color: '#fff' }}
      >
        <Plus size={28} />
      </button>

      <AddFoodSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        state={state}
        onLogOnce={(food, meal) => {
          logFood(food, meal, 'eaten');
          setSheetOpen(false);
        }}
        onSaveLibrary={(food) => {
          addCustomFood(food);
          setSheetOpen(false);
        }}
        onSaveDaily={(food) => {
          addCustomFood(food);
          addToChecklist(food.id);
          setSheetOpen(false);
        }}
      />
    </div>
  );
}
