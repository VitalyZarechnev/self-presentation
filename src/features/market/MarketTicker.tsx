'use client';

import { useRef, useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';

import { useLocale } from '@application/locale/LocaleProvider';

import { marketConfig } from '@domain/market/marketConfig';

import Label from '@ui/atoms/typography/Label';
import ArrowRightIcon from '@ui/icons/arrow-right.svg';

import { useIsVisible } from '@utils/hooks/useIsVisible';
import { usePrefersReducedMotion } from '@utils/hooks/usePrefersReducedMotion';

import { formatChange, formatPrice, formatTime, MARKET_STATUS_LABEL } from './format';
import classes from './MarketTicker.module.scss';
import useFeedStall from './useFeedStall';
import { useMarketFeed } from './useMarketFeed';
import useSparklineCanvas from './useSparklineCanvas';

const TAPE_ROWS = 4;
const SPARK_POINTS = 60;
const PIPELINE = 'datasource → MarketFeed → useSyncExternalStore → canvas';
const STALL_TIMEOUT = 4000;

const MESSAGES = {
  ru: {
    paused: 'на паузе',
    noData: 'нет данных',
    figure: 'Поток сделок',
    resume: 'Запустить',
    pause: 'Пауза',
    tape: 'Последние сделки',
    stalled: 'Поток не ответил — полный виджет ниже по ссылке',
    pipeline: 'Схема потока',
    widget: 'Весь виджет',
  },
  en: {
    paused: 'paused',
    noData: 'no data',
    figure: 'Trade stream',
    resume: 'Resume',
    pause: 'Pause',
    tape: 'Latest trades',
    stalled: 'The stream did not answer — the full widget is behind the link below',
    pipeline: 'Data flow',
    widget: 'Full widget',
  },
} as const;

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

  const hasData = snapshot.last > 0;
  const stalled = useFeedStall({ active: visible && !paused, hasData, timeout: STALL_TIMEOUT });
  const { locale } = useLocale();
  const t = MESSAGES[locale];
  const statusLabel = paused ? t.paused : stalled ? t.noData : MARKET_STATUS_LABEL[locale][snapshot.status];

  const change = snapshot.changePercent;
  const slots = Array.from({ length: TAPE_ROWS }, (_, index) => snapshot.tape[index]);

  return (
    <figure className={clsx(classes.ticker, className)} ref={rootRef} aria-label={`${t.figure} ${marketConfig.pair}`}>
      <div className={classes.ticker__head}>
        <span className={classes.ticker__note} aria-hidden>
          datasource
        </span>
        <Label className={classes.ticker__pair}>{marketConfig.pair}</Label>
        <button type='button' className={classes.ticker__toggle} aria-pressed={paused} onClick={() => setPausedByUser(!paused)}>
          <Label>{paused ? t.resume : t.pause}</Label>
        </button>
      </div>

      <div className={classes.ticker__quote}>
        <Label className={classes.ticker__price}>{formatPrice(snapshot.last)}</Label>
        <Label className={clsx(classes.ticker__change, change !== null && (change >= 0 ? classes.ticker__up : classes.ticker__down))}>
          {change === null ? '' : formatChange(change)}
        </Label>
        <span className={classes.ticker__status}>
          <span className={clsx(classes.ticker__dot, snapshot.status === 'live' && classes.ticker__dot_live)} />
          <Label>{statusLabel}</Label>
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
        <ol className={classes.ticker__tape} aria-label={t.tape}>
          {slots.map((entry, slot) => (
            <li key={slot} className={clsx(classes.ticker__trade, !entry && !stalled && classes.ticker__trade_empty)}>
              {entry && (
                <>
                  <Label>{formatTime(entry.trade.time)}</Label>
                  <Label className={entry.trade.buy ? classes.ticker__up : classes.ticker__down}>{entry.trade.price.toFixed(1)}</Label>
                  <Label>{entry.trade.qty.toFixed(3)}</Label>
                </>
              )}
              {!entry && stalled && slot === 0 && <Label className={classes.ticker__stalled}>{t.stalled}</Label>}
            </li>
          ))}
        </ol>
      </div>

      <figcaption className={classes.ticker__caption}>
        <span className={classes.ticker__sr}>
          {t.pipeline}: {PIPELINE}
        </span>
        <Link href='/works#market' className={classes.ticker__link}>
          <Label>{t.widget}</Label>
          <ArrowRightIcon className={classes.ticker__link_icon} aria-hidden />
        </Link>
      </figcaption>
    </figure>
  );
}
