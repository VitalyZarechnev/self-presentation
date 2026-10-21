import { StaticImageData } from 'next/image';

import bankPaper from '@assets/images/demos/bank-barely-there.webp';
import bankBlueprint from '@assets/images/demos/bank-blueprint.webp';
import globePaper from '@assets/images/demos/geo-trips-barely-there.webp';
import globeBlueprint from '@assets/images/demos/geo-trips-blueprint.webp';

import { TLocalized } from '@domain/locale/locale';
import { TLiveDemoId } from '@domain/works/liveDemos';

export type TDemoPreview = {
  blueprint: StaticImageData;
  paper: StaticImageData;
  alt: TLocalized<string>;
  focus: string;
  fit: 'cover' | 'contain';
};

export const DEMO_PREVIEWS: Partial<Record<TLiveDemoId, TDemoPreview>> = {
  'geo-trips': {
    blueprint: globeBlueprint,
    paper: globePaper,
    alt: {
      ru: 'Глобус с городами из поездок: Москва, Стамбул, Алматы, Пекин, Бангкок и маршрут самолёта',
      en: 'A globe with cities from my trips: Moscow, Istanbul, Almaty, Beijing, Bangkok, and a flight route',
    },
    focus: '50% 42%',
    fit: 'cover',
  },
  bank: {
    blueprint: bankBlueprint,
    paper: bankPaper,
    alt: {
      ru: 'Мобильный банк «Альбатрос»: баланс счёта, быстрые действия и последние операции',
      en: 'The “Albatros” mobile bank: account balance, quick actions and recent operations',
    },
    focus: '50% 8%',
    fit: 'cover',
  },
};
