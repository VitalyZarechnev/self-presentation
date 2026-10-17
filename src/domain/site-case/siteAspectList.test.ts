import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { SITE_SOURCE_URL, siteAspectList } from './siteAspectList';

const ROOT = process.cwd();
const ELLIPSIS = '…';

describe('siteAspectList', () => {
  test('covers architecture, themes and quality in that order', () => {
    expect(siteAspectList.map((aspect) => aspect.id)).toEqual(['architecture', 'themes', 'quality']);
  });

  test('every quoted line exists verbatim in the referenced source file', () => {
    siteAspectList.forEach(({ code }) => {
      const source = readFileSync(join(ROOT, code.file), 'utf8');
      code.source
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0 && line !== ELLIPSIS)
        .forEach((line) => expect(source).toContain(line));
    });
  });

  test('points to the public repository', () => {
    expect(SITE_SOURCE_URL).toBe('https://github.com/VitalyZarechnev/self-presentation');
  });
});
