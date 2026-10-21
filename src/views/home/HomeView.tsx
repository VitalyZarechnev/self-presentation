'use client';

import { ReactNode } from 'react';

import { useLocale, useLocalizedTitle } from '@application/locale/LocaleProvider';

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

const TITLES = { ru: 'Виталий Заречнев — Senior Frontend Engineer', en: 'Vitaly Zarechnev — Senior Frontend Engineer' };

const MESSAGES = {
  ru: {
    title: 'Веду фронтенд от архитектуры до продакшна и команду, которая это делает',
    lead: 'Clean Architecture — стандарт отдела: старт проектов ×4 быстрее, −40% багов.',
    demos: 'Смотреть живые демо',
    experience: 'Опыт',
    name: 'Виталий Заречнев',
    byline: 'Senior Frontend Engineer, руковожу командой 4+ года',
  },
  en: {
    title: 'I lead frontend from architecture to production — and the team that builds it',
    lead: 'Clean Architecture as the department standard: projects start ×4 faster, −40% bugs.',
    demos: 'See the live demos',
    experience: 'Experience',
    name: 'Vitaly Zarechnev',
    byline: 'Senior Frontend Engineer, leading a team for 4+ years',
  },
} as const;

export default function HomeView() {
  const { locale } = useLocale();
  const t = MESSAGES[locale];
  useLocalizedTitle(TITLES);

  return (
    <main className={classes.home_view}>
      <SiteHeader />

      <section id='content' className={classes.home_view__hero} aria-labelledby='hero-title'>
        <Heading variant='h1' id='hero-title' className={classes.home_view__title}>
          {t.title}
        </Heading>

        <div className={classes.home_view__intro}>
          <Display className={classes.home_view__lead}>{t.lead}</Display>
          <div className={classes.home_view__actions}>
            <ActionButton href='#works' variant='primary'>
              {t.demos}
              <ArrowRightIcon className={classes.home_view__action_icon} aria-hidden />
            </ActionButton>
            <ActionButton href='#experience' variant='secondary'>
              {t.experience}
              <ArrowDownIcon className={classes.home_view__action_icon} aria-hidden />
            </ActionButton>
          </div>
          <Content as='p' size='mini' className={classes.home_view__byline}>
            <strong className={classes.home_view__name}>{t.name}</strong> — {t.byline}
          </Content>
        </div>

        <MarketTicker className={classes.home_view__ticker} />
      </section>

      <div className={classes.home_view__content}>
        {sectionsMeta[locale].map((section) => (
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
        <Label as='p'>
          © {BUILD_YEAR} {t.name}
        </Label>
      </footer>
    </main>
  );
}
