import { contrastRatio, hexToRgba, oklchToHex } from '@utils/color';

import { TTheme } from './themes';

export type TCustomTheme = {
  base: TTheme;
  surfaceHue: number | null;
  accentHue: number | null;
};

export type TResolvedAccent = { hex: string; contrast: number; adjusted: boolean };

export type TResolvedNeutrals = {
  vars: Record<string, string>;
  surface: string;
  inkContrast: number;
  mutedContrast: number;
};

type TShape = { l: number; c: number };

export const MIN_ACCENT_CONTRAST = 4.5;
export const MIN_INK_CONTRAST = 7;
export const MIN_MUTED_CONTRAST = 4.5;
export const CUSTOM_VAR_NAMES = [
  '--surface',
  '--surface-raised',
  '--surface-blur',
  '--surface-grid',
  '--grid-column',
  '--line',
  '--ink',
  '--ink-muted',
  '--accent',
  '--accent-soft',
  '--page-frame',
] as const;

export const DEFAULT_SURFACE_HUE: Record<TTheme, number> = { blueprint: 247, 'barely-there': 87 };
export const DEFAULT_ACCENT_HUE: Record<TTheme, number> = { blueprint: 249, 'barely-there': 30 };

const LIGHTNESS_STEP = 0.01;

export const ACCENT_SHAPE: Record<'dark' | 'light', TShape> = {
  dark: { l: 0.74, c: 0.14 },
  light: { l: 0.46, c: 0.14 },
};

export const SURFACE_PREVIEW: TShape = { l: 0.55, c: 0.09 };

const NEUTRALS: Record<'dark' | 'light', Record<string, TShape>> = {
  dark: {
    surface: { l: 0.244, c: 0.042 },
    raised: { l: 0.3, c: 0.058 },
    line: { l: 0.398, c: 0.08 },
    grid: { l: 0.72, c: 0.09 },
    ink: { l: 0.961, c: 0.019 },
    muted: { l: 0.762, c: 0.072 },
  },
  light: {
    surface: { l: 0.977, c: 0.01 },
    raised: { l: 0.994, c: 0.007 },
    grid: { l: 0.919, c: 0.017 },
    gridColumn: { l: 0.88, c: 0.021 },
    line: { l: 0.868, c: 0.019 },
    ink: { l: 0.242, c: 0.006 },
    muted: { l: 0.502, c: 0.014 },
    soft: { l: 0.938, c: 0.014 },
  },
};

const DARK_ALPHA = { blur: 0.55, grid: 0.1, gridColumn: 0.2, soft: 0.14, frame: 0.28 } as const;
const LIGHT_BLUR_ALPHA = 0.7;

export const isDarkTheme = (theme: TTheme): boolean => theme === 'blueprint';

export function defaultCustomTheme(base: TTheme): TCustomTheme {
  return { base, surfaceHue: null, accentHue: null };
}

const tone = (shape: TShape, hue: number): string => oklchToHex(shape.l, shape.c, hue);

function liftUntil(shape: TShape, hue: number, step: number, passes: (hex: string) => boolean): string {
  let lightness = shape.l;
  let hex = tone(shape, hue);
  while (!passes(hex) && lightness > 0 && lightness < 1) {
    lightness += step;
    hex = oklchToHex(lightness, shape.c, hue);
  }
  return hex;
}

export function resolveAccent(params: { hue: number; surface: string; dark: boolean }): TResolvedAccent {
  const { hue, surface, dark } = params;
  const shape = ACCENT_SHAPE[dark ? 'dark' : 'light'];
  const initial = tone(shape, hue);
  const hex = liftUntil(
    shape,
    hue,
    dark ? LIGHTNESS_STEP : -LIGHTNESS_STEP,
    (candidate) => contrastRatio(candidate, surface) >= MIN_ACCENT_CONTRAST,
  );
  return { hex, contrast: contrastRatio(hex, surface), adjusted: hex !== initial };
}

