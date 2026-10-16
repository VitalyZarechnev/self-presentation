import SiteHeader from '@features/site-header/SiteHeader';
import Works from '@features/works/Works';

import ActionButton from '@ui/atoms/action-button/ActionButton';
import Content from '@ui/atoms/typography/Content';
import Heading from '@ui/atoms/typography/Heading';
import ArrowBackIcon from '@ui/icons/arrow-back.svg';

import classes from './WorksView.module.scss';

export default function WorksView() {
  return (
    <main className={classes.works_view}>
      <SiteHeader />

      <div id='content' className={classes.works_view__content}>
        <ActionButton href='/#works' variant='secondary' className={classes.works_view__back}>
          <ArrowBackIcon className={classes.works_view__back_icon} aria-hidden />
          На главную
        </ActionButton>

        <header className={classes.works_view__head}>
          <Heading variant='h1'>Живые демо</Heading>
          <Content as='p' className={classes.works_view__sub}>
            Работают прямо в браузере: их можно покрутить и понажать.
          </Content>
        </header>

        <Works />
      </div>
    </main>
  );
}
