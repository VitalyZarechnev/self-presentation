import { contrastRatio } from '@utils/color';

import {
  buildCustomVars,
  defaultCustomTheme,
  MIN_ACCENT_CONTRAST,
  MIN_INK_CONTRAST,
  MIN_MUTED_CONTRAST,
  resolveAccent,
  resolveNeutrals,
  toDesignTokens,
} from './customTheme';

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
