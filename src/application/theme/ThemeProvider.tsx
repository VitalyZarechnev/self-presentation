'use client';

import { createContext, PropsWithChildren, useContext, useState } from 'react';

import { useIsomorphicLayoutEffect } from '@utils/hooks/useIsomorphicLayoutEffect';

import { DEFAULT_THEME, isTheme, THEME_STORAGE_KEY, THEMES, TTheme } from './themes';

type TThemeContext = {
  theme: TTheme;
  themes: readonly TTheme[];
  setTheme: (theme: TTheme) => void;
};

const ThemeContext = createContext<TThemeContext>({
  theme: DEFAULT_THEME,
  themes: THEMES,
  setTheme: () => {},
});

export const useTheme = (): TThemeContext => useContext(ThemeContext);

export default function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<TTheme>(DEFAULT_THEME);

  useIsomorphicLayoutEffect(() => {
    const applied = document.documentElement.dataset.theme;
    if (isTheme(applied)) setTheme(applied);
  }, []);

  useIsomorphicLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      return;
    }
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, themes: THEMES, setTheme }}>{children}</ThemeContext.Provider>;
}
