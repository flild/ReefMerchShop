'use client';

import * as React from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderState = {
  theme: Theme;
  resolvedTheme: 'dark' | 'light';
  setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = React.createContext<ThemeProviderState | undefined>(undefined);

// Внешнее хранилище, чтобы избавиться от useEffect + setState
const THEME_KEY = 'reef-theme';
let memoryTheme: Theme | null = null;
const listeners = new Set<() => void>();

function getSystemTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const themeStore = {
  getSnapshot() {
    if (typeof window === 'undefined') return 'system' as Theme;
    if (memoryTheme === null) {
      memoryTheme = (localStorage.getItem(THEME_KEY) as Theme) || 'system';
    }
    return memoryTheme;
  },
  getServerSnapshot() {
    return 'system' as Theme;
  },
  subscribe(callback: () => void) {
    listeners.add(callback);
    
    const handleStorage = (e: StorageEvent) => {
      if (e.key === THEME_KEY) {
        memoryTheme = (e.newValue as Theme) || 'system';
        listeners.forEach(l => l());
      }
    };
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMedia = () => listeners.forEach(l => l());

    window.addEventListener('storage', handleStorage);
    mediaQuery.addEventListener('change', handleMedia);
    
    return () => {
      listeners.delete(callback);
      window.removeEventListener('storage', handleStorage);
      mediaQuery.removeEventListener('change', handleMedia);
    };
  },
  setTheme(newTheme: Theme) {
    memoryTheme = newTheme;
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_KEY, newTheme);
    }
    listeners.forEach(l => l());
  }
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Компонент просто подписывается на готовый стор
  const theme = React.useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getSnapshot,
    themeStore.getServerSnapshot
  );

  // Вычисляем реальную тему. Это безопасно для гидратации, 
  // так как UI переключателя в ThemeToggle защищен собственным клиентом
  const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;

  // Здесь мы только дергаем DOM, React-дерево не перерендеривается
  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  const value = React.useMemo(
    () => ({ theme, resolvedTheme, setTheme: themeStore.setTheme }),
    [theme, resolvedTheme]
  );

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};