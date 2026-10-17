import { PropsWithChildren } from 'react';
import { act, renderHook } from '@testing-library/react';

import ThemeProvider, { useTheme } from './ThemeProvider';

const wrapper = ({ children }: PropsWithChildren) => <ThemeProvider>{children}</ThemeProvider>;

describe('ThemeProvider custom theme', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('style');
    delete document.documentElement.dataset.custom;
  });

  test('editing creates a custom theme on top of the current one and selects it', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => result.current.updateCustom({ surfaceHue: 150 }));

    expect(result.current.selection).toBe('custom');
    expect(result.current.custom?.base).toBe('blueprint');
    expect(document.documentElement.dataset.custom).toBe('true');
    expect(document.documentElement.style.getPropertyValue('--surface')).toMatch(/^#[0-9a-f]{6}$/);
  });

  test('picking a stock theme keeps the custom one for later and clears inline vars', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    act(() => result.current.updateCustom({ surfaceHue: 150 }));

    act(() => result.current.setTheme('barely-there'));
    expect(result.current.selection).toBe('barely-there');
    expect(result.current.custom).not.toBeNull();
    expect(document.documentElement.style.getPropertyValue('--surface')).toBe('');

    act(() => result.current.selectCustom());
    expect(result.current.selection).toBe('custom');
    expect(document.documentElement.dataset.theme).toBe('blueprint');
  });

  test('reset drops the custom theme and returns to its base', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    act(() => result.current.updateCustom({ accentHue: 20 }));

    act(() => result.current.resetCustom());
    expect(result.current.custom).toBeNull();
    expect(result.current.selection).toBe('blueprint');
    expect(document.documentElement.dataset.custom).toBeUndefined();
  });
});
