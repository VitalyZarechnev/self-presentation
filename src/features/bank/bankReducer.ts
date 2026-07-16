import { TBankState } from '@domain/bank/models/BankState';
import { activateInsurance, toggleCardFrozen, topUp, transfer, TTxMeta } from '@domain/bank/operations';

export type TBankAction =
  | { type: 'transfer'; recipient: string; amount: number; meta: TTxMeta }
  | { type: 'topup'; amount: number; source: string; meta: TTxMeta }
  | { type: 'toggleFreeze' }
  | { type: 'insure'; meta: TTxMeta };

export function bankReducer(state: TBankState, action: TBankAction): TBankState {
  switch (action.type) {
    case 'transfer':
      return transfer(state, action.recipient, action.amount, action.meta);
    case 'topup':
      return topUp(state, action.amount, action.source, action.meta);
    case 'toggleFreeze':
      return toggleCardFrozen(state);
    case 'insure':
      return activateInsurance(state, action.meta);
    default:
      return state;
  }
}

export function txMeta(): TTxMeta {
  return { id: crypto.randomUUID(), timestamp: Date.now() };
}
