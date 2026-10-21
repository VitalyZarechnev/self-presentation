import { PropsWithChildren } from 'react';
import { act, renderHook } from '@testing-library/react';

import LocaleProvider, { useLocale, useLocalized } from './LocaleProvider';
import { LOCALE_STORAGE_KEY } from './locales';

const wrapper = ({ children }: PropsWithChildren) => <LocaleProvider>{children}</LocaleProvider>;

describe('LocaleProvider', () => {
  afterEach(() => {
    const root = document.documentElement;
    root.lang = '';
    delete root.dataset.localePending;
    window.localStorage.clear();
    window.history.replaceState(null, '', '/');
  });

  test('stays in Russian when nothing else was asked for', () => {
    const { result } = renderHook(() => useLocale(), { wrapper });
    expect(result.current.locale).toBe('ru');
    expect(document.documentElement.lang).toBe('ru');
  });

  test('adopts the language locale-init.js picked and lifts the loader', () => {
    const root = document.documentElement;
    root.lang = 'en';
    root.dataset.localePending = 'en';

    const { result } = renderHook(() => useLocalized({ ru: 'Привет', en: 'Hello' }), { wrapper });

    expect(result.current).toBe('Hello');
    expect(root.dataset.localePending).toBeUndefined();
    expect(root.lang).toBe('en');
  });

  test('switching saves the choice and keeps a pinned ?lang= truthful', () => {
    window.history.replaceState(null, '', '/?lang=ru');
    const { result } = renderHook(() => useLocale(), { wrapper });

    act(() => result.current.setLocale('en'));

    expect(result.current.locale).toBe('en');
    expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('en');
    expect(window.location.search).toBe('?lang=en');
  });

  test('switching does not add ?lang= to a clean address', () => {
    const { result } = renderHook(() => useLocale(), { wrapper });

    act(() => result.current.setLocale('en'));

    expect(window.location.search).toBe('');
  });
});
