import { act, renderHook } from '@testing-library/react';

import useFeedStall from './useFeedStall';

const TIMEOUT = 4000;

describe('useFeedStall', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  test('reports a stall when an active feed brings no data in time', () => {
    const { result } = renderHook(() => useFeedStall({ active: true, hasData: false, timeout: TIMEOUT }));
    expect(result.current).toBe(false);

    act(() => vi.advanceTimersByTime(TIMEOUT));
    expect(result.current).toBe(true);
  });

  test('clears the stall as soon as data arrives', () => {
    const { result, rerender } = renderHook((props) => useFeedStall(props), {
      initialProps: { active: true, hasData: false, timeout: TIMEOUT },
    });
    act(() => vi.advanceTimersByTime(TIMEOUT));
    expect(result.current).toBe(true);

    rerender({ active: true, hasData: true, timeout: TIMEOUT });
    expect(result.current).toBe(false);
  });

  test('never stalls while the feed is inactive', () => {
    const { result } = renderHook(() => useFeedStall({ active: false, hasData: false, timeout: TIMEOUT }));
    act(() => vi.advanceTimersByTime(TIMEOUT * 2));
    expect(result.current).toBe(false);
  });
});
