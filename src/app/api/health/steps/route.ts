import { NextRequest, NextResponse } from 'next/server';
import { kvGet, kvSet, isKvConfigured } from '@/lib/kv';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function checkAuth(req: NextRequest): boolean {
  const auth = req.headers.get('authorization');
  const secret = process.env.APP_SECRET;
  if (!secret) return false;
  return auth === `Bearer ${secret}`;
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let payload: { date?: string; steps?: number; activeCalories?: number };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { date, steps, activeCalories } = payload;
  if (!date || typeof steps !== 'number') {
    return NextResponse.json({ error: 'Missing date or steps' }, { status: 400 });
  }

  if (!isKvConfigured()) {
    return NextResponse.json({ ok: true, kvConfigured: false });
  }

  await kvSet(`steps:${date}`, steps);
  if (typeof activeCalories === 'number') {
    await kvSet(`active-cal:${date}`, activeCalories);
  }

  return NextResponse.json({ ok: true });
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const date = url.searchParams.get('date');
  if (!date) {
    return NextResponse.json({ error: 'Missing date' }, { status: 400 });
  }
  if (!isKvConfigured()) {
    return NextResponse.json({ date, steps: 0, activeCalories: 0, kvConfigured: false });
  }
  const steps = (await kvGet<number>(`steps:${date}`)) ?? 0;
  const activeCalories = (await kvGet<number>(`active-cal:${date}`)) ?? 0;
  return NextResponse.json({ date, steps, activeCalories });
}
