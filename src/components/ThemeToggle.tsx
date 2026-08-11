'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isClient = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-3 hover:bg-reef-light dark:hover:bg-slate-800 rounded-full transition-colors active:scale-95 text-reef-blue dark:text-reef-cyan"
      aria-label="Toggle theme"
    >
      {isClient && theme === 'dark' ? <Sun size={24} strokeWidth={2.5} /> : <Moon size={24} strokeWidth={2.5} />}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}


