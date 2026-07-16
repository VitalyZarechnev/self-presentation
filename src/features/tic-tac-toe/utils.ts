export function nearestGridOffset(value: number, cell: number): number {
  const offset = ((value % cell) + cell) % cell;
  return offset > cell / 2 ? cell - offset : -offset;
}

export function boardsThatFit(available: number, cell: number, max: number): number {
  const boardWidth = cell * 3;
  const step = cell * 4;
  const fit = Math.floor((available - boardWidth) / step) + 1;
  return Math.max(1, Math.min(max, fit));
}
