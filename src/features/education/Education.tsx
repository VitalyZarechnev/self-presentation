'use client';

import { useLocale } from '@application/locale/LocaleProvider';

import { educationList } from '@domain/education/educationList';

import Timeline from '@ui/molecules/timeline/Timeline';

import { buildEducationTimeline } from './educationView';

const PROJECTS_LABEL = { ru: 'Проекты', en: 'Projects' } as const;

export default function Education() {
  const { locale } = useLocale();

  return <Timeline items={buildEducationTimeline(educationList[locale])} gutter={64} projectsLabel={PROJECTS_LABEL[locale]} />;
}
