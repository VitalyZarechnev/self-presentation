import { useState } from 'react';
import clsx from 'clsx';

import classes from './CardScreen.module.scss';
import { TScreenProps } from './types';
import ScreenHead from './ui/ScreenHead';
import Toggle from './ui/Toggle';

export default function CardScreen({ state, actions }: TScreenProps) {
  const { account } = state;
  const [onlinePay, setOnlinePay] = useState(true);

  return (
    <>
      <ScreenHead title='Карта' />

      <div className={clsx(classes.plastic, account.cardFrozen && classes.plasticFrozen)}>
        <div className={classes.plasticTop}>
          <span>{account.bank}</span>
          {account.cardFrozen && <span className={classes.frozenTag}>заморожена</span>}
        </div>
        <span className={classes.plasticNum}>•• •• •• {account.cardLast4}</span>
        <div className={classes.plasticBottom}>
          <span>{account.holder}</span>
          <span>VISA</span>
        </div>
      </div>

      <div className={classes.settings}>
        <Toggle label='Заморозить карту' on={account.cardFrozen} onToggle={actions.toggleFreeze} />
        <Toggle label='Оплата в интернете' on={onlinePay} onToggle={() => setOnlinePay((v) => !v)} />
      </div>
    </>
  );
}
