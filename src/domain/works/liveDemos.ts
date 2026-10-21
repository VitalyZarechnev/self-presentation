import { LOCALES, TLocale, TLocalized } from '@domain/locale/locale';

import { TWork, worksList } from './worksList';

export type TLiveDemoId = 'geo-trips' | 'market' | 'bank' | 'tic-tac-toe';

export type TLiveDemo = {
  id: TLiveDemoId;
  name: string;
  proves: string;
  tech: readonly string[];
  href: string | null;
};

type TPublishedId = Exclude<TLiveDemoId, 'tic-tac-toe'>;

const PUBLISHED_IDS: readonly TPublishedId[] = ['geo-trips', 'market', 'bank'];

const PROOFS: TLocalized<Record<TPublishedId, string>> = {
  ru: {
    'geo-trips':
      'Вращаемая 3D-сцена на three.js с маршрутами поездок: drag, зум, клик по городу. Грузится лениво и не тянет WebGL в первый экран.',
    market:
      'Поток сделок по WebSocket: окно истории фиксированной длины, спарклайн на canvas, лента в стабильных слотах без сдвигов страницы и демо-режим без сети.',
    bank: 'Мок мобильного банка: шесть экранов и чек по операции на одном редьюсере состояний.',
  },
  en: {
    'geo-trips':
      'A rotatable three.js scene with travel routes: drag, zoom, click a city. Loaded lazily, so WebGL never weighs on the first screen.',
    market:
      'A WebSocket trade stream: fixed-length history window, canvas sparkline, a feed in stable slots with no layout shift, and an offline demo mode.',
    bank: 'A mobile bank mock: six screens and an operation receipt driven by a single state reducer.',
  },
};

const GAME_DEMO: TLocalized<TLiveDemo> = {
  ru: {
    id: 'tic-tac-toe',
    name: 'Крестики-нолики',
    proves: 'ИИ трёх уровней — от случайного хода до минимакса, который не проигрывает. Доски выравниваются по клетке фона.',
    tech: ['TypeScript', 'Minimax', 'React'],
    href: null,
  },
  en: {
    id: 'tic-tac-toe',
    name: 'Tic-tac-toe',
    proves: 'Three AI levels, from a random move to a minimax that never loses. Boards snap to the background grid.',
    tech: ['TypeScript', 'Minimax', 'React'],
    href: null,
  },
};

function demosFor(locale: TLocale): readonly TLiveDemo[] {
  const published = PUBLISHED_IDS.map((id) => {
    const work = worksList[locale].find((item) => item.id === id);
    if (!work) throw new Error(`Live demo "${id}" is missing from worksList`);
    return { id, name: work.name, proves: PROOFS[locale][id], tech: work.tech, href: `/works#${id}` };
  });
  return [...published, GAME_DEMO[locale]];
}

const byLocale = <T>(build: (locale: TLocale) => T): TLocalized<T> =>
  Object.fromEntries(LOCALES.map((locale) => [locale, build(locale)])) as TLocalized<T>;

export const liveDemos: TLocalized<readonly TLiveDemo[]> = byLocale(demosFor);

export const liveDemoExtras: TLocalized<readonly TWork[]> = byLocale((locale) =>
  worksList[locale].filter((work) => work.link !== undefined),
);
