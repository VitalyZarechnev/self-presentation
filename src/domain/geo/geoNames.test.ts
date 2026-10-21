import { cityName, countryName, tripTitle } from './geoNames';
import { tripCities } from './tripCities';
import { trips } from './trips';

const CYRILLIC = /[а-яё]/i;

describe('geoNames', () => {
  test('every city and country has an English name', () => {
    tripCities.forEach((city) => {
      expect(cityName(city.name, 'en')).not.toMatch(CYRILLIC);
      expect(countryName(city, 'en')).not.toMatch(CYRILLIC);
    });
  });

  test('every trip title has an English name', () => {
    trips.forEach((trip) => expect(tripTitle(trip.title, 'en')).not.toMatch(CYRILLIC));
  });

  test('Russian stays as written', () => {
    expect(cityName('Томск', 'ru')).toBe('Томск');
    expect(tripTitle('Кавказ', 'ru')).toBe('Кавказ');
  });
});
