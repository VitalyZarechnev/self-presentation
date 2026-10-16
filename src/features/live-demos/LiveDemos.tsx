import { liveDemoExtras, liveDemos, TLiveDemo } from '@domain/works/liveDemos';

import TicTacToe from '@features/tic-tac-toe/TicTacToe';

import Label from '@ui/atoms/typography/Label';
import ArrowUpRightIcon from '@ui/icons/arrow-up-right.svg';

import DemoCard, { TDemoCardLayout } from './DemoCard';
import DemoPreview from './DemoPreview';
import classes from './LiveDemos.module.scss';
import { DEMO_PREVIEWS } from './previews';

const FEATURE_SIZES = '(max-width: 860px) 100vw, 500px';
const HALF_SIZES = '(max-width: 860px) 100vw, 420px';

function layoutFor(demo: TLiveDemo): TDemoCardLayout {
  if (demo.id === 'geo-trips') return 'feature';
  if (demo.id === 'tic-tac-toe') return 'inline';
  return 'half';
}

function previewFor(demo: TLiveDemo, layout: TDemoCardLayout) {
  const preview = DEMO_PREVIEWS[demo.id];
  if (preview) return <DemoPreview preview={preview} sizes={layout === 'feature' ? FEATURE_SIZES : HALF_SIZES} />;
  return <TicTacToe />;
}

export default function LiveDemos() {
  return (
    <div className={classes.live_demos}>
      <div className={classes.live_demos__grid}>
        {liveDemos.map((demo) => {
          const layout = layoutFor(demo);
          return <DemoCard key={demo.id} demo={demo} layout={layout} preview={previewFor(demo, layout)} />;
        })}
      </div>

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