export function resolveNeutrals(params: { hue: number; dark: boolean }): TResolvedNeutrals {
  const { hue, dark } = params;

  if (dark) {
    const n = NEUTRALS.dark;
    const surface = tone(n.surface, hue);
    const raised = tone(n.raised, hue);
    const grid = tone(n.grid, hue);
    const softest = oklchToHex(n.raised.l + 0.05, n.raised.c, hue);
    const ink = liftUntil(n.ink, hue, LIGHTNESS_STEP, (hex) => contrastRatio(hex, raised) >= MIN_INK_CONTRAST);
    const muted = liftUntil(n.muted, hue, LIGHTNESS_STEP, (hex) => contrastRatio(hex, softest) >= MIN_MUTED_CONTRAST);
    return {
      surface,
      inkContrast: contrastRatio(ink, surface),
      mutedContrast: contrastRatio(muted, softest),
      vars: {
        '--surface': surface,
        '--surface-raised': raised,
        '--surface-blur': hexToRgba(surface, DARK_ALPHA.blur),
        '--surface-grid': hexToRgba(grid, DARK_ALPHA.grid),
        '--grid-column': hexToRgba(grid, DARK_ALPHA.gridColumn),
        '--line': tone(n.line, hue),
        '--ink': ink,
        '--ink-muted': muted,
      },
    };
  }

  const n = NEUTRALS.light;
  const surface = tone(n.surface, hue);
  const soft = tone(n.soft, hue);
  const ink = liftUntil(n.ink, hue, -LIGHTNESS_STEP, (hex) => contrastRatio(hex, surface) >= MIN_INK_CONTRAST);
  const muted = liftUntil(n.muted, hue, -LIGHTNESS_STEP, (hex) => contrastRatio(hex, soft) >= MIN_MUTED_CONTRAST);
  return {
    surface,
    inkContrast: contrastRatio(ink, surface),
    mutedContrast: contrastRatio(muted, soft),
    vars: {
      '--surface': surface,
      '--surface-raised': tone(n.raised, hue),
      '--surface-blur': hexToRgba(surface, LIGHT_BLUR_ALPHA),
      '--surface-grid': tone(n.grid, hue),
      '--grid-column': tone(n.gridColumn, hue),
      '--line': tone(n.line, hue),
      '--ink': ink,
      '--ink-muted': muted,
      '--accent-soft': soft,
    },
  };
}

export function buildCustomVars(theme: TCustomTheme, baseSurface: string): Record<string, string> {
  const dark = isDarkTheme(theme.base);
  const neutrals = theme.surfaceHue === null ? null : resolveNeutrals({ hue: theme.surfaceHue, dark });
  const surface = neutrals?.surface ?? baseSurface;
  const vars = { ...neutrals?.vars };

  if (theme.accentHue === null) return vars;

  const accent = resolveAccent({ hue: theme.accentHue, surface, dark }).hex;
  return {
    ...vars,
    '--accent': accent,
    ...(dark ? { '--accent-soft': hexToRgba(accent, DARK_ALPHA.soft), '--page-frame': hexToRgba(accent, DARK_ALPHA.frame) } : {}),
  };
}

type TDesignToken = { $type: string; $value: string };
type TDesignTokenGroups = Record<string, Record<string, TDesignToken>>;

function tokenGroup(name: string, value: string): { group: string; type: string } {
  if (name.startsWith('--font')) return { group: 'typography', type: 'fontFamily' };
  if (/px$/.test(value)) return { group: 'dimension', type: 'dimension' };
  if (/^(#|rgb|hsl|oklch)/i.test(value)) return { group: 'color', type: 'color' };
  return { group: 'other', type: 'string' };
}

export function toDesignTokens(vars: Record<string, string>): TDesignTokenGroups {
  return Object.entries(vars).reduce<TDesignTokenGroups>((groups, [name, value]) => {
    const { group, type } = tokenGroup(name, value);
    const key = name.replace(/^--/, '');
    return { ...groups, [group]: { ...groups[group], [key]: { $type: type, $value: value } } };
  }, {});
}
