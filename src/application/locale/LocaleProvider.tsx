'use client';

import { createContext, PropsWithChildren, useContext, useState } from 'react';

import { DEFAULT_LOCALE, isLocale, TLocale, TLocalized } from '@domain/locale/locale';

import { useIsomorphicLayoutEffect } from '@utils/hooks/useIsomorphicLayoutEffect';

import { LOCALE_QUERY_PARAM, LOCALE_STORAGE_KEY } from './locales';

type TLocaleContext = {
  locale: TLocale;
  setLocale: (locale: TLocale) => void;
};

const LocaleContext = createContext<TLocaleContext>({ locale: DEFAULT_LOCALE, setLocale: () => {} });

export const useLocale = (): TLocaleContext => useContext(LocaleContext);

export function useLocalized<C extends TLocalized<unknown>>(content: C): C[TLocale] {
  return content[useLocale().locale];
}

// Metadata is prerendered in the default locale and Next streams it in after hydration,
// so the tab title is re-applied whenever the <head> changes underneath it.
export function useLocalizedTitle(titles: TLocalized<string>): void {
  const { locale } = useLocale();
  const title = titles[locale];

  useIsomorphicLayoutEffect(() => {
    const apply = (): void => {
      if (document.title !== title) document.title = title;
    };
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.head, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [title]);
}

function persist(locale: TLocale): void {
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // Storage can be blocked (private mode, in-app browsers); the choice then lasts for this visit only.
  }

  // A shared link may pin the language; keep it truthful instead of fighting the switch on reload.
  const url = new URL(window.location.href);
  if (url.searchParams.has(LOCALE_QUERY_PARAM)) {
    url.searchParams.set(LOCALE_QUERY_PARAM, locale);
    window.history.replaceState(window.history.state, '', url);
  }
}

export default function LocaleProvider({ children }: PropsWithChildren) {
  const [locale, setLocaleState] = useState<TLocale>(DEFAULT_LOCALE);

  // locale-init.js has already chosen the language before paint; hydrate in the default one, then adopt it.
  useIsomorphicLayoutEffect(() => {
    const applied = document.documentElement.lang;
    if (isLocale(applied) && applied !== DEFAULT_LOCALE) setLocaleState(applied);
  }, []);

  useIsomorphicLayoutEffect(() => {
    const root = document.documentElement;
    const pending = root.dataset.localePending;
    if (pending && pending !== locale) return;

    root.lang = locale;
    delete root.dataset.localePending;
  }, [locale]);

  const setLocale = (next: TLocale): void => {
    setLocaleState(next);
    persist(next);
  };

  return <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>;
}
