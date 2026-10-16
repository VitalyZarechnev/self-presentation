import { act, renderHook } from '@testing-library/react';

import { usePrefersReducedMotion } from './usePrefersReducedMotion';

type TListener = (event: MediaQueryListEvent) => void;

function mockMatchMedia(initial: boolean) {
  const listeners = new Set<TListener>();
  const query = {
    matches: initial,
    addEventListener: (_: string, listener: TListener) => listeners.add(listener),
    removeEventListener: (_: string, listener: TListener) => listeners.delete(listener),
  };
  window.matchMedia = vi.fn().mockReturnValue(query);

  return (matches: boolean) => {
    query.matches = matches;
    listeners.forEach((listener) => listener({ matches } as MediaQueryListEvent));
  };
}

describe('usePrefersReducedMotion', () => {
  test('reads the current preference', () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(true);
  });

  test('follows changes to the preference', () => {
    const change = mockMatchMedia(false);
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);

    act(() => change(true));
    expect(result.current).toBe(true);
  });
});
