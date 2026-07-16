import { TBankState } from '@domain/bank/models/BankState';

const HOUR = 3600000;

export function createBankState(): TBankState {
  const BASE = Date.now();
  return {
    account: {
      bank: 'Альбатрос',
      holder: 'Виталий Заречнев',
      cardLast4: '4821',
      balance: 128400,
      cardFrozen: false,
      insured: false,
    },
    transactions: [
      { id: 'seed-1', title: 'Кофейня Cof&Go', category: 'cafe', amount: -320, timestamp: BASE - 2 * HOUR },
      { id: 'seed-2', title: 'Зарплата', category: 'income', amount: 40000, timestamp: BASE - 20 * HOUR },
      { id: 'seed-3', title: 'Явнекс No', category: 'transport', amount: -540, timestamp: BASE - 26 * HOUR },
      { id: 'seed-4', title: 'Ozom', category: 'shopping', amount: -2190, timestamp: BASE - 30 * HOUR },
      { id: 'seed-5', title: 'ЖКХ · квартплата', category: 'utilities', amount: -3200, timestamp: BASE - 50 * HOUR },
      { id: 'seed-6', title: 'Шестёрочка', category: 'shopping', amount: -1340, timestamp: BASE - 54 * HOUR },
      { id: 'seed-7', title: 'Кафе Пушкинъ', category: 'cafe', amount: -2600, timestamp: BASE - 72 * HOUR },
      { id: 'seed-8', title: 'Метро', category: 'transport', amount: -600, timestamp: BASE - 76 * HOUR },
    ],
  };
}
