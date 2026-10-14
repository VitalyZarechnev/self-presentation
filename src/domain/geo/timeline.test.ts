import { describe, expect, it } from 'vitest';

import { buildTimeline, sampleTimeline } from './timeline';
import { TResolvedTrip } from './trips';

const city = (name: string, lon: number) => ({ name, lat: 0, lon, country: 'X', tz: 0 });

const tripA: TResolvedTrip = {
  id: 'a',
  title: 'A',
  waypoints: [
    { city: city('A0', 0), date: '2021-01-01', time: Date.parse('2021-01-01'), transport: 'airplane' },
    { city: city('A1', 10), date: '2021-01-03', time: Date.parse('2021-01-03'), transport: 'airplane' },
    { city: city('A2', 40), date: '2021-01-07', time: Date.parse('2021-01-07'), transport: 'airplane' },
  ],
};

const tripB: TResolvedTrip = {
  id: 'b',
  title: 'B',
  waypoints: [
    { city: city('B0', 0), date: '2022-06-01', time: Date.parse('2022-06-01'), transport: 'airplane' },
    { city: city('B1', 20), date: '2022-06-11', time: Date.parse('2022-06-11'), transport: 'airplane' },
  ],
};

describe('buildTimeline', () => {
  it('computes cumulative fractions proportional to great-circle distance', () => {
    const model = buildTimeline([tripA]);
    expect(model.fractions[0][0]).toBe(0);
    expect(model.fractions[0][1]).toBeCloseTo(0.25, 4);
    expect(model.fractions[0][2]).toBe(1);
  });

  it('splits evenly when all points coincide', () => {
    const flat: TResolvedTrip = {
      id: 'f',
      title: 'F',
      waypoints: [
        { city: city('F0', 5), date: '2020-01-01', time: 0, transport: 'airplane' },
        { city: city('F1', 5), date: '2020-01-01', time: 0, transport: 'airplane' },
        { city: city('F2', 5), date: '2020-01-01', time: 0, transport: 'airplane' },
      ],
    };
    const model = buildTimeline([flat]);
    expect(model.fractions[0]).toEqual([0, 0.5, 1]);
  });
});

describe('sampleTimeline', () => {
  const model = buildTimeline([tripA, tripB]);

  it('returns null for an empty timeline', () => {
    expect(sampleTimeline(buildTimeline([]), 0.5)).toBeNull();
  });

  it('places t=0 at the very start of the first trip', () => {
    const sample = sampleTimeline(model, 0);
    expect(sample).toMatchObject({ tripIndex: 0, segmentIndex: 0, segmentProgress: 0 });
    expect(sample?.currentTime).toBe(tripA.waypoints[0].time);
  });

  it('gives each trip an equal slot regardless of distance', () => {
    const sample = sampleTimeline(model, 0.5);
    expect(sample?.tripIndex).toBe(1);
    expect(sample?.segmentIndex).toBe(0);
    expect(sample?.segmentProgress).toBeCloseTo(0, 6);
  });

  it('interpolates the date inside a segment', () => {
    const sample = sampleTimeline(model, 0.75);
    const mid = (tripB.waypoints[0].time + tripB.waypoints[1].time) / 2;
    expect(sample?.tripIndex).toBe(1);
    expect(sample?.currentTime).toBeCloseTo(mid, -3);
  });

  it('selects the segment by distance inside a multi-leg trip', () => {
    const first = sampleTimeline(model, 0.1);
    expect(first?.tripIndex).toBe(0);
    expect(first?.segmentIndex).toBe(0);
    expect(first?.segmentProgress).toBeCloseTo(0.8, 4);
    const second = sampleTimeline(model, 0.4);
    expect(second?.tripIndex).toBe(0);
    expect(second?.segmentIndex).toBe(1);
    expect(second?.segmentProgress).toBeCloseTo((0.8 - 0.25) / 0.75, 4);
  });

  it('clamps t outside [0, 1] to the ends', () => {
    expect(sampleTimeline(model, -1)?.tripIndex).toBe(0);
    const end = sampleTimeline(model, 2);
    expect(end?.tripIndex).toBe(1);
    expect(end?.segmentProgress).toBeCloseTo(1, 6);
  });
});
