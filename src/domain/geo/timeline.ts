import { distanceKm } from './cityStats';
import { resolveTrips, TResolvedTrip } from './trips';

export type TTimelineModel = {
  trips: readonly TResolvedTrip[];
  fractions: readonly (readonly number[])[];
};

export type TTimelineSample = {
  tripIndex: number;
  segmentIndex: number;
  segmentProgress: number;
  currentTime: number;
};

function tripFractions(trip: TResolvedTrip): readonly number[] {
  const points = trip.waypoints;
  const count = points.length;

  const cumulative: number[] = [0];
  let total = 0;
  for (let i = 1; i < count; i += 1) {
    total += distanceKm(points[i - 1].city, points[i].city);
    cumulative.push(total);
  }

  if (total <= 0) {
    return points.map((_, index) => index / (count - 1));
  }

  return cumulative.map((value) => value / total);
}

export function buildTimeline(trips: readonly TResolvedTrip[] = resolveTrips()): TTimelineModel {
  return {
    trips,
    fractions: trips.map(tripFractions),
  };
}

function clamp01(value: number): number {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

function findSegment(fractions: readonly number[], local: number): number {
  for (let s = fractions.length - 2; s >= 0; s -= 1) {
    if (local >= fractions[s]) return s;
  }
  return 0;
}

export function sampleTimeline(model: TTimelineModel, t: number): TTimelineSample | null {
  const count = model.trips.length;
  if (count === 0) return null;

  const clamped = clamp01(t);
  const scaled = clamped * count;
  const tripIndex = Math.min(count - 1, Math.floor(scaled));
  const local = clamp01(scaled - tripIndex);

  const trip = model.trips[tripIndex];
  const fractions = model.fractions[tripIndex];
  const segmentIndex = findSegment(fractions, local);

  const spanStart = fractions[segmentIndex];
  const spanEnd = fractions[segmentIndex + 1];
  const span = spanEnd - spanStart;
  const segmentProgress = span <= 0 ? 0 : clamp01((local - spanStart) / span);

  const from = trip.waypoints[segmentIndex];
  const to = trip.waypoints[segmentIndex + 1];
  const currentTime = from.time + (to.time - from.time) * segmentProgress;

  return { tripIndex, segmentIndex, segmentProgress, currentTime };
}
