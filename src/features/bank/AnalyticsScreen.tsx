import { useState } from 'react';
import clsx from 'clsx';

import { TTransactionCategory } from '@domain/bank/models/Transaction';
import { categoryTotals } from '@domain/bank/operations';

import classes from './AnalyticsScreen.module.scss';
import { CATEGORY_META } from './categoryMeta';
import { useBankCopy } from './copy';
import { formatMoney } from './format';
import { TScreenProps } from './types';
import OperationRow from './ui/OperationRow';
import ScreenHead from './ui/ScreenHead';

const RADIUS = 50;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const BASE_WIDTH = 15;
const ACTIVE_WIDTH = 23;

export default function AnalyticsScreen({ state, onOpenOperation }: TScreenProps) {
  const [active, setActive] = useState<TTransactionCategory | null>(null);
  const copy = useBankCopy();
  const t = copy.analytics;
  const totals = categoryTotals(state.transactions);
  const sum = totals.reduce((acc, item) => acc + item.total, 0);

  const lengths = totals.map((item) => (sum ? (item.total / sum) * CIRCUMFERENCE : 0));
  const segments = totals.map((item, index) => ({
    category: item.category,
    length: lengths[index],
    offset: lengths.slice(0, index).reduce((acc, value) => acc + value, 0),
  }));

  const centerTotal = active ? (totals.find((item) => item.category === active)?.total ?? 0) : sum;
  const centerLabel = active ? copy.categories[active] : t.total;

  const toggle = (category: TTransactionCategory): void => setActive((current) => (current === category ? null : category));

  return (
    <>
      <ScreenHead title={t.title} />
      <p className={classes.subTitle}>{t.byCategory}</p>

      <div className={classes.donutWrap}>
        <svg viewBox='0 0 120 120' className={classes.donut} role='img' aria-label={t.byCategory}>
          <circle cx='60' cy='60' r={RADIUS} fill='none' stroke='#ececef' strokeWidth={BASE_WIDTH} />
          <g transform='rotate(-90 60 60)' fill='none'>
            {segments.map((segment) => {
              const isActive = segment.category === active;
              return (
                <circle
                  key={segment.category}
                  cx='60'
                  cy='60'
                  r={RADIUS}
                  stroke={CATEGORY_META[segment.category].color}
                  strokeWidth={isActive ? ACTIVE_WIDTH : BASE_WIDTH}
                  strokeDasharray={`${segment.length} ${CIRCUMFERENCE - segment.length}`}
                  strokeDashoffset={-segment.offset}
                  opacity={active && !isActive ? 0.3 : 1}
                  className={classes.segment}
                />
              );
            })}
          </g>
        </svg>
        <div className={classes.donutCenter}>
          <span className={classes.donutLabel}>{centerLabel}</span>
          <span className={classes.donutTotal}>{formatMoney(centerTotal, copy.intl)}</span>
        </div>
      </div>

      <div className={classes.legend}>
        {totals.map((item) => (
          <button
            key={item.category}
            type='button'
            className={clsx(classes.legendRow, item.category === active && classes.legendRowOn)}
            onClick={() => toggle(item.category)}
          >
            <span className={classes.dot} style={{ background: CATEGORY_META[item.category].color }} />
            <span className={classes.legendLabel}>{copy.categories[item.category]}</span>
            <span className={classes.legendVal}>{formatMoney(item.total, copy.intl)}</span>
          </button>
        ))}
      </div>

      <p className={classes.opsHead}>{t.all}</p>
      <div>
        {state.transactions.map((tx) => (
          <OperationRow key={tx.id} tx={tx} onClick={() => onOpenOperation(tx)} />
        ))}
      </div>
    </>
  );
}
