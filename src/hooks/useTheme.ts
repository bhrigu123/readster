import { useEffect, useState } from 'react';

export type Theme = 'system' | 'light' | 'dark';

const KEY = 'readster-theme';

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem(KEY) as Theme) ?? 'system',
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark');
    if (theme !== 'system') root.classList.add(`theme-${theme}`);
    localStorage.setItem(KEY, theme);
  }, [theme]);

  // Apply on first render too (in case a class was already set)
  useEffect(() => {
    const stored = (localStorage.getItem(KEY) as Theme) ?? 'system';
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark');
    if (stored !== 'system') root.classList.add(`theme-${stored}`);
  }, []);

  return { theme, setTheme: setThemeState };
}
