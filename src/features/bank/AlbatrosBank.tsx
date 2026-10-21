'use client';

import { ComponentType, useMemo, useReducer, useState } from 'react';
import clsx from 'clsx';

import { registry } from '@application/di/AppRegistry';

import { TTransaction } from '@domain/bank/models/Transaction';

import ChartPie from '@ui/icons/chart-pie.svg';
import CreditCard from '@ui/icons/credit-card.svg';
import Home from '@ui/icons/home.svg';
import Shield from '@ui/icons/shield.svg';

import classes from './AlbatrosBank.module.scss';
import AnalyticsScreen from './AnalyticsScreen';
import { bankReducer, txMeta } from './bankReducer';
import CardScreen from './CardScreen';
import { useBankCopy } from './copy';
import HomeScreen from './HomeScreen';
import InsuranceScreen from './InsuranceScreen';
import TopUpScreen from './TopUpScreen';
import TransferScreen from './TransferScreen';
import { TBankActions, TScreen, TScreenProps } from './types';
import OperationSheet from './ui/OperationSheet';
import PhoneFrame from './ui/PhoneFrame';
import { useAnimatedNumber } from './useAnimatedNumber';

const SCREENS: Record<TScreen, ComponentType<TScreenProps>> = {
  home: HomeScreen,
  transfer: TransferScreen,
  topup: TopUpScreen,
  analytics: AnalyticsScreen,
  card: CardScreen,
  insurance: InsuranceScreen,
};

const TABS = [
  { id: 'home', Icon: Home },
  { id: 'analytics', Icon: ChartPie },
  { id: 'card', Icon: CreditCard },
  { id: 'insurance', Icon: Shield },
] as const satisfies readonly { id: TScreen; Icon: ComponentType }[];

export default function AlbatrosBank() {
  const initial = useMemo(() => registry.bankDatasource.getState(), []);
  const [state, dispatch] = useReducer(bankReducer, initial);
  const [screen, setScreen] = useState<TScreen>('home');
  const [operation, setOperation] = useState<TTransaction | null>(null);
  const copy = useBankCopy();

  const actions: TBankActions = useMemo(
    () => ({
      transfer: (recipient, amount) => dispatch({ type: 'transfer', recipient, amount, meta: txMeta() }),
      topUp: (amount, source) => dispatch({ type: 'topup', amount, source, meta: txMeta() }),
      toggleFreeze: () => dispatch({ type: 'toggleFreeze' }),
      insure: () => dispatch({ type: 'insure', meta: txMeta() }),
    }),
    [],
  );

  const Screen = SCREENS[screen];
  const activeTab: TScreen = screen === 'transfer' || screen === 'topup' ? 'home' : screen;
  const animatedBalance = Math.round(useAnimatedNumber(state.account.balance));

  return (
    <PhoneFrame>
      <div className={classes.app}>
        <div className={classes.stage}>
          <div key={screen} className={classes.body}>
            <Screen state={state} actions={actions} navigate={setScreen} onOpenOperation={setOperation} animatedBalance={animatedBalance} />
          </div>
        </div>
        <nav className={classes.nav}>
          {TABS.map(({ id, Icon }) => (
            <button
              key={id}
              className={clsx(classes.tab, activeTab === id && classes.tabOn)}
              aria-current={activeTab === id ? 'page' : undefined}
              onClick={() => setScreen(id)}
            >
              <Icon />
              {copy.tabs[id]}
            </button>
          ))}
        </nav>
      </div>
      {operation && (
        <OperationSheet
          tx={operation}
          cardLast4={state.account.cardLast4}
          bankName={state.account.bank}
          onClose={() => setOperation(null)}
        />
      )}
    </PhoneFrame>
  );
}
