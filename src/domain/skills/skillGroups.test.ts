import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { skillGroups } from './skillGroups';

const ROOT = process.cwd();
const read = (file: string): string => readFileSync(join(ROOT, file), 'utf8');

const PROVEN_HERE: ReadonlyArray<readonly [string, string, string]> = [
  ['TanStack Query', 'package.json', '"@tanstack/react-query"'],
  ['Zod', 'package.json', '"zod"'],
  ['Vitest', 'package.json', '"vitest"'],
  ['Testing Library', 'package.json', '"@testing-library/react"'],
  ['React Compiler', 'package.json', '"eslint-plugin-react-compiler"'],
  ['ESLint', 'package.json', '"eslint"'],
  ['GitHub Actions', '.github/workflows/deploy.yml', 'runs-on:'],
  ['Next.js', 'package.json', '"next"'],
  ['SCSS Modules', 'package.json', '"sass"'],
];

describe('skillGroups', () => {
  const items = skillGroups.ru.flatMap((group) => group.items);

  test.each(PROVEN_HERE)('%s is listed and used in this repository', (skill, file, evidence) => {
    expect(items).toContain(skill);
    expect(read(file)).toContain(evidence);
  });

  test('the current stack leads its group, legacy tools close it', () => {
    const tooling = skillGroups.ru.find((group) => group.id === 'tooling')?.items ?? [];
    expect(tooling.indexOf('Vitest')).toBeLessThan(tooling.indexOf('Jest'));
    expect(tooling.at(-1)).toBe('Enzyme');
  });

  test('the English list keeps the same tools and has no Russian left', () => {
    expect(skillGroups.en.map((group) => group.items.length)).toEqual(skillGroups.ru.map((group) => group.items.length));
    skillGroups.en.forEach((group) => {
      expect(group.title).not.toMatch(/[а-яё]/i);
      group.items.forEach((item) => expect(item).not.toMatch(/[а-яё]/i));
    });
  });

  test('no skill is listed twice', () => {
    expect(new Set(items).size).toBe(items.length);
  });
});
