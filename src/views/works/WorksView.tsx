import SiteHeader from '@features/site-header/SiteHeader';
import Works from '@features/works/Works';

import ActionButton from '@ui/atoms/action-button/ActionButton';
import Content from '@ui/atoms/typography/Content';
import Heading from '@ui/atoms/typography/Heading';

import classes from './WorksView.module.scss';

export default function WorksView() {
  return (
    <main className={classes.works_view}>
      <SiteHeader />

      <div className={classes.works_view__content}>
        <ActionButton href='/#works' variant='secondary' className={classes.works_view__back}>
          ← На главную
        </ActionButton>

        <header className={classes.works_view__head}>
          <Heading variant='h1'>Примеры работ</Heading>
          <Content as='p' className={classes.works_view__sub}>
            Живые виджеты на разных стеках — можно потрогать прямо здесь.
          </Content>
        </header>

        <Works />
      </div>
    </main>
  );
}
