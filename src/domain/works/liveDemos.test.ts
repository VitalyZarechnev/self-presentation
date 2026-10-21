import { LOCALES } from '@domain/locale/locale';

import { liveDemoExtras, liveDemos } from './liveDemos';
import { worksList } from './worksList';

describe('liveDemos', () => {
  test.each(LOCALES)('%s: lists the four showcase demos in reading order', (locale) => {
    expect(liveDemos[locale].map((demo) => demo.id)).toEqual(['geo-trips', 'market', 'bank', 'tic-tac-toe']);
  });

  test.each(LOCALES)('%s: reuses names and tech of the widgets published on /works', (locale) => {
    const published = liveDemos[locale].filter((demo) => demo.id !== 'tic-tac-toe');

    published.forEach((demo) => {
      const work = worksList[locale].find((item) => item.id === demo.id);
      expect(work).toBeDefined();
      expect(demo.name).toBe(work?.name);
      expect(demo.tech).toEqual(work?.tech);
    });
  });

  test.each(LOCALES)('%s: every demo explains what it proves', (locale) => {
    liveDemos[locale].forEach((demo) => {
      expect(demo.proves.length).toBeGreaterThan(20);
    });
  });

  test('anchors published demos to their /works section and keeps the game inline', () => {
    expect(liveDemos.ru.find((demo) => demo.id === 'market')?.href).toBe('/works#market');
    expect(liveDemos.en.find((demo) => demo.id === 'tic-tac-toe')?.href).toBeNull();
  });

  test.each(LOCALES)('%s: extras are the external works with their own links', (locale) => {
    expect(liveDemoExtras[locale].map((work) => work.id)).toEqual(['interview', 'marshmallow']);
    liveDemoExtras[locale].forEach((work) => expect(work.link).toMatch(/^https:\/\//));
  });

  test('both languages list the same works with the same tech and links', () => {
    const shape = (locale: 'ru' | 'en') => worksList[locale].map(({ id, tech, link }) => ({ id, tech, link }));
    expect(shape('en')).toEqual(shape('ru'));
  });
});
