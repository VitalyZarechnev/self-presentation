import { TSiteAspect } from './models/SiteAspect';

export const SITE_SOURCE_URL = 'https://github.com/VitalyZarechnev/self-presentation';

export const siteAspectList: readonly TSiteAspect[] = [
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
    summary: 'Всё оформление — CSS-переменные; тема ставится до первой отрисовки.',
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
