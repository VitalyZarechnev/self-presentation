import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { TTransaction } from '@domain/bank/models/Transaction';

import { CATEGORY_META } from '../categoryMeta';
import { formatSigned, formatTxFull } from '../format';
import classes from './OperationSheet.module.scss';

type TProps = {
  tx: TTransaction;
  cardLast4: string;
  onClose: () => void;
};

function receiptNo(id: string): string {
  let digits = '';
  for (const char of id) digits += char.charCodeAt(0) % 10;
  digits = digits.replace(/^0+/, '').padEnd(10, '4').slice(0, 10);
  return digits.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
}

export default function OperationSheet({ tx, cardLast4, onClose }: TProps) {
  const [receipt, setReceipt] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  const meta = CATEGORY_META[tx.category];
  const Icon = meta.Icon;
  const income = tx.amount > 0;
  const flow = income ? 'Зачисление на счёт' : 'Списание со счёта';

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
        aria-label={`Операция: ${tx.title}`}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <span className={classes.grip} />

        {receipt ? (
          <div className={classes.receipt}>
            <div className={classes.receiptHead}>
              <span className={classes.receiptBank}>Альбатрос</span>
              <span className={classes.receiptKind}>Электронный чек</span>
            </div>
            <span className={classes.receiptAmount}>{formatSigned(tx.amount)}</span>
            <div className={classes.receiptRows}>
              <div className={classes.rRow}>
                <span>Операция</span>
                <span>{tx.title}</span>
              </div>
              <div className={classes.rRow}>
                <span>Категория</span>
                <span>{meta.label}</span>
              </div>
              <div className={classes.rRow}>
                <span>Дата</span>
                <span>{formatTxFull(tx.timestamp)}</span>
              </div>
              <div className={classes.rRow}>
                <span>{flow}</span>
                <span>···· {cardLast4}</span>
              </div>
              <div className={classes.rRow}>
                <span>Чек №</span>
                <span>{receiptNo(tx.id)}</span>
              </div>
              <div className={classes.rRow}>
                <span>Статус</span>
                <span className={classes.ok}>Выполнено</span>
              </div>
            </div>
            <span className={classes.receiptFoot}>Спасибо, что с нами</span>
            <button type='button' className={classes.secondary} onClick={() => setReceipt(false)}>
              Назад
            </button>
          </div>
        ) : (
          <>
            <span className={classes.icon} style={{ background: meta.bg, color: meta.color }}>
              <Icon />
            </span>
            <span className={classes.title}>{tx.title}</span>
            <span className={classes.category}>{meta.label}</span>
            <span className={clsx(classes.amount, income && classes.amountIncome)}>{formatSigned(tx.amount)}</span>

            <div className={classes.info}>
              <div className={classes.row}>
                <span className={classes.rowLabel}>Дата и время</span>
                <span className={classes.rowValue}>{formatTxFull(tx.timestamp)}</span>
              </div>
              <div className={classes.row}>
                <span className={classes.rowLabel}>{flow}</span>
                <span className={classes.rowValue}>···· {cardLast4}</span>
              </div>
              <div className={classes.row}>
                <span className={classes.rowLabel}>Статус</span>
                <span className={classes.ok}>Выполнено</span>
              </div>
            </div>

            <button type='button' className={classes.primary} onClick={() => setReceipt(true)}>
              Посмотреть чек
            </button>
          </>
        )}
      </div>
    </div>
  );
}
