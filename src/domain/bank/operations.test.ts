import { describe, expect, it } from 'vitest';

import { TBankState } from './models/BankState';
import { activateInsurance, categoryTotals, INSURANCE_PREMIUM, toggleCardFrozen, topUp, transfer, validateTransfer } from './operations';

function state(balance = 10000): TBankState {
  return {
    account: { bank: 'Альбатрос', holder: 'Тест', cardLast4: '0000', balance, cardFrozen: false, insured: false },
    transactions: [],
  };
}

const meta = { id: 'tx-1', timestamp: 1000 };

describe('validateTransfer', () => {
  it('rejects empty recipient, non-positive and over-balance amounts', () => {
    expect(validateTransfer(state(), '', 100)).toBe('Укажите получателя');
    expect(validateTransfer(state(), 'Иван', 0)).toBe('Введите сумму больше нуля');
    expect(validateTransfer(state(1000), 'Иван', 5000)).toBe('Недостаточно средств');
  });

  it('accepts a valid transfer', () => {
    expect(validateTransfer(state(1000), 'Иван', 500)).toBeNull();
  });
});

describe('transfer / topUp', () => {
  it('transfer debits the balance and prepends a transaction', () => {
    const next = transfer(state(1000), 'Иван', 300, meta);
    expect(next.account.balance).toBe(700);
    expect(next.transactions[0]).toMatchObject({ id: 'tx-1', category: 'transfer', amount: -300 });
    expect(next.transactions[0].title).toContain('Иван');
  });

  it('topUp credits the balance', () => {
    const next = topUp(state(1000), 2000, 'Зарплата', meta);
    expect(next.account.balance).toBe(3000);
    expect(next.transactions[0]).toMatchObject({ category: 'income', amount: 2000, title: 'Зарплата' });
  });

  it('does not mutate the input state', () => {
    const base = state(1000);
    transfer(base, 'Иван', 300, meta);
    expect(base.account.balance).toBe(1000);
    expect(base.transactions).toHaveLength(0);
  });
});

describe('toggleCardFrozen', () => {
  it('flips the frozen flag', () => {
    expect(toggleCardFrozen(state()).account.cardFrozen).toBe(true);
    expect(toggleCardFrozen(toggleCardFrozen(state())).account.cardFrozen).toBe(false);
  });
});

describe('activateInsurance', () => {
  it('charges the premium and sets insured once', () => {
    const next = activateInsurance(state(1000), meta);
    expect(next.account.insured).toBe(true);
    expect(next.account.balance).toBe(1000 - INSURANCE_PREMIUM);
    expect(next.transactions[0]).toMatchObject({ category: 'insurance', amount: -INSURANCE_PREMIUM });
  });

  it('is a no-op when already insured', () => {
    const once = activateInsurance(state(1000), meta);
    const twice = activateInsurance(once, { id: 'tx-2', timestamp: 2000 });
    expect(twice).toBe(once);
  });
});

describe('categoryTotals', () => {
  it('sums spend per category, excludes income, sorts desc', () => {
    const s: TBankState = {
      ...state(),
      transactions: [
        { id: '1', title: 'a', category: 'cafe', amount: -300, timestamp: 1 },
        { id: '2', title: 'b', category: 'cafe', amount: -200, timestamp: 2 },
        { id: '3', title: 'c', category: 'transport', amount: -900, timestamp: 3 },
        { id: '4', title: 'd', category: 'income', amount: 5000, timestamp: 4 },
      ],
    };
    expect(categoryTotals(s.transactions)).toEqual([
      { category: 'transport', total: 900 },
      { category: 'cafe', total: 500 },
    ]);
  });
});
