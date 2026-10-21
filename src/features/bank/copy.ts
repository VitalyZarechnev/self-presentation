import { useLocale } from '@application/locale/LocaleProvider';

import { TTransaction, TTransactionCategory } from '@domain/bank/models/Transaction';
import { TBankError } from '@domain/bank/operations';
import { TLocale, TLocalized } from '@domain/locale/locale';

import { TScreen } from './types';

type TBankCopy = {
  intl: string;
  tabs: Record<Extract<TScreen, 'home' | 'analytics' | 'card' | 'insurance'>, string>;
  categories: Record<TTransactionCategory, string>;
  errors: Record<TBankError, string>;
  names: Record<string, string>;
  seeds: Record<string, string>;
  back: string;
  done: string;
  today: string;
  yesterday: string;
  home: {
    greeting: string;
    account: string;
    hide: string;
    show: string;
    insured: string;
    personal: string;
    transfer: string;
    topUp: string;
    analytics: string;
    card: string;
    insurance: string;
    insuranceActive: string;
    insuranceSub: string;
    recent: string;
    all: string;
  };
  transfer: {
    title: string;
    sent: string;
    recipient: string;
    recipientPlaceholder: string;
    amount: string;
    available: string;
    submit: string;
  };
  topUp: {
    title: string;
    done: string;
    amount: string;
    source: string;
    submit: string;
    sources: Record<'card' | 'sbp' | 'account', { label: string; field: string }>;
    detailErrors: Record<'card' | 'sbp' | 'account', string>;
  };
  analytics: { title: string; byCategory: string; total: string; all: string };
  card: { title: string; frozen: string; freeze: string; online: string };
  insurance: {
    title: string;
    heroTitle: string;
    text: string;
    perYear: string;
    active: string;
    buy: string;
    others: string;
    travel: string;
    cardCover: string;
    soon: string;
  };
  sheet: {
    operation: string;
    receiptKind: string;
    operationLabel: string;
    category: string;
    date: string;
    dateTime: string;
    credit: string;
    debit: string;
    receiptNo: string;
    status: string;
    completed: string;
    thanks: string;
    showReceipt: string;
  };
};

