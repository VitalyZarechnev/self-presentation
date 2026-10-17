import { TWork, worksList } from './worksList';

export type TLiveDemoId = 'geo-trips' | 'market' | 'bank' | 'tic-tac-toe';

export type TLiveDemo = {
  id: TLiveDemoId;
  name: string;
  proves: string;
  tech: readonly string[];
  href: string | null;
};

const PUBLISHED_PROOFS: ReadonlyArray<readonly [TLiveDemoId, string]> = [
  [
    'geo-trips',
    'Вращаемая 3D-сцена на three.js с маршрутами поездок: drag, зум, клик по городу. Грузится лениво и не тянет WebGL в первый экран.',
  ],
  [
    'market',
    'Поток сделок по WebSocket: окно истории фиксированной длины, спарклайн на canvas, лента в стабильных слотах без сдвигов страницы и демо-режим без сети.',
  ],
  ['bank', 'Мок мобильного банка: шесть экранов и чек по операции на одном редьюсере состояний.'],
];

const GAME_DEMO: TLiveDemo = {
  id: 'tic-tac-toe',
  name: 'Крестики-нолики',
  proves: 'ИИ трёх уровней — от случайного хода до минимакса, который не проигрывает. Доски выравниваются по клетке фона.',
  tech: ['TypeScript', 'Minimax', 'React'],
  href: null,
};

function toLiveDemo(id: TLiveDemoId, proves: string): TLiveDemo {
  const work = worksList.find((item) => item.id === id);
  if (!work) throw new Error(`Live demo "${id}" is missing from worksList`);
  return { id, name: work.name, proves, tech: work.tech, href: `/works#${id}` };
}

export const liveDemos: readonly TLiveDemo[] = [...PUBLISHED_PROOFS.map(([id, proves]) => toLiveDemo(id, proves)), GAME_DEMO];

export const liveDemoExtras: readonly TWork[] = worksList.filter((work) => work.link !== undefined);
