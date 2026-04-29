'use client';

import { useState } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';
import { FOOD_LIBRARY } from '@/lib/foodLibrary';
import type { Food } from '@/lib/types';

export default function SettingsPage() {
  const {
    state,
    hydrated,
    addToChecklist,
    removeFromChecklist,
    setFlag,
    setTheme,
    refreshSteps,
  } = useAppState();
  const [copied, setCopied] = useState(false);

  if (!hydrated) return null;

  const baseUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || 'https://YOUR-DEPLOY-URL';

  const webhookUrl = `${baseUrl}/api/health/steps`;

  const onCopySecret = async () => {
    try {
      const secret = prompt('Paste your APP_SECRET to copy to clipboard for the Shortcut');
      if (secret) {
        await navigator.clipboard.writeText(secret);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // ignore
    }
  };

  const inChecklist = (id: string) => state.checklist.foodIds.includes(id);
  const allFoods: Food[] = [...FOOD_LIBRARY, ...state.customFoods];

  return (
    <div className="px-4 pt-6 space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Settings</h1>
      </header>

      <Section title="Mode">
        <Toggle
          label="Going out tonight"
          value={state.flags.goingOutTonight}
          onChange={(v) => setFlag('goingOutTonight', v)}
        />
        <Toggle
          label="Travel mode"
          value={state.flags.travelMode}
          onChange={(v) => setFlag('travelMode', v)}
        />
        <Toggle
          label="Gym day"
          value={state.flags.isGymDay}
          onChange={(v) => setFlag('isGymDay', v)}
        />
        <div className="flex items-center justify-between py-2">
          <span className="text-sm">Theme</span>
          <div className="flex gap-2">
            {(['dark', 'light'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className="px-3 py-1.5 rounded-lg text-xs"
                style={{
                  background: state.theme === t ? 'var(--ring-protein)' : 'var(--bg-card-elevated)',
                  color: state.theme === t ? '#fff' : 'var(--text-primary)',
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Apple Health webhook">
        <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
          Set up an iOS Shortcut to push your steps and active calories every 2 hours.
        </p>
        <ol className="text-sm space-y-2 list-decimal pl-5" style={{ color: 'var(--text-secondary)' }}>
          <li>Find Health Samples: Steps, Today, Sum.</li>
          <li>Find Health Samples: Active Energy, Today, Sum.</li>
          <li>Get Current Date.</li>
          <li>
            Get Contents of URL:
            <div className="mt-1 p-2 rounded-lg text-xs break-all" style={{ background: 'var(--bg-card-elevated)', color: 'var(--text-primary)' }}>
              POST {webhookUrl}
            </div>
            <div className="text-xs mt-1">
              Header: <code>Authorization: Bearer &lt;APP_SECRET&gt;</code>
            </div>
            <div className="text-xs">
              Body (JSON): <code>{`{ "date": "<ISO date>", "steps": <number>, "activeCalories": <number> }`}</code>
            </div>
          </li>
          <li>Personal Automation, Time of Day, every 2 hours, Run Immediately.</li>
        </ol>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => navigator.clipboard?.writeText(webhookUrl).then(() => setCopied(true))}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
            style={{ background: 'var(--bg-card-elevated)' }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />} Copy URL
          </button>
          <button
            onClick={onCopySecret}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
            style={{ background: 'var(--bg-card-elevated)' }}
          >
            <Copy size={14} /> Copy APP_SECRET
          </button>
          <button
            onClick={() => refreshSteps()}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm ml-auto"
            style={{ background: 'var(--ring-steps)', color: '#fff' }}
          >
            <RefreshCw size={14} /> Pull now
          </button>
        </div>
      </Section>

      <Section title="Daily checklist">
        <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
          Foods that appear on the home screen by default.
        </p>
        <div className="space-y-1 max-h-96 overflow-y-auto pr-1">
          {allFoods.map((f) => (
            <label
              key={f.id}
              className="flex items-center gap-3 px-3 py-2 rounded-lg"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <input
                type="checkbox"
                checked={inChecklist(f.id)}
                onChange={(e) => (e.target.checked ? addToChecklist(f.id) : removeFromChecklist(f.id))}
                className="w-auto"
                style={{ width: 16, height: 16 }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate">{f.name}</div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {f.calories}c · {f.protein}gP · {f.fiber}gF
                </div>
              </div>
            </label>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>
        {title}
      </h2>
      <div className="rounded-2xl p-3 space-y-1" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        {children}
      </div>
    </section>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="w-full flex items-center justify-between py-2"
    >
      <span className="text-sm">{label}</span>
      <span
        className="w-10 h-6 rounded-full relative transition-colors"
        style={{ background: value ? 'var(--ring-protein)' : 'var(--bg-card-elevated)' }}
      >
        <span
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform"
          style={{ left: value ? 18 : 2 }}
        />
      </span>
    </button>
  );
}
