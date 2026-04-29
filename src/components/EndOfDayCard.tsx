'use client';

import { useEffect, useState } from 'react';
import { Moon } from 'lucide-react';
import type { AppState } from '@/lib/types';
import type { RingTotals } from '@/hooks/useRings';

type Props = {
  state: AppState;
  totals: RingTotals;
};

export function EndOfDayCard({ state, totals }: Props) {
  const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'endOfDay',
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
        if (!cancelled) setText(data.text ?? data.error ?? '');
      } catch {
        if (!cancelled) setText('Offline.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [state.today.logs.length]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="mt-4 p-4 rounded-2xl"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Moon size={16} style={{ color: 'var(--ring-protein)' }} />
        <h3 className="text-sm font-semibold">End of day</h3>
      </div>
      <p className="text-sm leading-relaxed whitespace-pre-wrap">
        {loading ? 'Thinking...' : text || 'No recommendation right now.'}
      </p>
    </div>
  );
}
