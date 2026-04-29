import { NextRequest, NextResponse } from 'next/server';
import { kvGet, kvSet, isKvConfigured } from '@/lib/kv';
import type { LogEntry } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const date = new URL(req.url).searchParams.get('date');
  if (!date) return NextResponse.json({ error: 'Missing date' }, { status: 400 });
  if (!isKvConfigured()) return NextResponse.json({ date, logs: [] });
  const logs = (await kvGet<LogEntry[]>(`log:${date}`)) ?? [];
  return NextResponse.json({ date, logs });
}

export async function POST(req: NextRequest) {
  if (!isKvConfigured()) return NextResponse.json({ ok: true, kvConfigured: false });
  let body: { date?: string; logs?: LogEntry[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  if (!body.date || !Array.isArray(body.logs)) {
    return NextResponse.json({ error: 'Missing date or logs' }, { status: 400 });
  }
  await kvSet(`log:${body.date}`, body.logs);
  return NextResponse.json({ ok: true });
}
