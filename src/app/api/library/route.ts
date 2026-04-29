import { NextRequest, NextResponse } from 'next/server';
import { kvGet, kvSet, isKvConfigured } from '@/lib/kv';
import { FOOD_LIBRARY } from '@/lib/foodLibrary';
import type { Food } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CUSTOM_KEY = 'library:custom';

export async function GET() {
  const custom = isKvConfigured() ? (await kvGet<Food[]>(CUSTOM_KEY)) ?? [] : [];
  return NextResponse.json({ defaults: FOOD_LIBRARY, custom });
}

export async function POST(req: NextRequest) {
  if (!isKvConfigured()) return NextResponse.json({ ok: true, kvConfigured: false });
  let body: { custom?: Food[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  if (!Array.isArray(body.custom)) {
    return NextResponse.json({ error: 'Missing custom array' }, { status: 400 });
  }
  await kvSet(CUSTOM_KEY, body.custom);
  return NextResponse.json({ ok: true });
}
