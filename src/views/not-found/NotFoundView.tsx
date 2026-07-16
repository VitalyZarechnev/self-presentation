import SiteHeader from '@features/site-header/SiteHeader';

import ActionButton from '@ui/atoms/action-button/ActionButton';
import Content from '@ui/atoms/typography/Content';
import Heading from '@ui/atoms/typography/Heading';
import Label from '@ui/atoms/typography/Label';

import classes from './NotFoundView.module.scss';

export default function NotFoundView() {
  return (
    <main className={classes.not_found}>
      <SiteHeader />

      <section className={classes.not_found__hero}>
        <Label as='p' variant='eyebrow' className={classes.not_found__eyebrow}>
          Ошибка · 404
        </Label>

        <p className={classes.not_found__code} aria-hidden>
          4<span className={classes.not_found__code_accent}>0</span>4
        </p>

        <Heading variant='h2' className={classes.not_found__title}>
          Страница не найдена
        </Heading>

        <Content as='p' className={classes.not_found__sub}>
          Кажется, такой страницы нет — она переехала или никогда не существовала. Вернёмся на главную?
        </Content>

        <ActionButton href='/' variant='primary' className={classes.not_found__cta}>
          ← На главную
        </ActionButton>
      </section>
    </main>
  );
}
