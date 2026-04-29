import { NextRequest, NextResponse } from 'next/server';
import { getAnthropic, buildPrompts, stripJsonFences, type RecommendInput } from '@/lib/anthropic';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY.includes('REPLACE_ME')) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY is not configured', text: '' },
      { status: 503 }
    );
  }

  let body: RecommendInput;
  try {
    body = (await req.json()) as RecommendInput;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { systemPrompt, userMessage } = buildPrompts(body);

  try {
    const anthropic = getAnthropic();
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    });

    const textOut = response.content
      .filter((block) => block.type === 'text')
      .map((block) => (block as { text: string }).text)
      .join('\n');

    if (body.type === 'suggestions' || body.type === 'parseFood') {
      const stripped = stripJsonFences(textOut);
      try {
        const parsed = JSON.parse(stripped);
        return NextResponse.json({ text: textOut, json: parsed });
      } catch {
        return NextResponse.json({ text: textOut, json: null });
      }
    }

    return NextResponse.json({ text: textOut });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: message, text: '' }, { status: 500 });
  }
}
