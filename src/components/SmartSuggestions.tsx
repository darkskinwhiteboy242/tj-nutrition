'use client';

import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import type { AppState, Suggestion } from '@/lib/types';
import type { RingTotals } from '@/hooks/useRings';

type Props = {
  state: AppState;
  totals: RingTotals;
};

export function SmartSuggestions({ state, totals }: Props) {
  const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'suggestions',
            consumed: {
              calories: totals.calories,
              protein: totals.protein,
              fiber: totals.fiber,
              steps: totals.steps,
            },
            logs: state.today.logs,
            flags: state.flags,
            customFoods: state.customFoods,
          }),
        });
        const data = await res.json();
        if (cancelled) return;
        if (Array.isArray(data.json)) {
          setSuggestions(data.json as Suggestion[]);
        } else if (data.error) {
          setError(data.error);
        } else {
          setError('No suggestions available.');
        }
      } catch {
        if (!cancelled) setError('Offline.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
    // refresh on log changes
  }, [state.today.logs.length, state.flags.goingOutTonight]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-2 px-1">
        <Sparkles size={14} style={{ color: 'var(--text-tertiary)' }} />
        <h3
          className="text-xs uppercase tracking-wider"
          style={{ color: 'var(--text-tertiary)' }}
        >
          Smart Suggestions
        </h3>
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
        {loading && (
          <div
            className="min-w-[200px] p-3 rounded-xl"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Thinking...
            </div>
          </div>
        )}
        {!loading && error && (
          <div
            className="min-w-[200px] p-3 rounded-xl"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {error}
            </div>
          </div>
        )}
        {!loading &&
          suggestions?.map((s, i) => (
            <div
              key={i}
              className="min-w-[220px] p-3 rounded-xl flex-shrink-0"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <div className="text-base font-medium">{s.name}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                {s.reason}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
