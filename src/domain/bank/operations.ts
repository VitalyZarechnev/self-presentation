import { TBankState } from './models/BankState';
import { TTransaction, TTransactionCategory } from './models/Transaction';

export const INSURANCE_PREMIUM = 20000;

export type TTxMeta = { id: string; timestamp: number };

export type TBankError = 'amount' | 'funds' | 'recipient';

export type TCategoryTotal = { category: TTransactionCategory; total: number };

function prepend(state: TBankState, tx: TTransaction): TBankState {
  return {
    account: { ...state.account, balance: state.account.balance + tx.amount },
    transactions: [tx, ...state.transactions],
  };
}

export function validateSpend(state: TBankState, amount: number): TBankError | null {
  if (!Number.isFinite(amount) || amount <= 0) return 'amount';
  if (amount > state.account.balance) return 'funds';
  return null;
}

export function validateTransfer(state: TBankState, recipient: string, amount: number): TBankError | null {
  if (!recipient.trim()) return 'recipient';
  return validateSpend(state, amount);
}

export function transfer(state: TBankState, recipient: string, amount: number, meta: TTxMeta): TBankState {
  return prepend(state, {
    id: meta.id,
    title: recipient.trim(),
    category: 'transfer',
    amount: -amount,
    timestamp: meta.timestamp,
  });
}

export function topUp(state: TBankState, amount: number, source: string, meta: TTxMeta): TBankState {
  return prepend(state, {
    id: meta.id,
    title: source.trim(),
    category: 'income',
    amount,
    timestamp: meta.timestamp,
  });
}

export function toggleCardFrozen(state: TBankState): TBankState {
  return { ...state, account: { ...state.account, cardFrozen: !state.account.cardFrozen } };
}

export function activateInsurance(state: TBankState, meta: TTxMeta): TBankState {
  if (state.account.insured) return state;
  const charged = prepend(state, {
    id: meta.id,
    title: '',
    category: 'insurance',
    amount: -INSURANCE_PREMIUM,
    timestamp: meta.timestamp,
  });
  return { ...charged, account: { ...charged.account, insured: true } };
}

export function categoryTotals(transactions: readonly TTransaction[]): TCategoryTotal[] {
  const totals = new Map<TTransactionCategory, number>();
  for (const tx of transactions) {
    if (tx.amount >= 0) continue;
    totals.set(tx.category, (totals.get(tx.category) ?? 0) + Math.abs(tx.amount));
  }
  return [...totals.entries()].map(([category, total]) => ({ category, total })).sort((a, b) => b.total - a.total);
}
