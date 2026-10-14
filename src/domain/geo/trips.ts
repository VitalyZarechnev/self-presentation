import { TCity, tripCities } from './tripCities';

export type TTransport = 'airplane' | 'car';

export const DEFAULT_TRANSPORT: TTransport = 'airplane';

export type TTripWaypoint = {
  cityName: string;
  date: string;
  transport?: TTransport;
};

export type TTrip = {
  id: string;
  title: string;
  waypoints: readonly TTripWaypoint[];
};

export type TResolvedWaypoint = {
  city: TCity;
  date: string;
  time: number;
  transport: TTransport;
};

export type TResolvedTrip = {
  id: string;
  title: string;
  waypoints: readonly TResolvedWaypoint[];
};

export const trips: readonly TTrip[] = [
  {
    id: 'central-asia-2021',
    title: 'Средняя Азия',
    waypoints: [
      { cityName: 'Томск', date: '2021-05-02' },
      { cityName: 'Алмата', date: '2021-05-05', transport: 'airplane' },
      { cityName: 'Ташкент', date: '2021-05-11', transport: 'airplane' },
      { cityName: 'Самарканд', date: '2021-05-16', transport: 'car' },
    ],
  },
  {
    id: 'caucasus-2022',
    title: 'Кавказ',
    waypoints: [
      { cityName: 'Томск', date: '2022-08-01' },
      { cityName: 'Сочи', date: '2022-08-03', transport: 'airplane' },
      { cityName: 'Гагра', date: '2022-08-07', transport: 'car' },
      { cityName: 'Сухум', date: '2022-08-10', transport: 'car' },
      { cityName: 'Тбилиси', date: '2022-08-15', transport: 'car' },
      { cityName: 'Боржоми', date: '2022-08-20', transport: 'car' },
    ],
  },
  {
    id: 'south-east-asia-2023',
    title: 'Юго-Восточная Азия',
    waypoints: [
      { cityName: 'Томск', date: '2023-11-04' },
      { cityName: 'Бангкок', date: '2023-11-06' },
      { cityName: 'Пхукет', date: '2023-11-12' },
      { cityName: 'Нячанг', date: '2023-11-20' },
      { cityName: 'Гонконг', date: '2023-11-27' },
    ],
  },
];

function cityByName(name: string): TCity | undefined {
  return tripCities.find((city) => city.name === name);
}

export function resolveTrips(source: readonly TTrip[] = trips): readonly TResolvedTrip[] {
  return source
    .map((trip) => ({
      id: trip.id,
      title: trip.title,
      waypoints: trip.waypoints
        .map((waypoint) => {
          const city = cityByName(waypoint.cityName);
          const time = Date.parse(waypoint.date);
          if (!city || Number.isNaN(time)) return null;
          return { city, date: waypoint.date, time, transport: waypoint.transport ?? DEFAULT_TRANSPORT };
        })
        .filter((waypoint): waypoint is TResolvedWaypoint => waypoint !== null),
    }))
    .filter((trip) => trip.waypoints.length >= 2);
}
