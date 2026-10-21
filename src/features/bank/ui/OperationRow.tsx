import clsx from 'clsx';

import { TTransaction } from '@domain/bank/models/Transaction';

import { CATEGORY_META } from '../categoryMeta';
import { txTitle, useBankCopy } from '../copy';
import { formatSigned, formatTxDate } from '../format';
import classes from './OperationRow.module.scss';

type TProps = {
  tx: TTransaction;
  onClick?: () => void;
};

export default function OperationRow({ tx, onClick }: TProps) {
  const meta = CATEGORY_META[tx.category];
  const Icon = meta.Icon;
  const copy = useBankCopy();

  return (
    <button type='button' className={classes.op} onClick={onClick}>
      <span className={classes.icon} style={{ background: meta.bg, color: meta.color }}>
        <Icon />
      </span>
      <span className={classes.main}>
        <span className={classes.title}>{txTitle(copy, tx)}</span>
        <span className={classes.sub}>
          {copy.categories[tx.category]} · {formatTxDate(tx.timestamp, copy)}
        </span>
      </span>
      <span className={clsx(classes.amount, tx.amount > 0 && classes.income)}>{formatSigned(tx.amount, copy.intl)}</span>
    </button>
  );
}
