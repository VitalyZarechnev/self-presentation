export const CELL = 100;

export const X_STROKES = ['M26 24 Q50 50 76 78', 'M77 25 Q50 52 24 77'];
export const O_STROKE = 'M53 20 C34 19 20 33 20 50 C20 68 34 81 51 81 C69 81 81 65 80 47 C79 31 67 20 51 20';

export const GRID_LINES = ['M8 100 Q150 98 292 100', 'M8 200 Q150 202 292 200', 'M100 8 Q102 150 100 292', 'M200 8 Q198 150 200 292'];

export const GRID_DRAW_STEP = 0.18;

function colOf(index: number): number {
  return index % 3;
}

function rowOf(index: number): number {
  return Math.floor(index / 3);
}

export function cellTranslate(index: number): string {
  return `${colOf(index) * CELL} ${rowOf(index) * CELL}`;
}

export function centerOf(index: number): { x: number; y: number } {
  return { x: colOf(index) * CELL + CELL / 2, y: rowOf(index) * CELL + CELL / 2 };
}

export type TCrumb = { left: number; top: number; dx: number; dy: number; delay: number; size: number };

export const ERASER_CRUMBS: readonly TCrumb[] = [
  { left: 24, top: 12, dx: -6, dy: 34, delay: 0.1, size: 4 },
  { left: 58, top: 16, dx: 8, dy: 40, delay: 0.25, size: 3 },
  { left: 42, top: 20, dx: -3, dy: 36, delay: 0.35, size: 3 },
  { left: 66, top: 28, dx: 10, dy: 30, delay: 0.45, size: 4 },
  { left: 30, top: 34, dx: -9, dy: 32, delay: 0.55, size: 3 },
  { left: 52, top: 40, dx: 5, dy: 30, delay: 0.65, size: 4 },
  { left: 20, top: 44, dx: -7, dy: 28, delay: 0.75, size: 3 },
  { left: 70, top: 50, dx: 9, dy: 26, delay: 0.85, size: 3 },
  { left: 38, top: 54, dx: -4, dy: 28, delay: 0.95, size: 4 },
  { left: 60, top: 58, dx: 11, dy: 22, delay: 1.05, size: 3 },
  { left: 26, top: 62, dx: -8, dy: 24, delay: 1.15, size: 3 },
  { left: 50, top: 68, dx: 4, dy: 22, delay: 1.25, size: 4 },
  { left: 72, top: 72, dx: 10, dy: 18, delay: 1.35, size: 3 },
  { left: 18, top: 76, dx: -6, dy: 20, delay: 1.45, size: 3 },
  { left: 44, top: 80, dx: 3, dy: 18, delay: 1.55, size: 4 },
  { left: 62, top: 84, dx: 8, dy: 16, delay: 1.65, size: 3 },
];

export function winLinePath(line: readonly number[]): string {
  const a = centerOf(line[0]);
  const b = centerOf(line[line.length - 1]);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length = Math.hypot(dx, dy) || 1;
  const extendX = (dx / length) * 22;
  const extendY = (dy / length) * 22;
  return `M${a.x - extendX} ${a.y - extendY} L${b.x + extendX} ${b.y + extendY}`;
}
