import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { TTransaction } from '@domain/bank/models/Transaction';

import { CATEGORY_META } from '../categoryMeta';
import { displayName, txTitle, useBankCopy } from '../copy';
import { formatSigned, formatTxFull } from '../format';
import classes from './OperationSheet.module.scss';

type TProps = {
  tx: TTransaction;
  cardLast4: string;
  bankName: string;
  onClose: () => void;
};

function receiptNo(id: string): string {
  let digits = '';
  for (const char of id) digits += char.charCodeAt(0) % 10;
  digits = digits.replace(/^0+/, '').padEnd(10, '4').slice(0, 10);
  return digits.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
}

export default function OperationSheet({ tx, cardLast4, bankName, onClose }: TProps) {
  const [receipt, setReceipt] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  const meta = CATEGORY_META[tx.category];
  const Icon = meta.Icon;
  const income = tx.amount > 0;
  const copy = useBankCopy();
  const t = copy.sheet;
  const title = txTitle(copy, tx);
  const category = copy.categories[tx.category];
  const flow = income ? t.credit : t.debit;

  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    sheetRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') closeRef.current();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      trigger?.focus();
    };
  }, []);

  return (
    <div className={classes.backdrop} onClick={onClose}>
      <div
        className={classes.sheet}
        ref={sheetRef}
        role='dialog'
        aria-modal='true'
        aria-label={`${t.operation}: ${title}`}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <span className={classes.grip} />

        {receipt ? (
          <div className={classes.receipt}>
            <div className={classes.receiptHead}>
              <span className={classes.receiptBank}>{displayName(copy, bankName)}</span>
              <span className={classes.receiptKind}>{t.receiptKind}</span>
            </div>
            <span className={classes.receiptAmount}>{formatSigned(tx.amount, copy.intl)}</span>
            <div className={classes.receiptRows}>
              <div className={classes.rRow}>
                <span>{t.operationLabel}</span>
                <span>{title}</span>
              </div>
              <div className={classes.rRow}>
                <span>{t.category}</span>
                <span>{category}</span>
              </div>
              <div className={classes.rRow}>
                <span>{t.date}</span>
                <span>{formatTxFull(tx.timestamp, copy.intl)}</span>
              </div>
              <div className={classes.rRow}>
                <span>{flow}</span>
                <span>···· {cardLast4}</span>
              </div>
              <div className={classes.rRow}>
                <span>{t.receiptNo}</span>
                <span>{receiptNo(tx.id)}</span>
              </div>
              <div className={classes.rRow}>
                <span>{t.status}</span>
                <span className={classes.ok}>{t.completed}</span>
              </div>
            </div>
            <span className={classes.receiptFoot}>{t.thanks}</span>
            <button type='button' className={classes.secondary} onClick={() => setReceipt(false)}>
              {copy.back}
            </button>
          </div>
        ) : (
          <>
            <span className={classes.icon} style={{ background: meta.bg, color: meta.color }}>
              <Icon />
            </span>
            <span className={classes.title}>{title}</span>
            <span className={classes.category}>{category}</span>
            <span className={clsx(classes.amount, income && classes.amountIncome)}>{formatSigned(tx.amount, copy.intl)}</span>

            <div className={classes.info}>
              <div className={classes.row}>
                <span className={classes.rowLabel}>{t.dateTime}</span>
                <span className={classes.rowValue}>{formatTxFull(tx.timestamp, copy.intl)}</span>
              </div>
              <div className={classes.row}>
                <span className={classes.rowLabel}>{flow}</span>
                <span className={classes.rowValue}>···· {cardLast4}</span>
              </div>
              <div className={classes.row}>
                <span className={classes.rowLabel}>{t.status}</span>
                <span className={classes.ok}>{t.completed}</span>
              </div>
            </div>

            <button type='button' className={classes.primary} onClick={() => setReceipt(true)}>
              {t.showReceipt}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
