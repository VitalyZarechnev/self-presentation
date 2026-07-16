import { TBankState } from '@domain/bank/models/BankState';
import { TTransaction } from '@domain/bank/models/Transaction';

export type TScreen = 'home' | 'transfer' | 'topup' | 'analytics' | 'card' | 'insurance';

export type TBankActions = {
  transfer: (recipient: string, amount: number) => void;
  topUp: (amount: number, source: string) => void;
  toggleFreeze: () => void;
  insure: () => void;
};

export type TScreenProps = {
  state: TBankState;
  actions: TBankActions;
  navigate: (screen: TScreen) => void;
  onOpenOperation: (tx: TTransaction) => void;
  animatedBalance: number;
};
