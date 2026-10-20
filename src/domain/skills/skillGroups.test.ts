import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { skillGroups } from './skillGroups';

const ROOT = process.cwd();
const read = (file: string): string => readFileSync(join(ROOT, file), 'utf8');

// Skills this site itself is built with, and where the repo proves it.
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
  const items = skillGroups.flatMap((group) => group.items);

  test.each(PROVEN_HERE)('%s is listed and used in this repository', (skill, file, evidence) => {
    expect(items).toContain(skill);
    expect(read(file)).toContain(evidence);
  });

  test('the current stack leads its group, legacy tools close it', () => {
    const tooling = skillGroups.find((group) => group.id === 'tooling')?.items ?? [];
    expect(tooling.indexOf('Vitest')).toBeLessThan(tooling.indexOf('Jest'));
    expect(tooling.at(-1)).toBe('Enzyme');
  });

  test('no skill is listed twice', () => {
    expect(new Set(items).size).toBe(items.length);
  });
});
