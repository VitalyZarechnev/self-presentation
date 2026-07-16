import { useState } from 'react';

import ArrowUpRight from '@ui/icons/arrow-up-right.svg';
import ChartPie from '@ui/icons/chart-pie.svg';
import CreditCard from '@ui/icons/credit-card.svg';
import LookOff from '@ui/icons/look-off.svg';
import LookOn from '@ui/icons/look-on.svg';
import Plus from '@ui/icons/plus.svg';
import Shield from '@ui/icons/shield.svg';

import { formatMoney } from './format';
import classes from './HomeScreen.module.scss';
import { TScreenProps } from './types';
import OperationRow from './ui/OperationRow';
import QuickAction from './ui/QuickAction';

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('');
}

export default function HomeScreen({ state, navigate, onOpenOperation, animatedBalance }: TScreenProps) {
  const [shown, setShown] = useState(true);
  const balance = animatedBalance;
  const { account, transactions } = state;

  return (
    <>
      <div className={classes.greeting}>
        <div>
          <p className={classes.greetSub}>Добрый день</p>
          <p className={classes.greetName}>{account.holder.split(' ')[0]}</p>
        </div>
        <span className={classes.avatar}>{initials(account.holder)}</span>
      </div>

      <div className={classes.balanceCard}>
        <div className={classes.balanceTop}>
          <span>{account.bank} · счёт</span>
          <span>•• {account.cardLast4}</span>
        </div>
        <div className={classes.balanceRow}>
          <span className={classes.balanceAmount}>{shown ? formatMoney(balance) : '•• ••• ₽'}</span>
          <button className={classes.eye} onClick={() => setShown((v) => !v)} aria-label={shown ? 'Скрыть баланс' : 'Показать баланс'}>
            {shown ? <LookOn /> : <LookOff />}
          </button>
        </div>
        <p className={classes.balanceSub}>{account.insured ? 'Карта застрахована' : 'Личный счёт'}</p>
      </div>

      <div className={classes.actions}>
        <QuickAction icon={<ArrowUpRight />} label='Перевод' onClick={() => navigate('transfer')} />
        <QuickAction icon={<Plus />} label='Пополнить' onClick={() => navigate('topup')} />
        <QuickAction icon={<ChartPie />} label='Аналитика' onClick={() => navigate('analytics')} />
        <QuickAction icon={<CreditCard />} label='Карта' onClick={() => navigate('card')} />
      </div>

      <button className={classes.promo} onClick={() => navigate('insurance')}>
        <span className={classes.promoIcon}>
          <Shield />
        </span>
        <span className={classes.promoText}>
          <span className={classes.promoTitle}>Страхование</span>
          <span className={classes.promoSub}>{account.insured ? 'Активна' : 'Защита жизни и здоровья'}</span>
        </span>
      </button>

      <div className={classes.sectionHead}>
        <span>Последние операции</span>
        <button className={classes.link} onClick={() => navigate('analytics')}>
          Все
        </button>
      </div>
      <div>
        {transactions.slice(0, 6).map((tx) => (
          <OperationRow key={tx.id} tx={tx} onClick={() => onOpenOperation(tx)} />
        ))}
      </div>
    </>
  );
}
