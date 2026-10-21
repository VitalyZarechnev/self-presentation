import { TLocalized } from '@domain/locale/locale';

import { TEducation } from './models/Education';

const educationRu: readonly TEducation[] = [
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

const educationEn: readonly TEducation[] = [
  {
    id: 'master',
    kind: 'degree',
    year: 2019,
    qualification: 'Master’s degree',
    institution: 'TUSUR',
    field: 'Informatics and Computer Engineering',
  },
  {
    id: 'bachelor',
    kind: 'degree',
    year: 2017,
    qualification: 'Bachelor’s degree',
    institution: 'TUSUR',
    field: 'Applied Informatics in Economics',
  },
  {
    id: 'luxoft-angular',
    kind: 'course',
    year: 2020,
    qualification: 'Course “Angular Development”',
    institution: 'Luxoft Training Center',
  },
];

export const educationList: TLocalized<readonly TEducation[]> = { ru: educationRu, en: educationEn };
