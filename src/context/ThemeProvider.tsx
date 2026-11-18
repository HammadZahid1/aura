import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { THEMES } from '../data/themes';
import type { ThemeName } from '../types';
import { ThemeContext } from './themeContext';

const STORAGE_KEY = 'aura.theme';

function readStoredTheme(): ThemeName {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeName | null;
    if (stored && THEMES[stored]) return stored;
  } catch {
    // Storage may be unavailable; the app still works with the default theme.
  }
  return 'cyan';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>(readStoredTheme);

  useEffect(() => {
    const definition = THEMES[theme];
    const root = document.documentElement;
    root.style.setProperty('--accent', definition.primary);
    root.style.setProperty('--accent-secondary', definition.secondary);
    root.style.setProperty('--accent-glow', definition.glow);
    root.style.setProperty('--bg', definition.background);

    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Persisting an interface preference is optional.
    }
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}
