import { describe, expect, it } from 'vitest';

import { resolveTrips, TTrip } from './trips';

const source: readonly TTrip[] = [
  {
    id: 't',
    title: 'T',
    waypoints: [
      { cityName: 'Томск', date: '2021-05-02' },
      { cityName: 'Сочи', date: '2021-05-05', transport: 'car' },
      { cityName: 'Сочи', date: '2021-05-09', transport: 'airplane' },
    ],
  },
];

describe('resolveTrips', () => {
  it('defaults transport to airplane when omitted', () => {
    const [trip] = resolveTrips(source);
    expect(trip.waypoints[0].transport).toBe('airplane');
  });

  it('preserves an explicit transport', () => {
    const [trip] = resolveTrips(source);
    expect(trip.waypoints[1].transport).toBe('car');
    expect(trip.waypoints[2].transport).toBe('airplane');
  });

  it('drops waypoints with an unknown city', () => {
    const resolved = resolveTrips([
      {
        id: 'u',
        title: 'U',
        waypoints: [
          { cityName: 'Томск', date: '2021-05-02' },
          { cityName: 'Несуществоград', date: '2021-05-05' },
          { cityName: 'Сочи', date: '2021-05-09' },
        ],
      },
    ]);
    expect(resolved[0].waypoints.map((w) => w.city.name)).toEqual(['Томск', 'Сочи']);
  });

  it('excludes trips with fewer than two valid points', () => {
    const resolved = resolveTrips([
      {
        id: 'short',
        title: 'S',
        waypoints: [
          { cityName: 'Томск', date: '2021-05-02' },
          { cityName: 'Несуществоград', date: 'bad-date' },
        ],
      },
    ]);
    expect(resolved).toHaveLength(0);
  });
});
