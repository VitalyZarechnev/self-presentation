import { useEffect, useRef, useState } from 'react';

export function useAnimatedNumber(target: number, duration = 550): number {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  const latestRef = useRef(target);

  useEffect(() => {
    const from = fromRef.current;
    if (from === target) return undefined;

    let raf = 0;
    let start = 0;
    const step = (now: number): void => {
      if (!start) start = now;
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - progress) ** 3;
      const current = from + (target - from) * eased;
      latestRef.current = current;
      setValue(current);
      if (progress < 1) raf = requestAnimationFrame(step);
      else fromRef.current = target;
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      fromRef.current = latestRef.current;
    };
  }, [target, duration]);

  return value;
}
