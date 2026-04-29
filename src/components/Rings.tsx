'use client';

import { useMemo } from 'react';
import type { RingTotals } from '@/hooks/useRings';

type Props = {
  totals: RingTotals;
  size?: number;
};

type RingDef = {
  label: string;
  pct: number;
  plannedPct: number;
  color: string;
  remaining: number;
  unit: string;
};

export function Rings({ totals, size = 220 }: Props) {
  const stroke = 14;
  const gap = 8;

  const rings: RingDef[] = useMemo(
    () => [
      {
        label: 'cal',
        pct: totals.caloriesPct,
        plannedPct: Math.round(((totals.calories + totals.caloriesPlanned) / 1925) * 100),
        color: 'var(--ring-calories)',
        remaining: totals.caloriesRemaining,
        unit: 'cal',
      },
      {
        label: 'protein',
        pct: totals.proteinPct,
        plannedPct: Math.round(((totals.protein + totals.proteinPlanned) / 210) * 100),
        color: 'var(--ring-protein)',
        remaining: totals.proteinRemaining,
        unit: 'g protein',
      },
      {
        label: 'steps',
        pct: totals.stepsPct,
        plannedPct: totals.stepsPct,
        color: 'var(--ring-steps)',
        remaining: totals.stepsRemaining,
        unit: 'steps',
      },
    ],
    [totals]
  );

  const allClosed = rings.every((r) => r.pct >= 100);

  const heroLabel = (() => {
    if (allClosed) return { num: 'All', unit: 'Closed' };
    const largest = rings
      .map((r) => ({ ...r, gap: 100 - r.pct }))
      .sort((a, b) => b.gap - a.gap)[0];
    return {
      num: largest.remaining.toLocaleString(),
      unit: `${largest.unit} left`,
    };
  })();

  const radii = rings.map((_, i) => (size - stroke) / 2 - i * (stroke + gap));
  const center = size / 2;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {rings.map((r, i) => {
          const radius = radii[i];
          const circumference = 2 * Math.PI * radius;
          const overTarget = r.pct > 100;
          const drawColor = overTarget ? 'var(--accent-over)' : r.color;
          const dash = (Math.min(r.pct, 100) / 100) * circumference;
          const plannedDash = (Math.min(r.plannedPct, 100) / 100) * circumference;
          return (
            <g key={r.label}>
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="var(--bg-card-elevated)"
                strokeWidth={stroke}
              />
              {r.plannedPct > r.pct && (
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={drawColor}
                  strokeOpacity={0.25}
                  strokeWidth={stroke}
                  strokeDasharray={`${plannedDash} ${circumference}`}
                  strokeLinecap="round"
                />
              )}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={drawColor}
                strokeWidth={stroke}
                strokeDasharray={`${dash} ${circumference}`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 600ms ease-out' }}
              />
            </g>
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-5xl font-bold tabular leading-none">{heroLabel.num}</div>
        <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          {heroLabel.unit}
        </div>
      </div>
    </div>
  );
}
