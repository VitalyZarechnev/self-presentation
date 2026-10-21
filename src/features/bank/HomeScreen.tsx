import { useState } from 'react';

import ArrowUpRight from '@ui/icons/arrow-up-right.svg';
import ChartPie from '@ui/icons/chart-pie.svg';
import CreditCard from '@ui/icons/credit-card.svg';
import LookOff from '@ui/icons/look-off.svg';
import LookOn from '@ui/icons/look-on.svg';
import Plus from '@ui/icons/plus.svg';
import Shield from '@ui/icons/shield.svg';

import { displayName, useBankCopy } from './copy';
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
  const copy = useBankCopy();
  const t = copy.home;
  const holder = displayName(copy, account.holder);

  return (
    <>
      <div className={classes.greeting}>
        <div>
          <p className={classes.greetSub}>{t.greeting}</p>
          <p className={classes.greetName}>{holder.split(' ')[0]}</p>
        </div>
        <span className={classes.avatar}>{initials(holder)}</span>
      </div>

      <div className={classes.balanceCard}>
        <div className={classes.balanceTop}>
          <span>
            {displayName(copy, account.bank)} · {t.account}
          </span>
          <span>•• {account.cardLast4}</span>
        </div>
        <div className={classes.balanceRow}>
          <span className={classes.balanceAmount}>{shown ? formatMoney(balance, copy.intl) : '•• ••• ₽'}</span>
          <button className={classes.eye} onClick={() => setShown((v) => !v)} aria-label={shown ? t.hide : t.show}>
            {shown ? <LookOn /> : <LookOff />}
          </button>
        </div>
        <p className={classes.balanceSub}>{account.insured ? t.insured : t.personal}</p>
      </div>

      <div className={classes.actions}>
        <QuickAction icon={<ArrowUpRight />} label={t.transfer} onClick={() => navigate('transfer')} />
        <QuickAction icon={<Plus />} label={t.topUp} onClick={() => navigate('topup')} />
        <QuickAction icon={<ChartPie />} label={t.analytics} onClick={() => navigate('analytics')} />
        <QuickAction icon={<CreditCard />} label={t.card} onClick={() => navigate('card')} />
      </div>

      <button className={classes.promo} onClick={() => navigate('insurance')}>
        <span className={classes.promoIcon}>
          <Shield />
        </span>
        <span className={classes.promoText}>
          <span className={classes.promoTitle}>{t.insurance}</span>
          <span className={classes.promoSub}>{account.insured ? t.insuranceActive : t.insuranceSub}</span>
        </span>
      </button>

      <div className={classes.sectionHead}>
        <span>{t.recent}</span>
        <button className={classes.link} onClick={() => navigate('analytics')}>
          {t.all}
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
