import { createBankState } from '@data/bank/mock-factories/bankState';

import { BANK_COPY, txTitle } from './copy';

const CYRILLIC = /[а-яё]/i;

const keysOf = (value: unknown, prefix = ''): string[] =>
  value && typeof value === 'object'
    ? Object.entries(value).flatMap(([key, child]) => [`${prefix}${key}`, ...keysOf(child, `${prefix}${key}.`)])
    : [];

const stringsOf = (value: unknown): string[] =>
  typeof value === 'string' ? [value] : value && typeof value === 'object' ? Object.values(value).flatMap(stringsOf) : [];

describe('BANK_COPY', () => {
  const { names, seeds, ...en } = BANK_COPY.en;
  const { names: _ruNames, seeds: _ruSeeds, ...ru } = BANK_COPY.ru;

  test('both languages define the same messages', () => {
    expect(keysOf(en).sort()).toEqual(keysOf(ru).sort());
  });

  test('the English messages contain no Russian', () => {
    stringsOf(en).forEach((text) => expect(text).not.toMatch(CYRILLIC));
    Object.values(names).forEach((text) => expect(text).not.toMatch(CYRILLIC));
  });

  test('every seeded operation and account name has an English title', () => {
    const state = createBankState();
    state.transactions.forEach((tx) => expect(txTitle(BANK_COPY.en, tx)).not.toMatch(CYRILLIC));
    expect(Object.keys(seeds)).toHaveLength(state.transactions.length);
    expect(names[state.account.bank]).toBeDefined();
    expect(names[state.account.holder]).toBeDefined();
  });

  test('titles the app writes itself follow the language', () => {
    const transfer = { id: 'tx', title: 'Иван', category: 'transfer' as const, amount: -100, timestamp: 0 };
    const insurance = { id: 'tx2', title: '', category: 'insurance' as const, amount: -100, timestamp: 0 };
    expect(txTitle(BANK_COPY.en, transfer)).toBe('Transfer · Иван');
    expect(txTitle(BANK_COPY.ru, insurance)).toBe('Страхование');
    expect(txTitle(BANK_COPY.en, insurance)).toBe('Insurance');
  });
});
