'use client';

import { CSSProperties, useRef } from 'react';
import clsx from 'clsx';

import { marketConfig } from '@domain/market/marketConfig';

import Label from '@ui/atoms/typography/Label';

import { useIsVisible } from '@utils/hooks/useIsVisible';

import { formatChange, formatPrice, formatTime, MARKET_STATUS_LABEL } from './format';
import classes from './LiveMarket.module.scss';
import { useMarketFeed } from './useMarketFeed';
import useSparklineCanvas from './useSparklineCanvas';

const TAPE = marketConfig.tape;
const SPARK_POINTS = 90;

export default function LiveMarket() {
  const rootRef = useRef<HTMLDivElement>(null);
  const sparkRef = useRef<HTMLCanvasElement>(null);
  const visible = useIsVisible(rootRef);
  const snapshot = useMarketFeed(TAPE, SPARK_POINTS, visible);

  useSparklineCanvas({ rootRef, canvasRef: sparkRef, points: snapshot.history });

  const rising = snapshot.last >= snapshot.prev;
  const change = snapshot.changePercent;

  return (
    <div className={classes.market} ref={rootRef}>
      <div className={classes.market__head}>
        <Label className={classes.market__sym}>{marketConfig.pair}</Label>
        <Label className={clsx(classes.market__price, rising ? classes.market__pos : classes.market__neg)}>
          {formatPrice(snapshot.last)}
        </Label>
        {change !== null && (
          <Label className={clsx(classes.market__chg, change >= 0 ? classes.market__pos : classes.market__neg)}>
            {formatChange(change)}
          </Label>
        )}
        <span className={classes.market__status}>
          <b className={clsx(classes.market__dot, snapshot.status === 'live' && classes.market__dot_live)} />
          <Label>{MARKET_STATUS_LABEL[snapshot.status]}</Label>
        </span>
      </div>

      <canvas className={classes.market__spark} ref={sparkRef} />

      <Label as='div' className={classes.market__tape_head}>
        Последние сделки
      </Label>
      <div className={classes.market__tape} style={{ '--tape-rows': TAPE } as CSSProperties}>
        {snapshot.tape.map(({ trade }, slot) => (
          <div key={slot} className={classes.market__trade}>
            <Label>{formatTime(trade.time)}</Label>
            <Label className={trade.buy ? classes.market__pos : classes.market__neg}>{trade.price.toFixed(1)}</Label>
            <Label>{trade.qty.toFixed(3)}</Label>
          </div>
        ))}
      </div>
    </div>
  );
}
