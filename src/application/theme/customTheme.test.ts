import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { contrastRatio, hexToOklch } from '@utils/color';

import {
  buildCustomVars,
  clearOfStatus,
  DEFAULT_ACCENT_HUE,
  defaultCustomTheme,
  MIN_ACCENT_CONTRAST,
  MIN_INK_CONTRAST,
  MIN_MUTED_CONTRAST,
  resolveAccent,
  resolveNeutrals,
  STATUS_COLORS,
  STATUS_HUE_CLEARANCE,
  statusHueBands,
  toDesignTokens,
} from './customTheme';
import { THEMES } from './themes';

const BLUEPRINT_SURFACE = '#0e2233';
const PAPER_SURFACE = '#faf7f0';
const HUES = [0, 45, 90, 135, 180, 225, 247, 300];

describe('resolveAccent', () => {
  test.each(HUES)('keeps hue %i readable on the dark base', (hue) => {
    const accent = resolveAccent({ hue, surface: BLUEPRINT_SURFACE, dark: true });
    expect(contrastRatio(accent.hex, BLUEPRINT_SURFACE)).toBeGreaterThanOrEqual(MIN_ACCENT_CONTRAST);
  });

  test.each(HUES)('keeps hue %i readable on the paper base', (hue) => {
    const accent = resolveAccent({ hue, surface: PAPER_SURFACE, dark: false });
    expect(contrastRatio(accent.hex, PAPER_SURFACE)).toBeGreaterThanOrEqual(MIN_ACCENT_CONTRAST);
  });
});

describe('resolveNeutrals', () => {
  test('reproduces the stock blueprint surface at its own hue', () => {
    expect(resolveNeutrals({ hue: 246, dark: true }).surface).toBe(BLUEPRINT_SURFACE);
  });

  test.each(HUES)('dark base at hue %i keeps text contrast floors', (hue) => {
    const { inkContrast, mutedContrast } = resolveNeutrals({ hue, dark: true });
    expect(inkContrast).toBeGreaterThanOrEqual(MIN_INK_CONTRAST);
    expect(mutedContrast).toBeGreaterThanOrEqual(MIN_MUTED_CONTRAST);
  });

  test.each(HUES)('light base at hue %i keeps text contrast floors', (hue) => {
    const { inkContrast, mutedContrast } = resolveNeutrals({ hue, dark: false });
    expect(inkContrast).toBeGreaterThanOrEqual(MIN_INK_CONTRAST);
    expect(mutedContrast).toBeGreaterThanOrEqual(MIN_MUTED_CONTRAST);
  });
});

describe('buildCustomVars', () => {
  test('changes nothing until a picker moves', () => {
    expect(buildCustomVars(defaultCustomTheme('blueprint'), BLUEPRINT_SURFACE)).toEqual({});
  });

  test('a background hue retints surfaces, lines and text only', () => {
    const vars = buildCustomVars({ ...defaultCustomTheme('blueprint'), surfaceHue: 150 }, BLUEPRINT_SURFACE);
    expect(Object.keys(vars).sort()).toEqual(
      ['--grid-column', '--ink', '--ink-muted', '--line', '--surface', '--surface-blur', '--surface-grid', '--surface-raised'].sort(),
    );
  });

  test('accent is checked against the retinted surface', () => {
    const vars = buildCustomVars({ ...defaultCustomTheme('barely-there'), surfaceHue: 20, accentHue: 200 }, PAPER_SURFACE);
    expect(contrastRatio(vars['--accent'], vars['--surface'])).toBeGreaterThanOrEqual(MIN_ACCENT_CONTRAST);
  });

  test('dark accent also drives soft accent and page frame', () => {
    const vars = buildCustomVars({ ...defaultCustomTheme('blueprint'), accentHue: 140 }, BLUEPRINT_SURFACE);
    expect(vars['--accent-soft']).toMatch(/^rgba\(.+, 0\.14\)$/);
    expect(vars['--page-frame']).toMatch(/^rgba\(.+, 0\.28\)$/);
  });
});

const hueGap = (a: number, b: number): number => Math.abs(((a - b + 540) % 360) - 180);

describe('status hue clearance', () => {
  test('status colours mirror themes.scss', () => {
    const scss = readFileSync(join(process.cwd(), 'src/assets/styles/themes.scss'), 'utf8');
    THEMES.forEach((theme) => {
      expect(scss).toContain(`--danger: ${STATUS_COLORS[theme].danger};`);
      expect(scss).toContain(`--positive: ${STATUS_COLORS[theme].positive};`);
    });
  });

  test.each(THEMES)('%s: every hue lands clear of both status colours', (theme) => {
    const statusHues = Object.values(STATUS_COLORS[theme]).map((hex) => hexToOklch(hex).h);
    for (let hue = 0; hue < 360; hue += 1) {
      const cleared = clearOfStatus(hue, theme);
      statusHues.forEach((status) => expect(hueGap(cleared.hue, status)).toBeGreaterThanOrEqual(STATUS_HUE_CLEARANCE));
    }
  });

  test('a hue on the danger colour snaps to the nearest edge and names it', () => {
    const danger = hexToOklch(STATUS_COLORS.blueprint.danger).h;
    const above = clearOfStatus(Math.round(danger) + 5, 'blueprint');
    const below = clearOfStatus(Math.round(danger) - 5, 'blueprint');
    expect(above).toEqual({ hue: Math.ceil(danger + STATUS_HUE_CLEARANCE), avoided: 'danger' });
    expect(below.avoided).toBe('danger');
    expect(below.hue).toBeLessThan(360);
    expect(hueGap(below.hue, danger)).toBeLessThan(STATUS_HUE_CLEARANCE + 1);
  });

  test('a free hue passes untouched', () => {
    expect(clearOfStatus(249, 'blueprint')).toEqual({ hue: 249, avoided: null });
  });

  test.each(THEMES)('%s: the default accent hue starts outside the bands', (theme) => {
    expect(clearOfStatus(DEFAULT_ACCENT_HUE[theme], theme).avoided).toBeNull();
  });

  test('bands describe both statuses as track segments', () => {
    const bands = statusHueBands('blueprint');
    expect(bands.map((band) => band.status).sort()).toEqual(['danger', 'positive']);
    bands.forEach((band) => expect(band.to - band.from).toBeCloseTo(STATUS_HUE_CLEARANCE * 2));
  });

  test('custom vars never ship an accent in a status band', () => {
    const vars = buildCustomVars({ ...defaultCustomTheme('blueprint'), accentHue: 25 }, BLUEPRINT_SURFACE);
    const danger = hexToOklch(STATUS_COLORS.blueprint.danger).h;
    expect(hueGap(hexToOklch(vars['--accent']).h, danger)).toBeGreaterThan(STATUS_HUE_CLEARANCE - 3);
  });
});

describe('toDesignTokens', () => {
  test('emits W3C design tokens with types', () => {
    expect(toDesignTokens({ '--accent': '#5db0ff', '--surface-blur': 'rgba(14, 34, 51, 0.55)' })).toEqual({
      color: {
        accent: { $type: 'color', $value: '#5db0ff' },
        'surface-blur': { $type: 'color', $value: 'rgba(14, 34, 51, 0.55)' },
      },
    });
  });
});
