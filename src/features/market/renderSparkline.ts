type TSparklineOptions = {
  canvas: HTMLCanvasElement;
  points: readonly number[];
  color: string;
  lineWidth?: number;
  padding?: number;
};

type TPoint = readonly [x: number, y: number];

const MAX_DEVICE_PIXEL_RATIO = 2;
const DEFAULT_LINE_WIDTH = 1.5;
const DEFAULT_PADDING = 4;
const MIN_POINTS = 2;

function devicePixelRatio(): number {
  return Math.min(window.devicePixelRatio || 1, MAX_DEVICE_PIXEL_RATIO);
}

function fitBackingStore(canvas: HTMLCanvasElement, ratio: number): { width: number; height: number } {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (canvas.width !== width * ratio || canvas.height !== height * ratio) {
    canvas.width = width * ratio;
    canvas.height = height * ratio;
  }
  return { width, height };
}

function projectPoints(values: readonly number[], width: number, height: number, padding: number): TPoint[] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const drawableHeight = height - padding * 2;
  const lastIndex = values.length - 1;

  return values.map((value, index) => {
    const x = (index / lastIndex) * width;
    const y = height - padding - ((value - min) / range) * drawableHeight;
    return [x, y] as const;
  });
}

function tracePath(context: CanvasRenderingContext2D, points: readonly TPoint[]): void {
  context.beginPath();
  points.forEach(([x, y], index) => {
    if (index === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  });
}

export function renderSparkline({
  canvas,
  points,
  color,
  lineWidth = DEFAULT_LINE_WIDTH,
  padding = DEFAULT_PADDING,
}: TSparklineOptions): void {
  const context = canvas.getContext('2d');
  if (!context) return;

  const ratio = devicePixelRatio();
  const { width, height } = fitBackingStore(canvas, ratio);

  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.clearRect(0, 0, width, height);
  if (points.length < MIN_POINTS) return;

  tracePath(context, projectPoints(points, width, height, padding));

  context.strokeStyle = color;
  context.lineWidth = lineWidth;
  context.lineJoin = 'round';
  context.lineCap = 'round';
  context.stroke();
}
