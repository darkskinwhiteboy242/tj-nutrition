import Anthropic from '@anthropic-ai/sdk';
import { FOOD_LIBRARY } from './foodLibrary';
import type { Food, RecommendationType, LogEntry, AppFlags } from './types';
import { TARGETS } from './targets';

let _client: Anthropic | null = null;

export function getAnthropic(): Anthropic {
  if (!_client) {
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _client;
}

export const SYSTEM_PROMPT = `You are TJ's personal nutrition coach. You have full knowledge of his daily targets, food library, meal patterns, and behavioral tendencies. Your job is to give him short, direct, practical recommendations on what to eat next.

TJ's daily targets:
- Calories: 1,850 to 2,000 (midpoint 1,925)
- Protein: 200 to 220g (floor 200g)
- Fiber: 25g minimum, 35g optimal
- Steps: 12,000 minimum
- Kitchen closes at 8:00 PM (water and bone broth only after that on non-gym days)

TJ's food library is provided in every user message. You should ONLY recommend foods from his library unless he explicitly asks "what about [new food]?"

Coaching style rules (strict):
1. Never use em dashes. Use periods, commas, or parentheses instead.
2. Never use the word "amazing" or hype language. Be direct.
3. Maximum 3 sentences per response unless he asks for a full plan.
4. Lead with the specific food and portion. Do not preamble.
5. Show the math: include the exact macros the recommendation closes.
6. If protein is the largest gap, prioritize it over calories.
7. If fiber is below 15g and it is past 5pm, push Benefiber + Konsyl + chia.
8. Do not shame past choices. Look forward only.
9. If kitchen close is approaching (within 90 min) and he is short on protein, push the fastest protein source (Core Power shake or bone broth + collagen).
10. On gym days, allow protein-only food after 8pm.

Format your response as plain text. No markdown headers, no bullet lists, no bold. Just direct prose.

Behavioral patterns to be aware of:
- TJ tends to overeat after 8pm if not redirected. Encourage early dinner.
- TJ skips breakfast sometimes. If past 11am with zero logs, push Core Power + bone broth + Benefiber as a one-shot meal.
- TJ goes out occasionally. If he flags "going out tonight," push a full protein dinner before he leaves.
- TJ is a serious gym-goer with a 4-day split. Post-workout protein matters.`;

export type RecommendInput = {
  type: RecommendationType;
  consumed: { calories: number; protein: number; fiber: number; steps: number };
  logs: LogEntry[];
  flags: AppFlags;
  customFoods?: Food[];
  freeformInput?: string;
  question?: string;
};

function pct(n: number, t: number): number {
  return Math.round((n / t) * 100);
}

function dayOfWeek(): string {
  return new Date().toLocaleDateString('en-US', { weekday: 'long' });
}

function timeStr(): string {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function minutesToKitchenClose(): number {
  const now = new Date();
  const close = new Date(now);
  close.setHours(TARGETS.kitchenCloseHour, 0, 0, 0);
  const diff = (close.getTime() - now.getTime()) / 60000;
  return Math.max(0, Math.round(diff));
}

export function buildPrompts(input: RecommendInput): { systemPrompt: string; userMessage: string } {
  const { consumed, logs, flags, customFoods = [] } = input;
  const calRem = TARGETS.caloriesMid - consumed.calories;
  const proRem = TARGETS.proteinMid - consumed.protein;
  const fibRem = TARGETS.fiberOptimal - consumed.fiber;
  const minLeft = minutesToKitchenClose();
  const hoursLeft = (minLeft / 60).toFixed(1);

  const library = [...FOOD_LIBRARY, ...customFoods]
    .map((f) => `${f.name}: ${f.calories}c, ${f.protein}gP, ${f.fiber}gF`)
    .join('\n');

  const loggedLines = logs
    .filter((l) => l.status === 'eaten')
    .map((l) => {
      const t = new Date(l.loggedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      return `${t} ${l.name} (${l.calories}c, ${l.protein}gP, ${l.fiber}gF)`;
    })
    .join('\n') || 'Nothing logged yet today.';

  const question = (() => {
    if (input.question) return input.question;
    switch (input.type) {
      case 'suggestions':
        return 'What are the best 3 foods from my library to log right now? Return ONLY a JSON array of {name, reason} objects, no other text, no markdown.';
      case 'endOfDay':
        return `I have ${minLeft} minutes until kitchen close. What specific foods (with portions) should I eat to close the largest macro gap? Show the math.`;
      case 'fullDay':
        return 'Suggest a full day plan that hits exactly 1,925 cal, 210g protein, 30g fiber, using only my food library. Format as a time-table.';
      case 'goingOut':
        return "I'm going out tonight. What should I eat before I leave to stay full and on-target? Use my food library.";
      case 'catchUp':
        return `I'm at ${pct(consumed.protein, TARGETS.proteinMid)}% protein and ${pct(consumed.calories, TARGETS.caloriesMid)}% cal with ${hoursLeft} hours until kitchen close. What is the single fastest, highest-protein food I should grab right now?`;
      case 'parseFood':
        return `Parse this food into JSON {name, calories, protein, fiber, defaultPortion}: ${input.freeformInput ?? ''}. Return ONLY JSON, no markdown.`;
    }
  })();

  const userMessage = `Current state at ${timeStr()} on ${dayOfWeek()}:

CONSUMED TODAY:
- Calories: ${consumed.calories} of ${TARGETS.caloriesMid} (${pct(consumed.calories, TARGETS.caloriesMid)}%)
- Protein: ${consumed.protein}g of ${TARGETS.proteinMid}g (${pct(consumed.protein, TARGETS.proteinMid)}%)
- Fiber: ${consumed.fiber}g of ${TARGETS.fiberOptimal}g (${pct(consumed.fiber, TARGETS.fiberOptimal)}%)
- Steps: ${consumed.steps} of ${TARGETS.stepsMin} (${pct(consumed.steps, TARGETS.stepsMin)}%)

REMAINING:
- Calories: ${calRem}
- Protein: ${proRem}g
- Fiber: ${fibRem}g

ALREADY LOGGED:
${loggedLines}

CONTEXT FLAGS:
- Gym today: ${flags.isGymDay} (${flags.todaysSplit})
- Going out tonight: ${flags.goingOutTonight}
- Travel mode: ${flags.travelMode}
- Time until kitchen close: ${minLeft} minutes

FOOD LIBRARY (recommend only from this list):
${library}

Question: ${question}`;

  return { systemPrompt: SYSTEM_PROMPT, userMessage };
}

export function stripJsonFences(text: string): string {
  const trimmed = text.trim();
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fence) return fence[1].trim();
  return trimmed;
}
