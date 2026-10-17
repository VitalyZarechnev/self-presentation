import { TEducation } from '@domain/education/models/Education';

import { buildEducationTimeline } from './educationView';

const entries: readonly TEducation[] = [
  { id: 'course', kind: 'course', year: 2020, qualification: 'Курс', institution: 'Центр' },
  { id: 'bachelor', kind: 'degree', year: 2017, qualification: 'Бакалавр', institution: 'ВУЗ', field: 'Информатика' },
  { id: 'master', kind: 'degree', year: 2019, qualification: 'Магистр', institution: 'ВУЗ', field: 'ИВТ' },
];

describe('buildEducationTimeline', () => {
  test('lists degrees first, newest first, then courses', () => {
    expect(buildEducationTimeline(entries).map((item) => item.id)).toEqual(['master', 'bachelor', 'course']);
  });

  test('joins institution and field into the subtitle', () => {
    const [master, , course] = buildEducationTimeline(entries);
    expect(master.subtitle).toBe('ВУЗ · ИВТ');
    expect(course.subtitle).toBe('Центр');
  });
});
