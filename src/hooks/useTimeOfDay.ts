'use client';

import { useEffect, useState } from 'react';

export function useTimeOfDay() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  return {
    now,
    hour: now.getHours(),
    isMorning: now.getHours() < 11,
    isAfternoon: now.getHours() >= 12 && now.getHours() < 17,
    isEvening: now.getHours() >= 18,
    isPastSix: now.getHours() >= 18,
    isPastEleven: now.getHours() >= 11,
    minutesToKitchenClose: Math.max(
      0,
      Math.round((new Date(now).setHours(20, 0, 0, 0) - now.getTime()) / 60000)
    ),
  };
}
