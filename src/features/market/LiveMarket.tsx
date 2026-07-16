'use client';

import { CSSProperties, useEffect, useRef } from 'react';
import clsx from 'clsx';

import { useTheme } from '@application/theme/ThemeProvider';

import { TMarketStatus } from '@domain/market/datasources/IMarketDatasource';
import { marketConfig } from '@domain/market/marketConfig';

import Label from '@ui/atoms/typography/Label';

import { useIsVisible } from '@utils/hooks/useIsVisible';

import classes from './LiveMarket.module.scss';
import { renderSparkline } from './renderSparkline';
import { useMarketFeed } from './useMarketFeed';

const TAPE = marketConfig.tape;
const SPARK_POINTS = 90;
const DEFAULT_ACCENT = '#5db0ff';

const STATUS_LABEL: Record<TMarketStatus, string> = {
  connecting: 'подключение…',
  live: 'live · binance',
  demo: 'демо-поток',
};

function accentColor(el: Element): string {
  return getComputedStyle(el).getPropertyValue('--accent').trim() || DEFAULT_ACCENT;
}

function formatTime(ms: number): string {
  const date = new Date(ms);
  return [date.getHours(), date.getMinutes(), date.getSeconds()].map((n) => String(n).padStart(2, '0')).join(':');
}

function formatChange(percent: number): string {
  return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
}

export default function LiveMarket() {
  const { theme } = useTheme();
  const rootRef = useRef<HTMLDivElement>(null);
  const sparkRef = useRef<HTMLCanvasElement>(null);
  const visible = useIsVisible(rootRef);
  const snapshot = useMarketFeed(TAPE, SPARK_POINTS, visible);
  const drawRef = useRef<() => void>(() => {});

  useEffect(() => {
    const canvas = sparkRef.current;
    if (!canvas) return;
    const color = rootRef.current ? accentColor(rootRef.current) : DEFAULT_ACCENT;
    drawRef.current = () => renderSparkline({ canvas, points: snapshot.history, color });
    drawRef.current();
  }, [snapshot.history, theme]);

  useEffect(() => {
    const canvas = sparkRef.current;
    if (!canvas) return undefined;
    const observer = new ResizeObserver(() => drawRef.current());
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  const rising = snapshot.last >= snapshot.prev;
  const change = snapshot.changePercent;

  return (
    <div className={classes.market} ref={rootRef}>
      <div className={classes.market__head}>
        <Label className={classes.market__sym}>{marketConfig.pair}</Label>
        <Label className={clsx(classes.market__price, rising ? classes.market__pos : classes.market__neg)}>
          {snapshot.last ? snapshot.last.toFixed(1) : '—'}
        </Label>
        {change !== null && (
          <Label className={clsx(classes.market__chg, change >= 0 ? classes.market__pos : classes.market__neg)}>
            {formatChange(change)}
          </Label>
        )}
        <span className={classes.market__status}>
          <b className={clsx(classes.market__dot, snapshot.status === 'live' && classes.market__dot_live)} />
          <Label>{STATUS_LABEL[snapshot.status]}</Label>
        </span>
      </div>

      <canvas className={classes.market__spark} ref={sparkRef} />

      <Label as='div' className={classes.market__tape_head}>
        Последние сделки
      </Label>
      <div className={classes.market__tape} style={{ '--tape-rows': TAPE } as CSSProperties}>
        {snapshot.tape.map(({ id, trade }) => (
          <div key={id} className={classes.market__trade}>
            <Label>{formatTime(trade.time)}</Label>
            <Label className={trade.buy ? classes.market__pos : classes.market__neg}>{trade.price.toFixed(1)}</Label>
            <Label>{trade.qty.toFixed(3)}</Label>
          </div>
        ))}
      </div>
    </div>
  );
}
