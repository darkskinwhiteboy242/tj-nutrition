import { kv } from '@vercel/kv';

export function isKvConfigured(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export async function kvGet<T>(key: string): Promise<T | null> {
  if (!isKvConfigured()) return null;
  return (await kv.get<T>(key)) ?? null;
}

export async function kvSet(key: string, value: unknown): Promise<void> {
  if (!isKvConfigured()) return;
  await kv.set(key, value);
}

export { kv };
