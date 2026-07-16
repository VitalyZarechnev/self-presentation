import { ComponentType, SVGProps } from 'react';

import { TTransactionCategory } from '@domain/bank/models/Transaction';

import ArrowDownLeft from '@ui/icons/arrow-down-left.svg';
import ArrowUpRight from '@ui/icons/arrow-up-right.svg';
import Bolt from '@ui/icons/bolt.svg';
import Car from '@ui/icons/car.svg';
import Coffee from '@ui/icons/coffee.svg';
import Shield from '@ui/icons/shield.svg';
import ShoppingBag from '@ui/icons/shopping-bag.svg';

type TCategoryMeta = {
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  color: string;
  bg: string;
};

export const CATEGORY_META: Record<TTransactionCategory, TCategoryMeta> = {
  income: { label: 'Пополнение', Icon: ArrowDownLeft, color: '#16a34a', bg: '#e6f4ea' },
  transfer: { label: 'Перевод', Icon: ArrowUpRight, color: '#4f46e5', bg: '#eae9fb' },
  cafe: { label: 'Кафе и рестораны', Icon: Coffee, color: '#ea580c', bg: '#fce8dd' },
  transport: { label: 'Транспорт', Icon: Car, color: '#0284c7', bg: '#e0f0fa' },
  shopping: { label: 'Покупки', Icon: ShoppingBag, color: '#db2777', bg: '#fbe4ef' },
  utilities: { label: 'Дом и ЖКХ', Icon: Bolt, color: '#ca8a04', bg: '#f7efd6' },
  insurance: { label: 'Страхование', Icon: Shield, color: '#0d9488', bg: '#ddf2ef' },
};
