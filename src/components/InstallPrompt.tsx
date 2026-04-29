'use client';

import { useEffect, useState } from 'react';
import { X, Share } from 'lucide-react';

export function InstallPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const dismissed = localStorage.getItem('installPromptDismissed');
    if (dismissed) return;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone =
      'standalone' in window.navigator && (window.navigator as { standalone?: boolean }).standalone;
    if (isIOS && !isStandalone) {
      const t = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = () => {
    setShow(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('installPromptDismissed', '1');
    }
  };

  if (!show) return null;

  return (
    <div
      className="mx-4 mt-3 p-3 rounded-xl flex items-start gap-3"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      <Share size={18} style={{ color: 'var(--ring-steps)' }} className="mt-0.5" />
      <div className="flex-1 text-sm">
        Tap the Share icon, then Add to Home Screen for the full app.
      </div>
      <button onClick={dismiss} aria-label="Dismiss" className="p-1 -m-1">
        <X size={16} />
      </button>
    </div>
  );
}
