'use client';

import { useLocalized } from '@application/locale/LocaleProvider';

import SiteHeader from '@features/site-header/SiteHeader';

import ActionButton from '@ui/atoms/action-button/ActionButton';
import Content from '@ui/atoms/typography/Content';
import Heading from '@ui/atoms/typography/Heading';
import Label from '@ui/atoms/typography/Label';

import classes from './NotFoundView.module.scss';

const MESSAGES = {
  ru: {
    eyebrow: 'Ошибка · 404',
    title: 'Страница не найдена',
    sub: 'Кажется, такой страницы нет — она переехала или никогда не существовала. Вернёмся на главную?',
    home: '← На главную',
  },
  en: {
    eyebrow: 'Error · 404',
    title: 'Page not found',
    sub: 'This page doesn’t seem to exist — it moved, or never was. Back to the home page?',
    home: '← Back to home',
  },
} as const;

export default function NotFoundView() {
  const t = useLocalized(MESSAGES);

  return (
    <main className={classes.not_found}>
      <SiteHeader />

      <section id='content' className={classes.not_found__hero}>
        <Label as='p' variant='eyebrow' className={classes.not_found__eyebrow}>
          {t.eyebrow}
        </Label>

        <p className={classes.not_found__code} aria-hidden>
          4<span className={classes.not_found__code_accent}>0</span>4
        </p>

        <Heading variant='h2' className={classes.not_found__title}>
          {t.title}
        </Heading>

        <Content as='p' className={classes.not_found__sub}>
          {t.sub}
        </Content>

        <ActionButton href='/' variant='primary' className={classes.not_found__cta}>
          {t.home}
        </ActionButton>
      </section>
    </main>
  );
}
