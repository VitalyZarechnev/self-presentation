export type TCity = {
  name: string;
  lat: number;
  lon: number;
  country: string;
  tz: number;
  important?: boolean;
  home?: boolean;
  year?: string;
  note?: string;
};

export const tripCities: readonly TCity[] = [
  { name: 'Томск', lat: 56.49, lon: 84.95, country: 'Россия', tz: 7, important: true, home: true },
  { name: 'Новосибирск', lat: 55.03, lon: 82.92, country: 'Россия', tz: 7 },
  { name: 'Москва', lat: 55.75, lon: 37.62, country: 'Россия', tz: 3, important: true },
  { name: 'Санкт-Петербург', lat: 59.94, lon: 30.31, country: 'Россия', tz: 3 },
  { name: 'Екатеринбург', lat: 56.84, lon: 60.6, country: 'Россия', tz: 5 },
  { name: 'Сочи', lat: 43.6, lon: 39.73, country: 'Россия', tz: 3 },
  { name: 'Выборг', lat: 60.71, lon: 28.75, country: 'Россия', tz: 3 },
  { name: 'Мыски', lat: 53.71, lon: 87.8, country: 'Россия', tz: 7 },
  { name: 'Новокузнецк', lat: 53.76, lon: 87.11, country: 'Россия', tz: 7 },
  { name: 'Междуреченск', lat: 53.69, lon: 88.07, country: 'Россия', tz: 7 },
  { name: 'Анжеро-Судженск', lat: 56.08, lon: 86.03, country: 'Россия', tz: 7 },
  { name: 'Иркутск', lat: 52.29, lon: 104.28, country: 'Россия', tz: 8 },
  { name: 'Манжерок', lat: 51.82, lon: 85.76, country: 'Россия', tz: 7 },
  { name: 'Павлодар', lat: 52.29, lon: 76.97, country: 'Казахстан', tz: 5 },
  { name: 'Алмата', lat: 43.24, lon: 76.89, country: 'Казахстан', tz: 5, important: true },
  { name: 'Гагра', lat: 43.28, lon: 40.27, country: 'Абхазия', tz: 3 },
  { name: 'Сухум', lat: 43.0, lon: 41.02, country: 'Абхазия', tz: 3 },
  { name: 'Ташкент', lat: 41.31, lon: 69.28, country: 'Узбекистан', tz: 5, important: true },
  { name: 'Самарканд', lat: 39.65, lon: 66.96, country: 'Узбекистан', tz: 5 },
  { name: 'Тбилиси', lat: 41.72, lon: 44.79, country: 'Грузия', tz: 4 },
  { name: 'Боржоми', lat: 41.84, lon: 43.39, country: 'Грузия', tz: 4 },
  { name: 'Цнори', lat: 41.62, lon: 45.92, country: 'Грузия', tz: 4 },
  { name: 'Манавгат', lat: 36.79, lon: 31.44, country: 'Турция', tz: 3 },
  { name: 'Стамбул', lat: 41.01, lon: 28.98, country: 'Турция', tz: 3, important: true },
  { name: 'Занзибар', lat: -6.16, lon: 39.19, country: 'Танзания', tz: 3 },
  { name: 'Мале', lat: 4.18, lon: 73.51, country: 'Мальдивы', tz: 5, important: true },
  { name: 'Пхукет', lat: 7.88, lon: 98.39, country: 'Таиланд', tz: 7 },
  { name: 'Бангкок', lat: 13.76, lon: 100.5, country: 'Таиланд', tz: 7, important: true },
  { name: 'Нячанг', lat: 12.24, lon: 109.19, country: 'Вьетнам', tz: 7 },
  { name: 'Пекин', lat: 39.9, lon: 116.41, country: 'Китай', tz: 8, important: true },
  { name: 'Гонконг', lat: 22.32, lon: 114.17, country: 'Гонконг', tz: 8 },
  { name: 'Манила', lat: 14.6, lon: 120.98, country: 'Филиппины', tz: 8, important: true },
  { name: 'Боракай', lat: 11.97, lon: 121.92, country: 'Филиппины', tz: 8 },
  { name: 'Себу', lat: 10.32, lon: 123.89, country: 'Филиппины', tz: 8 },
  { name: 'Пуэрто-Принсеса', lat: 9.74, lon: 118.74, country: 'Филиппины', tz: 8 },
];
