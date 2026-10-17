import { RefObject, useEffect, useRef } from 'react';

import { useTheme } from '@application/theme/ThemeProvider';

import { renderSparkline } from './renderSparkline';

const DEFAULT_ACCENT = '#5db0ff';

type TParams = {
  rootRef: RefObject<HTMLElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  points: readonly number[];
};

function accentColor(el: Element): string {
  return getComputedStyle(el).getPropertyValue('--accent').trim() || DEFAULT_ACCENT;
}

export default function useSparklineCanvas(params: TParams) {
  const { rootRef, canvasRef, points } = params;
  const { theme, selection, custom } = useTheme();
  const drawRef = useRef<() => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const color = rootRef.current ? accentColor(rootRef.current) : DEFAULT_ACCENT;
    drawRef.current = () => renderSparkline({ canvas, points, color });
    drawRef.current();
  }, [canvasRef, rootRef, points, theme, selection, custom]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const observer = new ResizeObserver(() => drawRef.current());
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [canvasRef]);
}
