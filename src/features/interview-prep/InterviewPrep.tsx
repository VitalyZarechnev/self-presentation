'use client';

import { useLocalized } from '@application/locale/LocaleProvider';

import { INTERVIEW_PREP_URL } from '@domain/works/worksList';

import EmbedFrame from '@ui/molecules/embed-frame/EmbedFrame';

const TITLE = { ru: 'Подготовка к собеседованию Frontend', en: 'Frontend interview prep' } as const;

export default function InterviewPrep() {
  return <EmbedFrame src={INTERVIEW_PREP_URL} title={useLocalized(TITLE)} />;
}
