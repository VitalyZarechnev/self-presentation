'use client';

import { INTERVIEW_PREP_URL } from '@domain/works/worksList';

import EmbedFrame from '@ui/molecules/embed-frame/EmbedFrame';

export default function InterviewPrep() {
  return <EmbedFrame src={INTERVIEW_PREP_URL} title='Подготовка к собеседованию Frontend' />;
}
