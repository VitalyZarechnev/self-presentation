'use client';

import { createContext, PropsWithChildren, useContext, useState } from 'react';

import { useIsomorphicLayoutEffect } from '@utils/hooks/useIsomorphicLayoutEffect';

import { buildCustomVars, CUSTOM_VAR_NAMES, defaultCustomTheme, TCustomTheme } from './customTheme';
import { DEFAULT_THEME, isTheme, THEME_STORAGE_KEY, THEMES, TTheme } from './themes';

export type TThemeSelection = TTheme | 'custom';

type TThemeContext = {
  theme: TTheme;
  themes: readonly TTheme[];
  selection: TThemeSelection;
  custom: TCustomTheme | null;
  setTheme: (theme: TTheme) => void;
  selectCustom: () => void;
  updateCustom: (patch: Partial<Omit<TCustomTheme, 'base'>>) => void;
  resetCustom: () => void;
};

const ThemeContext = createContext<TThemeContext>({
  theme: DEFAULT_THEME,
  themes: THEMES,
  selection: DEFAULT_THEME,
  custom: null,
  setTheme: () => {},
  selectCustom: () => {},
  updateCustom: () => {},
  resetCustom: () => {},
});

export const useTheme = (): TThemeContext => useContext(ThemeContext);

function applyCustomVars(root: HTMLElement, custom: TCustomTheme | null): void {
  CUSTOM_VAR_NAMES.forEach((name) => root.style.removeProperty(name));
  if (!custom) {
    delete root.dataset.custom;
    return;
  }

  const surface = getComputedStyle(root).getPropertyValue('--surface').trim();
  Object.entries(buildCustomVars(custom, surface)).forEach(([name, value]) => root.style.setProperty(name, value));
  root.dataset.custom = 'true';
}

export default function ThemeProvider({ children }: PropsWithChildren) {
  const [baseTheme, setBaseTheme] = useState<TTheme>(DEFAULT_THEME);
  const [custom, setCustom] = useState<TCustomTheme | null>(null);
  const [customActive, setCustomActive] = useState(false);

  const theme = customActive && custom ? custom.base : baseTheme;
  const selection: TThemeSelection = customActive && custom ? 'custom' : baseTheme;

  useIsomorphicLayoutEffect(() => {
    const applied = document.documentElement.dataset.theme;
    if (isTheme(applied)) setBaseTheme(applied);
  }, []);

  useIsomorphicLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    applyCustomVars(root, customActive ? custom : null);
  }, [theme, custom, customActive]);

  useIsomorphicLayoutEffect(() => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, baseTheme);
    } catch {
      return;
    }
  }, [baseTheme]);

  const setTheme = (next: TTheme): void => {
    setBaseTheme(next);
    setCustomActive(false);
  };

  const selectCustom = (): void => {
    if (custom) setCustomActive(true);
  };

  const updateCustom = (patch: Partial<Omit<TCustomTheme, 'base'>>): void => {
    setCustom((prev) => ({ ...(prev ?? defaultCustomTheme(theme)), ...patch }));
    setCustomActive(true);
  };

  const resetCustom = (): void => {
    if (custom) setBaseTheme(custom.base);
    setCustom(null);
    setCustomActive(false);
  };

  return (
    <ThemeContext.Provider value={{ theme, themes: THEMES, selection, custom, setTheme, selectCustom, updateCustom, resetCustom }}>
      {children}
    </ThemeContext.Provider>
  );
}
