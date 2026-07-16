'use client';

import { createContext, PropsWithChildren, useContext, useState } from 'react';

import { cookies } from '@utils/cookies';
import { useIsomorphicLayoutEffect } from '@utils/hooks/useIsomorphicLayoutEffect';

import { DEFAULT_THEME, THEME_COOKIE, THEMES, TTheme } from './themes';

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

type TProps = {
  initialTheme: TTheme;
};

export default function ThemeProvider(props: PropsWithChildren & TProps) {
  const { initialTheme, children } = props;

  const [theme, setTheme] = useState<TTheme>(initialTheme);

  useIsomorphicLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    cookies.set(THEME_COOKIE, theme, { path: '/', maxAge: 86400 * 365, sameSite: 'lax' });
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, themes: THEMES, setTheme }}>{children}</ThemeContext.Provider>;
}
