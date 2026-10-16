import { liveDemoExtras, liveDemos } from './liveDemos';
import { worksList } from './worksList';

describe('liveDemos', () => {
  test('lists the four showcase demos in reading order', () => {
    expect(liveDemos.map((demo) => demo.id)).toEqual(['geo-trips', 'market', 'bank', 'tic-tac-toe']);
  });

  test('reuses names and tech of the widgets published on /works', () => {
    const published = liveDemos.filter((demo) => demo.id !== 'tic-tac-toe');

    published.forEach((demo) => {
      const work = worksList.find((item) => item.id === demo.id);
      expect(work).toBeDefined();
      expect(demo.name).toBe(work?.name);
      expect(demo.tech).toEqual(work?.tech);
    });
  });

  test('every demo explains what it proves', () => {
    liveDemos.forEach((demo) => {
      expect(demo.proves.length).toBeGreaterThan(20);
    });
  });

  test('anchors published demos to their /works section and keeps the game inline', () => {
    expect(liveDemos.find((demo) => demo.id === 'market')?.href).toBe('/works#market');
    expect(liveDemos.find((demo) => demo.id === 'tic-tac-toe')?.href).toBeNull();
  });

  test('extras are the external works with their own links', () => {
    expect(liveDemoExtras.map((work) => work.id)).toEqual(['interview', 'marshmallow']);
    liveDemoExtras.forEach((work) => expect(work.link).toMatch(/^https:\/\//));
  });
});
