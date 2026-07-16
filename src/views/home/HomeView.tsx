import { ReactNode } from 'react';

import Contacts from '@features/contacts/Contacts';
import Education from '@features/education/Education';
import Experience from '@features/experience/Experience';
import Highlights from '@features/highlights/Highlights';
import { sectionsMeta } from '@features/site-header/sections';
import SiteHeader from '@features/site-header/SiteHeader';
import Skills from '@features/skills/Skills';
import TicTacToe from '@features/tic-tac-toe/TicTacToe';

import ActionButton from '@ui/atoms/action-button/ActionButton';
import Content from '@ui/atoms/typography/Content';
import Display from '@ui/atoms/typography/Display';
import Heading from '@ui/atoms/typography/Heading';
import Label from '@ui/atoms/typography/Label';

import classes from './HomeView.module.scss';

const SECTION_BODIES: Record<string, ReactNode> = {
  highlights: <Highlights />,
  experience: <Experience />,
  works: (
    <ActionButton href='/works' variant='primary'>
      Открыть примеры работ →
    </ActionButton>
  ),
  skills: <Skills />,
  education: <Education />,
  contacts: <Contacts />,
};

export default function HomeView() {
  return (
    <main className={classes.home_view}>
      <SiteHeader />

      <section className={classes.home_view__hero}>
        <Label as='p' variant='eyebrow' className={classes.home_view__eyebrow}>
          Виталий Заречнев · Frontend Lead
        </Label>
        <Heading variant='h1' className={classes.home_view__title}>
          Веду фронтенд — от архитектуры до продакшна
        </Heading>
        <Display className={classes.home_view__lead}>И команду, которая это делает</Display>
        <Label as='p' variant='domains' className={classes.home_view__domains}>
          финтех · блокчейн · IoT · бортовые системы · AI-интерфейсы
        </Label>
        <ActionButton className={classes.home_view__cta} href='#highlights' variant='secondary'>
          Опыт в цифрах ↓
        </ActionButton>

        <div className={classes.home_view__game}>
          <TicTacToe />
        </div>
      </section>

      <div className={classes.home_view__content}>
        {sectionsMeta.map((section) => (
          <section key={section.id} id={section.id} className={classes.home_view__section}>
            <div className={classes.home_view__section_head}>
              <Label variant='index' className={classes.home_view__section_index}>
                {section.index}
              </Label>
              <div className={classes.home_view__section_titles}>
                <Heading variant='h2'>{section.title}</Heading>
                {section.sub && (
                  <Content as='p' className={classes.home_view__section_sub}>
                    {section.sub}
                  </Content>
                )}
              </div>
            </div>

            {SECTION_BODIES[section.id]}
          </section>
        ))}
      </div>
    </main>
  );
}
