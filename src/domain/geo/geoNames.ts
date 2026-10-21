import { TLocale } from '@domain/locale/locale';

import { TCity } from './tripCities';
import { trips } from './trips';

const CITY_EN: Record<string, string> = {
  Томск: 'Tomsk',
  Новосибирск: 'Novosibirsk',
  Москва: 'Moscow',
  'Санкт-Петербург': 'Saint Petersburg',
  Екатеринбург: 'Yekaterinburg',
  Сочи: 'Sochi',
  Выборг: 'Vyborg',
  Мыски: 'Myski',
  Новокузнецк: 'Novokuznetsk',
  Междуреченск: 'Mezhdurechensk',
  'Анжеро-Судженск': 'Anzhero-Sudzhensk',
  Иркутск: 'Irkutsk',
  Манжерок: 'Manzherok',
  Павлодар: 'Pavlodar',
  Алмата: 'Almaty',
  Гагра: 'Gagra',
  Сухум: 'Sukhum',
  Ташкент: 'Tashkent',
  Самарканд: 'Samarkand',
  Тбилиси: 'Tbilisi',
  Боржоми: 'Borjomi',
  Цнори: 'Tsnori',
  Манавгат: 'Manavgat',
  Стамбул: 'Istanbul',
  Занзибар: 'Zanzibar',
  Мале: 'Malé',
  Пхукет: 'Phuket',
  Бангкок: 'Bangkok',
  Нячанг: 'Nha Trang',
  Пекин: 'Beijing',
  Гонконг: 'Hong Kong',
  Манила: 'Manila',
  Боракай: 'Boracay',
  Себу: 'Cebu',
  'Пуэрто-Принсеса': 'Puerto Princesa',
};

const COUNTRY_EN: Record<string, string> = {
  Россия: 'Russia',
  Казахстан: 'Kazakhstan',
  Абхазия: 'Abkhazia',
  Узбекистан: 'Uzbekistan',
  Грузия: 'Georgia',
  Турция: 'Turkey',
  Танзания: 'Tanzania',
  Мальдивы: 'Maldives',
  Таиланд: 'Thailand',
  Вьетнам: 'Vietnam',
  Китай: 'China',
  Гонконг: 'Hong Kong',
  Филиппины: 'Philippines',
};

const TRIP_TITLE_EN: Record<string, string> = {
  'central-asia-2021': 'Central Asia',
  'caucasus-2022': 'Caucasus',
  'south-east-asia-2023': 'Southeast Asia',
};

export function cityName(name: string, locale: TLocale): string {
  return locale === 'en' ? (CITY_EN[name] ?? name) : name;
}

export function countryName(city: Pick<TCity, 'country'>, locale: TLocale): string {
  return locale === 'en' ? (COUNTRY_EN[city.country] ?? city.country) : city.country;
}

export function tripTitle(title: string, locale: TLocale): string {
  if (locale !== 'en') return title;
  const trip = trips.find((item) => item.title === title);
  return (trip && TRIP_TITLE_EN[trip.id]) ?? title;
}