export const BANK_COPY: TLocalized<TBankCopy> = {
  ru: {
    intl: 'ru-RU',
    tabs: { home: 'Главный', analytics: 'Аналитика', card: 'Карта', insurance: 'Страховка' },
    categories: {
      income: 'Пополнение',
      transfer: 'Перевод',
      cafe: 'Кафе и рестораны',
      transport: 'Транспорт',
      shopping: 'Покупки',
      utilities: 'Дом и ЖКХ',
      insurance: 'Страхование',
    },
    errors: { amount: 'Введите сумму больше нуля', funds: 'Недостаточно средств', recipient: 'Укажите получателя' },
    names: {},
    seeds: {},
    back: 'Назад',
    done: 'Готово',
    today: 'Сегодня',
    yesterday: 'Вчера',
    home: {
      greeting: 'Добрый день',
      account: 'счёт',
      hide: 'Скрыть баланс',
      show: 'Показать баланс',
      insured: 'Карта застрахована',
      personal: 'Личный счёт',
      transfer: 'Перевод',
      topUp: 'Пополнить',
      analytics: 'Аналитика',
      card: 'Карта',
      insurance: 'Страхование',
      insuranceActive: 'Активна',
      insuranceSub: 'Защита жизни и здоровья',
      recent: 'Последние операции',
      all: 'Все',
    },
    transfer: {
      title: 'Перевод',
      sent: 'Перевод отправлен',
      recipient: 'Получатель',
      recipientPlaceholder: 'Имя или телефон',
      amount: 'Сумма',
      available: 'Доступно',
      submit: 'Перевести',
    },
    topUp: {
      title: 'Пополнение',
      done: 'Счёт пополнен',
      amount: 'Сумма',
      source: 'Источник',
      submit: 'Пополнить',
      sources: {
        card: { label: 'Другая карта', field: 'Номер карты' },
        sbp: { label: 'СБП', field: 'Телефон' },
        account: { label: 'Другой счёт', field: 'Номер счёта' },
      },
      detailErrors: { card: 'Введите 16 цифр карты', sbp: 'Введите номер телефона', account: 'Введите номер счёта' },
    },
    analytics: { title: 'Аналитика', byCategory: 'Траты по категориям', total: 'всего', all: 'Все операции' },
    card: { title: 'Карта', frozen: 'заморожена', freeze: 'Заморозить карту', online: 'Оплата в интернете' },
    insurance: {
      title: 'Страхование',
      heroTitle: 'Страхование здоровья',
      text: 'Делаете взнос и Вы уже клиент страховой фирмы Альбатрос.\nДвадцать тысяч в год — полный комплект в пакете: Травмы, болезни и даже смерть',
      perYear: 'в год',
      active: 'Подключено',
      buy: 'Оформить в один клик',
      others: 'Другие продукты',
      travel: 'Страхование путешествий',
      cardCover: 'Страхование карты',
      soon: 'скоро',
    },
    sheet: {
      operation: 'Операция',
      receiptKind: 'Электронный чек',
      operationLabel: 'Операция',
      category: 'Категория',
      date: 'Дата',
      dateTime: 'Дата и время',
      credit: 'Зачисление на счёт',
      debit: 'Списание со счёта',
      receiptNo: 'Чек №',
      status: 'Статус',
      completed: 'Выполнено',
      thanks: 'Спасибо, что с нами',
      showReceipt: 'Посмотреть чек',
    },
  },
  en: {
    intl: 'en-GB',
    tabs: { home: 'Home', analytics: 'Analytics', card: 'Card', insurance: 'Insurance' },
    categories: {
      income: 'Top-up',
      transfer: 'Transfer',
      cafe: 'Cafés and restaurants',
      transport: 'Transport',
      shopping: 'Shopping',
      utilities: 'Home and utilities',
      insurance: 'Insurance',
    },
    errors: { amount: 'Enter an amount above zero', funds: 'Insufficient funds', recipient: 'Enter a recipient' },
    names: { Альбатрос: 'Albatros', 'Виталий Заречнев': 'Vitaly Zarechnev' },
    seeds: {
      'seed-1': 'Cof&Go coffee shop',
      'seed-2': 'Salary',
      'seed-3': 'Yavnex No',
      'seed-4': 'Ozom',
      'seed-5': 'Utilities · rent',
      'seed-6': 'Shestyorochka',
      'seed-7': 'Café Pushkin',
      'seed-8': 'Metro',
    },
    back: 'Back',
    done: 'Done',
    today: 'Today',
    yesterday: 'Yesterday',
    home: {
      greeting: 'Good afternoon',
      account: 'account',
      hide: 'Hide balance',
      show: 'Show balance',
      insured: 'Card insured',
      personal: 'Personal account',
      transfer: 'Transfer',
      topUp: 'Top up',
      analytics: 'Analytics',
      card: 'Card',
      insurance: 'Insurance',
      insuranceActive: 'Active',
      insuranceSub: 'Life and health cover',
      recent: 'Recent operations',
      all: 'All',
    },
    transfer: {
      title: 'Transfer',
      sent: 'Transfer sent',
      recipient: 'Recipient',
      recipientPlaceholder: 'Name or phone',
      amount: 'Amount',
      available: 'Available',
      submit: 'Send',
    },
    topUp: {
      title: 'Top-up',
      done: 'Account topped up',
      amount: 'Amount',
      source: 'Source',
      submit: 'Top up',
      sources: {
        card: { label: 'Another card', field: 'Card number' },
        sbp: { label: 'SBP', field: 'Phone' },
        account: { label: 'Another account', field: 'Account number' },
      },
      detailErrors: { card: 'Enter the 16 card digits', sbp: 'Enter a phone number', account: 'Enter an account number' },
    },
    analytics: { title: 'Analytics', byCategory: 'Spending by category', total: 'total', all: 'All operations' },
    card: { title: 'Card', frozen: 'frozen', freeze: 'Freeze card', online: 'Online payments' },
    insurance: {
      title: 'Insurance',
      heroTitle: 'Health insurance',
      text: 'Pay the premium and you are already a client of Albatros insurance.\nTwenty thousand a year — the full package: injuries, illness and even death',
      perYear: 'a year',
      active: 'Active',
      buy: 'Get it in one tap',
      others: 'Other products',
      travel: 'Travel insurance',
      cardCover: 'Card insurance',
      soon: 'soon',
    },
    sheet: {
      operation: 'Operation',
      receiptKind: 'E-receipt',
      operationLabel: 'Operation',
      category: 'Category',
      date: 'Date',
      dateTime: 'Date and time',
      credit: 'Credited to account',
      debit: 'Debited from account',
      receiptNo: 'Receipt no.',
      status: 'Status',
      completed: 'Completed',
      thanks: 'Thank you for banking with us',
      showReceipt: 'View receipt',
    },
  },
};

export function useBankCopy(): TBankCopy & { locale: TLocale } {
  const { locale } = useLocale();
  return { ...BANK_COPY[locale], locale };
}

export const displayName = (copy: TBankCopy, name: string): string => copy.names[name] ?? name;

export function txTitle(copy: TBankCopy, tx: TTransaction): string {
  if (tx.category === 'transfer') return `${copy.categories.transfer} · ${tx.title}`;
  return copy.seeds[tx.id] ?? (tx.title || copy.categories[tx.category]);
}
