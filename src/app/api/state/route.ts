import { NextRequest, NextResponse } from 'next/server';
import { kvGet, kvSet, isKvConfigured } from '@/lib/kv';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const STATE_KEY = 'app:state';

export async function GET() {
  if (!isKvConfigured()) {
    return NextResponse.json({ state: null, kvConfigured: false });
  }
  const state = await kvGet<unknown>(STATE_KEY);
  return NextResponse.json({ state });
}

export async function POST(req: NextRequest) {
  if (!isKvConfigured()) {
    return NextResponse.json({ ok: true, kvConfigured: false });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  await kvSet(STATE_KEY, body);
  return NextResponse.json({ ok: true });
}
