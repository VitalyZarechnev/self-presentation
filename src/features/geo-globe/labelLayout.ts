export type PinProjection = {
  index: number;
  front: number;
  sx: number;
  sy: number;
  important: boolean;
};

export type LabelSize = { w: number; h: number };
export type LabelSlot = { visible: boolean; left: number; top: number };
export type PlacedBox = { cx: number; cy: number; w: number; h: number };

const GAP = 4;

const byPriority = (a: PinProjection, b: PinProjection): number => Number(b.important) - Number(a.important) || b.front - a.front;

export function layoutLabels(
  pins: PinProjection[],
  sizes: readonly (LabelSize | undefined)[],
  placed: PlacedBox[],
  out: LabelSlot[],
): void {
  for (let i = 0; i < pins.length; i += 1) out[pins[i].index].visible = false;

  pins.sort(byPriority);

  let placedCount = 0;
  for (const pin of pins) {
    if (pin.front <= 0.1) continue;
    const size = sizes[pin.index];
    if (!size || size.w === 0) continue;
    if (pin.sy < size.h * 1.5) continue;

    const cx = pin.sx;
    const cy = pin.sy - size.h;
    let overlaps = false;
    for (let p = 0; p < placedCount; p += 1) {
      const other = placed[p];
      if (Math.abs(other.cx - cx) < (other.w + size.w) / 2 + GAP && Math.abs(other.cy - cy) < (other.h + size.h) / 2 + GAP) {
        overlaps = true;
        break;
      }
    }
    if (overlaps) continue;

    const box = placed[placedCount];
    box.cx = cx;
    box.cy = cy;
    box.w = size.w;
    box.h = size.h;
    placedCount += 1;

    const slot = out[pin.index];
    slot.visible = true;
    slot.left = pin.sx;
    slot.top = pin.sy;
  }
}
