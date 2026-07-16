import { describe, expect, it } from 'vitest';

import { distanceKm, hemisphere } from './cityStats';

describe('distanceKm', () => {
  it('is zero for the same point', () => {
    expect(distanceKm({ lat: 56.49, lon: 84.95 }, { lat: 56.49, lon: 84.95 })).toBe(0);
  });

  it('matches the known Tomsk → Moscow great-circle distance', () => {
    const km = distanceKm({ lat: 56.49, lon: 84.95 }, { lat: 55.75, lon: 37.62 });
    expect(km).toBeGreaterThan(2800);
    expect(km).toBeLessThan(2950);
  });

  it('is symmetric', () => {
    const a = { lat: 41.01, lon: 28.98 };
    const b = { lat: 13.76, lon: 100.5 };
    expect(distanceKm(a, b)).toBeCloseTo(distanceKm(b, a), 6);
  });
});

describe('hemisphere', () => {
  it('labels northern-eastern and southern points', () => {
    expect(hemisphere({ lat: 56.49, lon: 84.95 })).toBe('Северное · Восточное');
    expect(hemisphere({ lat: -6.16, lon: 39.19 })).toBe('Южное · Восточное');
  });
});
