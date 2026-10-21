import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { SITE_SOURCE_URL, siteAspectList } from './siteAspectList';

const ROOT = process.cwd();
const ELLIPSIS = '…';

describe('siteAspectList', () => {
  test('covers architecture, themes and quality in that order', () => {
    expect(siteAspectList.ru.map((aspect) => aspect.id)).toEqual(['architecture', 'themes', 'quality']);
  });

  test('every quoted line exists verbatim in the referenced source file', () => {
    siteAspectList.ru.forEach(({ code }) => {
      const source = readFileSync(join(ROOT, code.file), 'utf8');
      code.source
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0 && line !== ELLIPSIS)
        .forEach((line) => expect(source).toContain(line));
    });
  });

  test('the English version translates every aspect and keeps the same code', () => {
    expect(siteAspectList.en.map(({ id, code }) => ({ id, code }))).toEqual(siteAspectList.ru.map(({ id, code }) => ({ id, code })));
    siteAspectList.en.forEach((aspect, index) => {
      expect(aspect.summary).not.toBe(siteAspectList.ru[index].summary);
      expect(aspect.points).toHaveLength(siteAspectList.ru[index].points.length);
    });
  });

  test('points to the public repository', () => {
    expect(SITE_SOURCE_URL).toBe('https://github.com/VitalyZarechnev/self-presentation');
  });
});
