import { StaticImageData } from 'next/image';

import bankPaper from '@assets/images/demos/bank-barely-there.webp';
import bankBlueprint from '@assets/images/demos/bank-blueprint.webp';
import globePaper from '@assets/images/demos/geo-trips-barely-there.webp';
import globeBlueprint from '@assets/images/demos/geo-trips-blueprint.webp';
import marketPaper from '@assets/images/demos/market-barely-there.webp';
import marketBlueprint from '@assets/images/demos/market-blueprint.webp';

import { TLiveDemoId } from '@domain/works/liveDemos';

export type TDemoPreview = {
  blueprint: StaticImageData;
  paper: StaticImageData;
  alt: string;
  focus: string;
  fit: 'cover' | 'contain';
};

export const DEMO_PREVIEWS: Partial<Record<TLiveDemoId, TDemoPreview>> = {
  'geo-trips': {
    blueprint: globeBlueprint,
    paper: globePaper,
    alt: 'Глобус с городами из поездок: Москва, Стамбул, Алматы, Пекин, Бангкок и маршрут самолёта',
    focus: '50% 42%',
    fit: 'cover',
  },
  market: {
    blueprint: marketBlueprint,
    paper: marketPaper,
    alt: 'Виджет рынка BTC/USDT: цена, спарклайн и лента последних сделок',
    focus: '50% 50%',
    fit: 'contain',
  },
  bank: {
    blueprint: bankBlueprint,
    paper: bankPaper,
    alt: 'Мобильный банк «Альбатрос»: баланс счёта, быстрые действия и последние операции',
    focus: '50% 8%',
    fit: 'cover',
  },
};
