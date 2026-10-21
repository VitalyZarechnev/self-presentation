import { useState } from 'react';
import clsx from 'clsx';

import classes from './CardScreen.module.scss';
import { displayName, useBankCopy } from './copy';
import { TScreenProps } from './types';
import ScreenHead from './ui/ScreenHead';
import Toggle from './ui/Toggle';

export default function CardScreen({ state, actions }: TScreenProps) {
  const { account } = state;
  const [onlinePay, setOnlinePay] = useState(true);
  const copy = useBankCopy();
  const t = copy.card;

  return (
    <>
      <ScreenHead title={t.title} />

      <div className={clsx(classes.plastic, account.cardFrozen && classes.plasticFrozen)}>
        <div className={classes.plasticTop}>
          <span>{displayName(copy, account.bank)}</span>
          {account.cardFrozen && <span className={classes.frozenTag}>{t.frozen}</span>}
        </div>
        <span className={classes.plasticNum}>•• •• •• {account.cardLast4}</span>
        <div className={classes.plasticBottom}>
          <span>{displayName(copy, account.holder)}</span>
          <span>VISA</span>
        </div>
      </div>

      <div className={classes.settings}>
        <Toggle label={t.freeze} on={account.cardFrozen} onToggle={actions.toggleFreeze} />
        <Toggle label={t.online} on={onlinePay} onToggle={() => setOnlinePay((v) => !v)} />
      </div>
    </>
  );
}
