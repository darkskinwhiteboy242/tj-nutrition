'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Search } from 'lucide-react';
import type { AppState, Food, MealSection, ParsedFood } from '@/lib/types';
import { FOOD_LIBRARY } from '@/lib/foodLibrary';
import { uid } from '@/lib/utils';

type Props = {
  open: boolean;
  onClose: () => void;
  state: AppState;
  onLogOnce: (food: Food, meal: MealSection) => void;
  onSaveLibrary: (food: Food) => void;
  onSaveDaily: (food: Food) => void;
};

export function AddFoodSheet({ open, onClose, state, onLogOnce, onSaveLibrary, onSaveDaily }: Props) {
  const [query, setQuery] = useState('');
  const [parsing, setParsing] = useState(false);
  const [parsed, setParsed] = useState<ParsedFood | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setParsed(null);
      setError(null);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const matches = query
    ? [...FOOD_LIBRARY, ...state.customFoods]
        .filter((f) => f.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 12)
    : [];

  const onSubmitFreeform = async () => {
    if (!query.trim()) return;
    setParsing(true);
    setError(null);
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'parseFood',
          consumed: { calories: 0, protein: 0, fiber: 0, steps: 0 },
          logs: [],
          flags: state.flags,
          customFoods: state.customFoods,
          freeformInput: query,
        }),
      });
      const data = await res.json();
      if (data.json && typeof data.json.calories === 'number') {
        setParsed(data.json as ParsedFood);
      } else {
        setError('Could not parse. Try again with grams or oz.');
      }
    } catch {
      setError('Network error.');
    } finally {
      setParsing(false);
    }
  };

  const toFood = (p: ParsedFood): Food => ({
    id: uid(),
    name: p.name,
    category: 'snacks',
    defaultMealSection: 'snacks',
    calories: p.calories,
    protein: p.protein,
    fiber: p.fiber,
    defaultDaily: false,
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      <div
        className="relative w-full max-w-[480px] mx-auto rounded-t-3xl pt-3 pb-6 px-4"
        style={{ background: 'var(--bg-card)', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 rounded-full mx-auto mb-3" style={{ background: 'var(--text-tertiary)' }} />
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Add food</h3>
          <button onClick={onClose} aria-label="Close" className="p-2 -m-2">
            <X size={20} />
          </button>
        </div>

        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setParsed(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void onSubmitFreeform();
            }}
            placeholder="200g chicken thigh, or search..."
            style={{ paddingLeft: 40 }}
          />
        </div>

        {error && (
          <p className="text-sm mt-2" style={{ color: 'var(--accent-over)' }}>
            {error}
          </p>
        )}

        {!parsed && matches.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
              From your library
            </h4>
            {matches.map((f) => (
              <button
                key={f.id}
                onClick={() => onLogOnce(f, f.defaultMealSection)}
                className="w-full text-left p-3 rounded-xl"
                style={{ background: 'var(--bg-card-elevated)', border: '1px solid var(--border)' }}
              >
                <div className="text-base">{f.name}</div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {f.calories}c · {f.protein}gP · {f.fiber}gF
                </div>
              </button>
            ))}
          </div>
        )}

        {!parsed && query.trim() && (
          <button
            disabled={parsing}
            onClick={onSubmitFreeform}
            className="w-full mt-4 py-3 rounded-xl text-base font-medium"
            style={{ background: 'var(--ring-protein)', color: '#fff' }}
          >
            {parsing ? 'Parsing...' : `Parse "${query}" with AI`}
          </button>
        )}

        {parsed && (
          <div
            className="mt-4 p-4 rounded-xl space-y-3"
            style={{ background: 'var(--bg-card-elevated)', border: '1px solid var(--border)' }}
          >
            <div>
              <div className="text-base font-medium">{parsed.name}</div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {parsed.calories}c · {parsed.protein}gP · {parsed.fiber}gF
                {parsed.defaultPortion ? ` · ${parsed.defaultPortion}` : ''}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  const f = toFood(parsed);
                  onLogOnce(f, 'snacks');
                }}
                className="py-2 rounded-lg text-sm"
                style={{ background: 'var(--ring-protein)', color: '#fff' }}
              >
                Use Once
              </button>
              <button
                onClick={() => {
                  const f = toFood(parsed);
                  onSaveLibrary(f);
                }}
                className="py-2 rounded-lg text-sm"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
              >
                Save Library
              </button>
              <button
                onClick={() => {
                  const f = toFood(parsed);
                  onSaveDaily(f);
                }}
                className="py-2 rounded-lg text-sm"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
              >
                Save Daily
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
