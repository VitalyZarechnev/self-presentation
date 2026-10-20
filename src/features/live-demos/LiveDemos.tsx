import Link from 'next/link';

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
// The hero ticker already runs the market demo live, so the section links to it instead of showing a snapshot.
const HERO_DEMO_ID = 'market';

const cardDemos = liveDemos.filter((demo) => demo.id !== HERO_DEMO_ID);
const heroDemo = liveDemos.find((demo) => demo.id === HERO_DEMO_ID);

function layoutFor(demo: TLiveDemo): TDemoCardLayout {
  if (demo.id === 'tic-tac-toe') return 'inline';
  return demo.id === 'bank' ? 'feature_reverse' : 'feature';
}

function previewFor(demo: TLiveDemo) {
  const preview = DEMO_PREVIEWS[demo.id];
  if (preview) return <DemoPreview preview={preview} sizes={PREVIEW_SIZES} />;
  return <TicTacToe />;
}

export default function LiveDemos() {
  return (
    <div className={classes.live_demos}>
      <div className={classes.live_demos__grid}>
        {cardDemos.map((demo) => (
          <DemoCard key={demo.id} demo={demo} layout={layoutFor(demo)} preview={previewFor(demo)} />
        ))}
      </div>

      {heroDemo?.href && (
        <p className={classes.live_demos__hero}>
          <span className={classes.live_demos__hero_text}>Лента сделок в первом экране — это и есть живое демо.</span>
          <Link href={heroDemo.href} className={classes.live_demos__hero_link}>
            <Label>Полная версия ленты</Label>
            <ArrowRightIcon className={classes.live_demos__hero_icon} aria-hidden />
          </Link>
        </p>
      )}

      <div className={classes.live_demos__extras}>
        <Label className={classes.live_demos__extras_title}>Ещё на отдельных сайтах</Label>
        <ul className={classes.live_demos__extras_list}>
          {liveDemoExtras.map((work) => (
            <li key={work.id}>
              <a className={classes.live_demos__extra} href={work.link} target='_blank' rel='noopener noreferrer'>
                {work.name}
                <ArrowUpRightIcon className={classes.live_demos__extra_icon} aria-hidden />
                <span className={classes.live_demos__sr}>(откроется в новой вкладке)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
