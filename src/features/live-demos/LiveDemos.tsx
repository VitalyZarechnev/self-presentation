'use client';

import Link from 'next/link';

import { useLocale } from '@application/locale/LocaleProvider';

import { TLocale } from '@domain/locale/locale';
import { liveDemoExtras, liveDemos, TLiveDemo } from '@domain/works/liveDemos';

import TicTacToe from '@features/tic-tac-toe/TicTacToe';

import Label from '@ui/atoms/typography/Label';
import ArrowRightIcon from '@ui/icons/arrow-right.svg';
import ArrowUpRightIcon from '@ui/icons/arrow-up-right.svg';

import DemoCard, { TDemoCardLayout } from './DemoCard';
import DemoPreview from './DemoPreview';
import classes from './LiveDemos.module.scss';
import { DEMO_PREVIEWS } from './previews';

const PREVIEW_SIZES = '(max-width: 860px) 100vw, 500px';
const HERO_DEMO_ID = 'market';

const MESSAGES = {
  ru: {
    hero: 'Лента сделок в первом экране — это и есть живое демо.',
    heroLink: 'Полная версия ленты',
    extras: 'Ещё на отдельных сайтах',
    newTab: '(откроется в новой вкладке)',
  },
  en: {
    hero: 'The trade feed on the first screen is the live demo itself.',
    heroLink: 'Full feed',
    extras: 'More on separate sites',
    newTab: '(opens in a new tab)',
  },
} as const;

function layoutFor(demo: TLiveDemo): TDemoCardLayout {
  if (demo.id === 'tic-tac-toe') return 'inline';
  return demo.id === 'bank' ? 'feature_reverse' : 'feature';
}

function previewFor(demo: TLiveDemo, locale: TLocale) {
  const preview = DEMO_PREVIEWS[demo.id];
  if (preview) return <DemoPreview preview={preview} alt={preview.alt[locale]} sizes={PREVIEW_SIZES} />;
  return <TicTacToe />;
}

export default function LiveDemos() {
  const { locale } = useLocale();
  const t = MESSAGES[locale];
  const cardDemos = liveDemos[locale].filter((demo) => demo.id !== HERO_DEMO_ID);
  const heroDemo = liveDemos[locale].find((demo) => demo.id === HERO_DEMO_ID);

  return (
    <div className={classes.live_demos}>
      <div className={classes.live_demos__grid}>
        {cardDemos.map((demo) => (
          <DemoCard key={demo.id} demo={demo} layout={layoutFor(demo)} preview={previewFor(demo, locale)} />
        ))}
      </div>

      {heroDemo?.href && (
        <p className={classes.live_demos__hero}>
          <span className={classes.live_demos__hero_text}>{t.hero}</span>
          <Link href={heroDemo.href} className={classes.live_demos__hero_link}>
            <Label>{t.heroLink}</Label>
            <ArrowRightIcon className={classes.live_demos__hero_icon} aria-hidden />
          </Link>
        </p>
      )}

      <div className={classes.live_demos__extras}>
        <Label className={classes.live_demos__extras_title}>{t.extras}</Label>
        <ul className={classes.live_demos__extras_list}>
          {liveDemoExtras[locale].map((work) => (
            <li key={work.id}>
              <a className={classes.live_demos__extra} href={work.link} target='_blank' rel='noopener noreferrer'>
                {work.name}
                <ArrowUpRightIcon className={classes.live_demos__extra_icon} aria-hidden />
                <span className={classes.live_demos__sr}>{t.newTab}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
