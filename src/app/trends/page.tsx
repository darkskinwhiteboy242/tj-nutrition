'use client';

import { useMemo } from 'react';
import { useAppState } from '@/hooks/useAppState';
import { TARGETS } from '@/lib/targets';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import type { DailyState } from '@/lib/types';

function summarize(d: DailyState) {
  const eaten = d.logs.filter((l) => l.status === 'eaten');
  return {
    date: d.date,
    short: new Date(d.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' }),
    calories: eaten.reduce((a, l) => a + l.calories, 0),
    protein: eaten.reduce((a, l) => a + l.protein, 0),
    fiber: eaten.reduce((a, l) => a + l.fiber, 0),
    steps: d.steps,
  };
}

export default function TrendsPage() {
  const { state, hydrated } = useAppState();

  const data = useMemo(() => {
    const days: DailyState[] = [];
    const today = state.today;
    const sorted = Object.values(state.history).sort((a, b) => (a.date < b.date ? -1 : 1));
    days.push(...sorted.slice(-6));
    days.push(today);
    return days.map(summarize);
  }, [state]);

  const avg = useMemo(() => {
    if (!data.length) return { calories: 0, protein: 0, fiber: 0, steps: 0 };
    return {
      calories: Math.round(data.reduce((a, d) => a + d.calories, 0) / data.length),
      protein: Math.round(data.reduce((a, d) => a + d.protein, 0) / data.length),
      fiber: Math.round(data.reduce((a, d) => a + d.fiber, 0) / data.length),
      steps: Math.round(data.reduce((a, d) => a + d.steps, 0) / data.length),
    };
  }, [data]);

  if (!hydrated) return null;

  return (
    <div className="px-4 pt-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Trends</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          7-day rolling
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <Stat label="Avg calories" value={avg.calories.toLocaleString()} target={TARGETS.caloriesMid} cur={avg.calories} />
        <Stat label="Avg protein" value={`${avg.protein}g`} target={TARGETS.proteinMid} cur={avg.protein} />
        <Stat label="Avg fiber" value={`${avg.fiber}g`} target={TARGETS.fiberOptimal} cur={avg.fiber} />
        <Stat label="Avg steps" value={avg.steps.toLocaleString()} target={TARGETS.stepsMin} cur={avg.steps} />
      </div>

      <section className="mb-6">
        <h2 className="text-sm uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>
          Steps
        </h2>
        <div className="rounded-xl p-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={data}>
              <XAxis dataKey="short" stroke="var(--text-tertiary)" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis hide />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ background: 'var(--bg-card-elevated)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
              />
              <Bar dataKey="steps" fill="var(--ring-steps)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-sm uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>
          Streak
        </h2>
        <div
          className="rounded-xl p-4 flex items-baseline gap-2"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <span className="text-3xl font-bold tabular">{state.streak}</span>
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            day{state.streak === 1 ? '' : 's'} all rings closed
          </span>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, target, cur }: { label: string; value: string; target: number; cur: number }) {
  const pct = Math.min(100, Math.round((cur / target) * 100));
  return (
    <div className="rounded-xl p-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
        {label}
      </div>
      <div className="text-xl font-semibold tabular mt-1">{value}</div>
      <div className="text-xs mt-1 tabular" style={{ color: 'var(--text-secondary)' }}>
        {pct}% of target
      </div>
    </div>
  );
}
