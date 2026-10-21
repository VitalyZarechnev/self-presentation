import { TLocalized } from '@domain/locale/locale';

import { TSiteAspect } from './models/SiteAspect';

export const SITE_SOURCE_URL = 'https://github.com/VitalyZarechnev/self-presentation';

const aspectsRu: readonly TSiteAspect[] = [
  {
    id: 'architecture',
    title: 'Clean Architecture',
    summary: 'Восемь слоёв, зависимости только внутрь, к домену.',
    points: [
      'Domain → Data → Application, Utils, UI, Features, Views, Errors. Домен не импортирует ничего снаружи.',
      'Данные — через `createDatasource` и `createUsecase` поверх TanStack Query и DI-реестр, а не прямые запросы из компонентов.',
      'Границы слоёв проверяет ESLint (`import-x/no-restricted-paths`): импорт против направления — ошибка линтера.',
    ],
    code: {
      file: 'eslint/layer-boundaries.mjs',
      source: `{
  target: DOMAIN_LAYER,
  from: [DATA_LAYER, APPLICATION_LAYER, UI_LAYER, FEATURES_LAYER, VIEWS_LAYER],
  message: 'Domain must not import outer layers (@errors and @utils are allowed).',
},`,
    },
  },
  {
    id: 'themes',
    title: 'Две темы без мигания',
    summary: 'CSS-переменные и тема до первой отрисовки. Внутри — песочница: перекрасьте сайт сами.',
    points: [
      'Blueprint и Barely-There отличаются только значениями токенов на `[data-theme]`: компоненты не знают, какая тема включена.',
      'Маленький скрипт в `<head>` читает выбор из localStorage и ставит атрибут до первой отрисовки — без вспышки чужой темы.',
      'Песочница ниже собирает поверх текущей темы третью — «Свою»: оттенок фона и акцента, контраст текста держится не ниже 7:1 и 4.5:1. Таблица читает живые значения с `:root`.',
    ],
    code: {
      file: 'public/theme-init.js',
      source: `var stored = window.localStorage.getItem('ui-theme');
if (stored === 'blueprint' || stored === 'barely-there') {
  document.documentElement.dataset.theme = stored;
}`,
    },
  },
  {
    id: 'quality',
    title: 'Тесты, линт, деплой',
    summary: 'Тесты рядом с кодом, строгий линт, статический экспорт на GitHub Pages.',
    points: [
      'Vitest и Testing Library: тесты лежат рядом с кодом и ловят реальные баги — например, скачок цены в демо-потоке при переподписке.',
      'TypeScript в strict-режиме, ESLint с правилами React Compiler и границами слоёв, Prettier.',
      'GitHub Actions собирает статический экспорт Next.js и выкладывает его на GitHub Pages.',
    ],
    code: {
      file: 'src/data/market/datasources/MarketDatasourceImpl.test.ts',
      source: `test('continues from the last price after resubscribing instead of jumping', () => {
…
const last = first[first.length - 1].price;
const next = second[0].price;
expect(Math.abs(next / last - 1)).toBeLessThan(MAX_TICK_MOVE);`,
    },
  },
];

type TAspectCopy = Pick<TSiteAspect, 'title' | 'summary' | 'points'>;

// Code excerpts are quoted from the repository, so only the prose is translated.
const COPY_EN: Record<string, TAspectCopy> = {
  architecture: {
    title: 'Clean Architecture',
    summary: 'Eight layers, dependencies point inward only, toward the domain.',
    points: [
      'Domain → Data → Application, Utils, UI, Features, Views, Errors. The domain imports nothing from outside.',
      'Data flows through `createDatasource` and `createUsecase` on top of TanStack Query and a DI registry, never straight from components.',
      'ESLint guards the layer boundaries (`import-x/no-restricted-paths`): an import against the direction is a lint error.',
    ],
  },
  themes: {
    title: 'Two themes, no flash',
    summary: 'CSS variables, and the theme is set before first paint. Inside: a sandbox to recolour the site yourself.',
    points: [
      'Blueprint and Barely-There differ only in token values on `[data-theme]`: components never know which theme is on.',
      'A tiny script in `<head>` reads the choice from localStorage and sets the attribute before first paint, so the wrong theme never flashes.',
      'The sandbox below builds a third, “Custom” theme on top of the current one: background and accent hue, with text contrast held at 7:1 and 4.5:1 or better. The table reads live values from `:root`.',
    ],
  },
  quality: {
    title: 'Tests, lint, deploy',
    summary: 'Tests next to the code, strict lint, a static export to GitHub Pages.',
    points: [
      'Vitest and Testing Library: tests live next to the code and catch real bugs, such as the demo stream price jumping after a resubscribe.',
      'TypeScript in strict mode, ESLint with React Compiler rules and layer boundaries, Prettier.',
      'GitHub Actions builds the Next.js static export and publishes it to GitHub Pages.',
    ],
  },
};

const aspectsEn: readonly TSiteAspect[] = aspectsRu.map((aspect) => ({ ...aspect, ...COPY_EN[aspect.id] }));

export const siteAspectList: TLocalized<readonly TSiteAspect[]> = { ru: aspectsRu, en: aspectsEn };
