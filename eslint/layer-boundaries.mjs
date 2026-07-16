/** @typedef {import('eslint').Linter.Config} ESLintConfig */

import * as tsResolver from 'eslint-import-resolver-typescript';

const DATA_LAYER = './src/data';
const DOMAIN_LAYER = './src/domain';
const APPLICATION_LAYER = './src/application';
const UTILS_LAYER = './src/utils';
const UI_LAYER = './src/ui';
const FEATURES_LAYER = './src/features';
const VIEWS_LAYER = './src/views';
const ERRORS_LAYER = './src/errors';
const APP_ROUTES = './app';

/** @type {import('eslint-plugin-import-x').Rules['no-restricted-paths'][1]['zones']} */
export const sharedLayerBoundaryZones = [
  {
    target: DOMAIN_LAYER,
    from: [DATA_LAYER, APPLICATION_LAYER, UI_LAYER, FEATURES_LAYER, VIEWS_LAYER],
    message: 'Domain must not import outer layers (@errors and @utils are allowed).',
  },
  {
    target: DATA_LAYER,
    from: [APPLICATION_LAYER, UI_LAYER, FEATURES_LAYER, VIEWS_LAYER],
    message: 'Data layer may only import Domain, Errors, Utils, and other Data modules.',
  },
  {
    target: UTILS_LAYER,
    from: [DOMAIN_LAYER, DATA_LAYER, APPLICATION_LAYER, UI_LAYER, FEATURES_LAYER, VIEWS_LAYER],
    message: 'Utils must not import any other layer (@errors is allowed).',
  },
  {
    target: UI_LAYER,
    from: [DATA_LAYER, APPLICATION_LAYER, FEATURES_LAYER, VIEWS_LAYER, ERRORS_LAYER],
    message: 'UI may only import Utils (and rarely Domain enums/models).',
  },
  {
    target: VIEWS_LAYER,
    from: [DATA_LAYER, DOMAIN_LAYER],
    message: 'Views must delegate Domain/Data access to Features.',
  },
  {
    target: APP_ROUTES,
    from: [FEATURES_LAYER],
    message: 'App routes must compose Views, not Features directly.',
  },
  {
    target: [DOMAIN_LAYER, UTILS_LAYER, UI_LAYER, VIEWS_LAYER, ERRORS_LAYER, APP_ROUTES],
    from: DATA_LAYER,
    message: 'Only Data and Application layers may import from @data.',
  },
  {
    target: APPLICATION_LAYER,
    from: [FEATURES_LAYER, VIEWS_LAYER],
    message: 'Application must not import Features or Views.',
  },
  {
    target: UI_LAYER,
    from: ERRORS_LAYER,
    message: 'Errors layer must not be imported by UI.',
  },
  {
    target: ERRORS_LAYER,
    from: [DOMAIN_LAYER, DATA_LAYER, APPLICATION_LAYER, UTILS_LAYER, UI_LAYER, FEATURES_LAYER, VIEWS_LAYER],
    message: 'Errors layer must not import from other layers.',
  },
];

/** @type {import('eslint-plugin-import-x').Rules['no-restricted-paths'][1]['zones']} */
const featureProductionZones = [
  {
    target: FEATURES_LAYER,
    from: [DATA_LAYER, VIEWS_LAYER],
    message: 'Features must not import Data or Views (use registry and use-cases instead).',
  },
];

/** @type {import('eslint-plugin-import-x').Rules['no-restricted-paths'][1]['zones']} */
const featureTestZones = [
  {
    target: FEATURES_LAYER,
    from: VIEWS_LAYER,
    message: 'Features must not import Views.',
  },
];

/** @type {ESLintConfig} */
export const layerBoundariesConfig = {
  settings: {
    'import-x/resolver': {
      name: 'tsResolver',
      resolver: tsResolver,
    },
  },
  rules: {
    'import-x/no-restricted-paths': [
      'error',
      {
        zones: [...sharedLayerBoundaryZones, ...featureProductionZones],
      },
    ],
  },
};

/** @type {ESLintConfig} */
export const featureTestBoundariesConfig = {
  files: ['src/features/**/*.{test,spec}.{ts,tsx}'],
  rules: {
    'import-x/no-restricted-paths': [
      'error',
      {
        zones: [...sharedLayerBoundaryZones, ...featureTestZones],
      },
    ],
  },
};

/** @type {ESLintConfig} */
export const reactQueryBoundariesConfig = {
  files: ['**/*.{ts,tsx}'],
  ignores: ['src/utils/**'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '@tanstack/react-query',
            importNames: ['useQuery', 'useMutation', 'useSuspenseQuery', 'useInfiniteQuery'],
            message: 'Use createDatasource / createUsecase from @utils instead of direct react-query hooks.',
          },
        ],
      },
    ],
  },
};
