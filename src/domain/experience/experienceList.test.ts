import { experienceList } from './experienceList';

const CYRILLIC = /[а-яё]/i;

describe('experienceList', () => {
  test('both languages share ids, dates, roles and stacks', () => {
    const shape = (items: typeof experienceList.ru) =>
      items.map(({ id, role, start, end, officialFrom, stack, projects }) => ({
        id,
        role,
        start,
        end,
        officialFrom,
        stack,
        projects: projects?.map(({ stack: projectStack, role: projectRole }) => ({ projectStack, projectRole })),
      }));
    expect(shape(experienceList.en)).toEqual(shape(experienceList.ru));
  });

  test('the English version has no untranslated Russian prose', () => {
    experienceList.en.forEach((item) => {
      const prose = [
        item.company,
        item.location,
        ...(item.achievements ?? []),
        ...(item.keyResults ?? []),
        ...(item.projects ?? []).flatMap((project) => [project.name, project.description, project.period]),
      ];
      prose.filter(Boolean).forEach((text) => expect(text).not.toMatch(CYRILLIC));
    });
  });

  test('every Russian list item has an English counterpart', () => {
    experienceList.ru.forEach((item, index) => {
      const en = experienceList.en[index];
      expect(en.achievements?.length).toBe(item.achievements?.length);
      expect(en.keyResults?.length).toBe(item.keyResults?.length);
      expect(en.projects?.length).toBe(item.projects?.length);
    });
  });
});
