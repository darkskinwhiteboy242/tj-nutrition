'use client';

import { useRef, useState } from 'react';
import { Check, Circle, CircleDashed } from 'lucide-react';
import type { Food, LogStatus } from '@/lib/types';

type Props = {
  food: Food;
  status: LogStatus | 'none';
  onLog: () => void;
  onPlan?: () => void;
  onLongPress?: () => void;
};

export function FoodRow({ food, status, onLog, onLongPress }: Props) {
  const [pressing, setPressing] = useState(false);
  const longTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressFired = useRef(false);

  const start = () => {
    setPressing(true);
    longPressFired.current = false;
    if (onLongPress) {
      longTimer.current = setTimeout(() => {
        longPressFired.current = true;
        onLongPress();
      }, 800);
    }
  };

  const end = () => {
    setPressing(false);
    if (longTimer.current) {
      clearTimeout(longTimer.current);
      longTimer.current = null;
    }
  };

  const handleClick = () => {
    if (longPressFired.current) {
      longPressFired.current = false;
      return;
    }
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(15);
    }
    onLog();
  };

  const Icon = status === 'eaten' ? Check : status === 'planned' ? CircleDashed : Circle;
  const iconColor =
    status === 'eaten'
      ? 'var(--accent-success)'
      : status === 'planned'
      ? 'var(--ring-protein)'
      : 'var(--text-tertiary)';

  return (
    <button
      type="button"
      onClick={handleClick}
      onPointerDown={start}
      onPointerUp={end}
      onPointerLeave={end}
      onPointerCancel={end}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-transform"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        transform: pressing ? 'scale(0.98)' : 'scale(1)',
      }}
    >
      <Icon size={22} color={iconColor} />
      <div className="flex-1 min-w-0">
        <div className="text-base truncate">{food.name}</div>
        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {food.calories}c · {food.protein}gP · {food.fiber}gF
        </div>
      </div>
    </button>
  );
}
