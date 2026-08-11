'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  
  // Защита от ошибок гидратации (SSR vs Client)
  const isClient = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="p-3 hover:bg-theme-bg rounded-full transition-colors active:scale-95 text-theme-accent"
      aria-label="Toggle theme"
    >
      {/* Пока клиент не смонтирован, рисуем заглушку, чтобы интерфейс не прыгал */}
      {!isClient ? (
        <div className="w-6 h-6" /> 
      ) : resolvedTheme === 'dark' ? (
        <Sun size={24} strokeWidth={2.5} />
      ) : (
        <Moon size={24} strokeWidth={2.5} />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}