import { TExperience } from '@domain/experience/models/Experience';

import { buildGantt } from './experienceView';

const NOW = { year: 2026, month: 10 };

const items = [
  {
    id: 'early',
    company: 'Early Co',
    role: 'Frontend Developer',
    start: { year: 2017, month: 9 },
    end: { year: 2019, month: 10 },
    officialFrom: { year: 2018, month: 4, day: 10 },
    stack: [],
    achievements: [],
  },
  {
    id: 'later',
    company: 'Later Co',
    role: 'Head of Frontend',
    start: { year: 2021, month: 12 },
    end: null,
    stack: [],
    keyResults: ['Результат с цифрой'],
    achievements: [],
  },
] as unknown as readonly TExperience[];

describe('buildGantt pre-hire period', () => {
  test('labels the pre-hire stretch on its own row', () => {
    const { rows } = buildGantt(items, NOW, 'ru');
    const early = rows.find((row) => row.id === 'early');

    expect(early?.note).toEqual({ tone: 'muted', label: 'до оформления: сен’17 — апр’18' });
    expect(buildGantt(items, NOW, 'en').rows.find((row) => row.id === early?.id)?.note?.label).toBe('before the contract: Sep’17 — Apr’18');
    expect(early?.segments?.[0].tone).toBe('muted');
  });

  test('rows without a pre-hire stretch carry no note', () => {
    const { rows } = buildGantt(items, NOW, 'ru');
    expect(rows.find((row) => row.id === 'later')?.note).toBeUndefined();
  });

  test('no global legend that would imply other rows share the pattern', () => {
    expect(buildGantt(items, NOW, 'ru')).not.toHaveProperty('legend');
  });

  test('passes key results through as the row summary', () => {
    const { rows } = buildGantt(items, NOW, 'ru');
    expect(rows.find((row) => row.id === 'later')?.summary).toEqual(['Результат с цифрой']);
    expect(rows.find((row) => row.id === 'early')?.summary).toBeUndefined();
  });
});
