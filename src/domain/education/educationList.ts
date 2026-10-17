import { TEducation } from './models/Education';

export const educationList: readonly TEducation[] = [
  {
    id: 'master',
    kind: 'degree',
    year: 2019,
    qualification: 'Магистр',
    institution: 'ТУСУР',
    field: 'Информатика и вычислительная техника',
  },
  {
    id: 'bachelor',
    kind: 'degree',
    year: 2017,
    qualification: 'Бакалавр',
    institution: 'ТУСУР',
    field: 'Прикладная информатика в экономике',
  },
  {
    id: 'luxoft-angular',
    kind: 'course',
    year: 2020,
    qualification: 'Курс «Разработка на Angular»',
    institution: 'Учебный центр Luxoft',
  },
];
