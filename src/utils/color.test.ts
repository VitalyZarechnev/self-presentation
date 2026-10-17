import { contrastRatio, hexToOklch, hexToRgba, oklchToHex } from './color';

describe('color utils', () => {
  test('contrastRatio matches WCAG for black on white', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 1);
    expect(contrastRatio('#ffffff', '#ffffff')).toBeCloseTo(1, 5);
  });

  test('oklch round-trips a site colour within one channel step', () => {
    const { l, c, h } = hexToOklch('#5db0ff');
    expect(oklchToHex(l, c, h)).toBe('#5db0ff');
  });

  test('oklchToHex clamps out-of-gamut colours into sRGB', () => {
    expect(oklchToHex(0.9, 0.4, 140)).toMatch(/^#[0-9a-f]{6}$/);
  });

  test('hexToRgba applies alpha', () => {
    expect(hexToRgba('#5db0ff', 0.14)).toBe('rgba(93, 176, 255, 0.14)');
  });
});
