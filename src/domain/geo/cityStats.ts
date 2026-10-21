import { TCity } from './tripCities';

const EARTH_RADIUS_KM = 6371;
const DEG_TO_RAD = Math.PI / 180;

type TCoords = Pick<TCity, 'lat' | 'lon'>;

export function distanceKm(a: TCoords, b: TCoords): number {
  const dLat = (b.lat - a.lat) * DEG_TO_RAD;
  const dLon = (b.lon - a.lon) * DEG_TO_RAD;
  const lat1 = a.lat * DEG_TO_RAD;
  const lat2 = b.lat * DEG_TO_RAD;

  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

export type THemisphere = { north: boolean; east: boolean };

export function hemisphere(city: TCoords): THemisphere {
  return { north: city.lat >= 0, east: city.lon >= 0 };
}
