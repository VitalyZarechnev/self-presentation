'use client';

import { useLocalized, useLocalizedTitle } from '@application/locale/LocaleProvider';

import SiteHeader from '@features/site-header/SiteHeader';
import Works from '@features/works/Works';

import ActionButton from '@ui/atoms/action-button/ActionButton';
import Content from '@ui/atoms/typography/Content';
import Heading from '@ui/atoms/typography/Heading';
import ArrowBackIcon from '@ui/icons/arrow-back.svg';

import classes from './WorksView.module.scss';

const TITLES = { ru: 'Живые демо — Виталий Заречнев', en: 'Live demos — Vitaly Zarechnev' };

const MESSAGES = {
  ru: { back: 'На главную', title: 'Живые демо', sub: 'Работают прямо в браузере: их можно покрутить и понажать.' },
  en: { back: 'Back to home', title: 'Live demos', sub: 'They run right in the browser: spin them, click around.' },
} as const;

export default function WorksView() {
  const t = useLocalized(MESSAGES);
  useLocalizedTitle(TITLES);

  return (
    <main className={classes.works_view}>
      <SiteHeader />

      <div id='content' className={classes.works_view__content}>
        <ActionButton href='/#works' variant='secondary' className={classes.works_view__back}>
          <ArrowBackIcon className={classes.works_view__back_icon} aria-hidden />
          {t.back}
        </ActionButton>

        <header className={classes.works_view__head}>
          <Heading variant='h1'>{t.title}</Heading>
          <Content as='p' className={classes.works_view__sub}>
            {t.sub}
          </Content>
        </header>

        <Works />
      </div>
    </main>
  );
}
