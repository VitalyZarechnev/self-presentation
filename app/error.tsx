'use client';

import { useEffect } from 'react';

import { useLocalized } from '@application/locale/LocaleProvider';

import Button from '@ui/atoms/button/Button';
import Flex from '@ui/atoms/flex/Flex';
import Heading from '@ui/atoms/typography/Heading';

const MESSAGES = {
  ru: { title: 'Упс... что-то пошло не так.', retry: 'Обновить' },
  en: { title: 'Oops… something went wrong.', retry: 'Reload' },
} as const;

interface IProps {
  error: Error;
  reset: () => void;
}

export default function Error(props: IProps) {
  const { error, reset } = props;
  const t = useLocalized(MESSAGES);

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <Flex vertical justify='center' align='flex-start' gap={16}>
        <Heading variant='h2'>{t.title}</Heading>
        <Button variant='main' onClick={reset}>
          {t.retry}
        </Button>
      </Flex>
    </div>
  );
}
