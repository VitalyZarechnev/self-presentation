import { ReactNode } from 'react';

import Contacts from '@features/contacts/Contacts';
import Education from '@features/education/Education';
import Experience from '@features/experience/Experience';
import Highlights from '@features/highlights/Highlights';
import LiveDemos from '@features/live-demos/LiveDemos';
import MarketTicker from '@features/market/MarketTicker';
import SiteCase from '@features/site-case/SiteCase';
import SiteSourceLink from '@features/site-case/SiteSourceLink';
import { sectionsMeta } from '@features/site-header/sections';
import SiteHeader from '@features/site-header/SiteHeader';
import Skills from '@features/skills/Skills';

import ActionButton from '@ui/atoms/action-button/ActionButton';
import Content from '@ui/atoms/typography/Content';
import Display from '@ui/atoms/typography/Display';
import Heading from '@ui/atoms/typography/Heading';
import Label from '@ui/atoms/typography/Label';
import ArrowDownIcon from '@ui/icons/arrow-down.svg';
import ArrowRightIcon from '@ui/icons/arrow-right.svg';

import classes from './HomeView.module.scss';

const SECTION_BODIES: Record<string, ReactNode> = {
  highlights: <Highlights />,
  experience: <Experience />,
  works: <LiveDemos />,
  skills: <Skills />,
  education: <Education />,
  site: <SiteCase />,
  contacts: <Contacts />,
};

const BUILD_YEAR = new Date().getFullYear();

export default function HomeView() {
  return (
    <main className={classes.home_view}>
      <SiteHeader />

      <section id='content' className={classes.home_view__hero} aria-labelledby='hero-title'>
        <Heading variant='h1' id='hero-title' className={classes.home_view__title}>
          Архитектура фронтенда, которая держит нагрузку и команду
        </Heading>

        <div className={classes.home_view__intro}>
          <Display className={classes.home_view__lead}>
            Clean Architecture — стандарт отдела: старт проектов ×4 быстрее, −40% багов.
          </Display>
          <div className={classes.home_view__actions}>
            <ActionButton href='#works' variant='primary'>
              Смотреть живые демо
              <ArrowRightIcon className={classes.home_view__action_icon} aria-hidden />
            </ActionButton>
            <ActionButton href='#experience' variant='secondary'>
              Опыт
              <ArrowDownIcon className={classes.home_view__action_icon} aria-hidden />
            </ActionButton>
          </div>
          <Content as='p' size='mini' className={classes.home_view__byline}>
            <strong className={classes.home_view__name}>Виталий Заречнев</strong> — Senior Frontend Engineer, руковожу командой 4+ года
          </Content>
        </div>

        <MarketTicker className={classes.home_view__ticker} />
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
      <footer className={classes.home_view__footer}>
        <SiteSourceLink />
        <Label as='p'>© {BUILD_YEAR} Виталий Заречнев</Label>
      </footer>
    </main>
  );
}
