'use client';

import { useRef, useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';

import { marketConfig } from '@domain/market/marketConfig';

import Label from '@ui/atoms/typography/Label';
import ArrowRightIcon from '@ui/icons/arrow-right.svg';

import { useIsVisible } from '@utils/hooks/useIsVisible';
import { usePrefersReducedMotion } from '@utils/hooks/usePrefersReducedMotion';

import { formatChange, formatPrice, formatTime, MARKET_STATUS_LABEL } from './format';
import classes from './MarketTicker.module.scss';
import { useMarketFeed } from './useMarketFeed';
import useSparklineCanvas from './useSparklineCanvas';

const TAPE_ROWS = 4;
const SPARK_POINTS = 60;
const PIPELINE = 'datasource → MarketFeed → useSyncExternalStore → canvas';

type TProps = {
  className?: string;
};

export default function MarketTicker(props: TProps) {
  const { className } = props;
  const rootRef = useRef<HTMLElement>(null);
  const sparkRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [pausedByUser, setPausedByUser] = useState<boolean | null>(null);
  const visible = useIsVisible(rootRef, '0px');

  const paused = pausedByUser ?? reducedMotion;
  const snapshot = useMarketFeed(TAPE_ROWS, SPARK_POINTS, visible && !paused);

  useSparklineCanvas({ rootRef, canvasRef: sparkRef, points: snapshot.history });

  const change = snapshot.changePercent;
  const slots = Array.from({ length: TAPE_ROWS }, (_, index) => snapshot.tape[index]);

  return (
    <figure className={clsx(classes.ticker, className)} ref={rootRef} aria-label={`Поток сделок ${marketConfig.pair}`}>
      <div className={classes.ticker__head}>
        <span className={classes.ticker__note} aria-hidden>
          datasource
        </span>
        <Label className={classes.ticker__pair}>{marketConfig.pair}</Label>
        <button type='button' className={classes.ticker__toggle} aria-pressed={paused} onClick={() => setPausedByUser(!paused)}>
          <Label>{paused ? 'Запустить' : 'Пауза'}</Label>
        </button>
      </div>

      <div className={classes.ticker__quote}>
        <Label className={classes.ticker__price}>{formatPrice(snapshot.last)}</Label>
        <Label className={clsx(classes.ticker__change, change !== null && (change >= 0 ? classes.ticker__up : classes.ticker__down))}>
          {change === null ? '' : formatChange(change)}
        </Label>
        <span className={classes.ticker__status}>
          <span className={clsx(classes.ticker__dot, snapshot.status === 'live' && classes.ticker__dot_live)} />
          <Label>{paused ? 'на паузе' : MARKET_STATUS_LABEL[snapshot.status]}</Label>
        </span>
      </div>

      <div className={classes.ticker__chart}>
        <span className={classes.ticker__note} aria-hidden>
          canvas
        </span>
        <canvas className={classes.ticker__spark} ref={sparkRef} aria-hidden />
      </div>

      <div className={classes.ticker__tape_wrap}>
        <span className={classes.ticker__note} aria-hidden>
          MarketFeed → useSyncExternalStore
        </span>
        <ol className={classes.ticker__tape} aria-label='Последние сделки'>
          {slots.map((entry, slot) => (
            <li key={slot} className={classes.ticker__trade}>
              {entry && (
                <>
                  <Label>{formatTime(entry.trade.time)}</Label>
                  <Label className={entry.trade.buy ? classes.ticker__up : classes.ticker__down}>{entry.trade.price.toFixed(1)}</Label>
                  <Label>{entry.trade.qty.toFixed(3)}</Label>
                </>
              )}
            </li>
          ))}
        </ol>
      </div>

      <figcaption className={classes.ticker__caption}>
        <span className={classes.ticker__sr}>Схема потока: {PIPELINE}</span>
        <Link href='/works#market' className={classes.ticker__link}>
          <Label>Весь виджет</Label>
          <ArrowRightIcon className={classes.ticker__link_icon} aria-hidden />
        </Link>
      </figcaption>
    </figure>
  );
}
