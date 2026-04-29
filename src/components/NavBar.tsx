'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ListChecks, TrendingUp, Settings } from 'lucide-react';

const ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/plan', label: 'Plan', icon: ListChecks },
  { href: '/trends', label: 'Trends', icon: TrendingUp },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function NavBar() {
  const path = usePathname();
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur"
      style={{
        background: 'color-mix(in srgb, var(--bg-primary) 90%, transparent)',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div className="max-w-[480px] mx-auto px-4 py-2 flex items-center justify-around safe-bottom">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? path === '/' : path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-0.5 py-2 px-3 rounded-lg"
              style={{ color: active ? 'var(--text-primary)' : 'var(--text-tertiary)' }}
            >
              <Icon size={22} />
              <span className="text-[10px]">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
