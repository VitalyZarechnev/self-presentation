'use client';

import { useLocalized } from '@application/locale/LocaleProvider';

import Label from '@ui/atoms/typography/Label';

const LOADING = { ru: 'Загрузка…', en: 'Loading…' } as const;

export default function LoadingLabel({ className }: { className?: string }) {
  return (
    <Label as='div' className={className}>
      {useLocalized(LOADING)}
    </Label>
  );
}
