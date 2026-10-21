import { TLocalized } from '@domain/locale/locale';

import { TSkillGroup } from './models/SkillGroup';

const skillGroupsRu: readonly TSkillGroup[] = [
  {
    id: 'languages',
    title: 'Языки и фреймворки',
    items: ['TypeScript', 'JavaScript', 'React', 'Next.js', 'Node.js', 'Vue.js'],
  },
  {
    id: 'state',
    title: 'Состояние и данные',
    items: ['TanStack Query', 'MobX', 'Zod', 'WebSocket', 'SSE', 'GraphQL', 'Redux', 'Redux-Saga', 'Pinia'],
  },
  {
    id: 'ui',
    title: 'UI и стилизация',
    items: ['SCSS Modules', 'Radix UI', 'Tailwind', 'MUI', 'Ant Design', 'Chakra UI', 'Stylus', 'БЭМ'],
  },
  {
    id: 'graphics',
    title: '3D и графика',
    items: ['Three.js', 'Cesium', 'Pixi.js'],
  },
  {
    id: 'tooling',
    title: 'Инструменты и качество',
    items: [
      'Clean Architecture',
      'Vitest',
      'Testing Library',
      'React Compiler',
      'ESLint',
      'GitHub Actions',
      'SSR',
      'Git',
      'Кроссбраузерная вёрстка',
      'Webpack',
      'Single-SPA',
      'Jest',
      'Enzyme',
    ],
  },
  {
    id: 'management',
    title: 'Управление',
    items: ['Найм', 'Онбординг', 'Код-ревью', 'Планирование и оценка', 'Развитие команды'],
  },
];

const TITLES_EN: Record<string, string> = {
  languages: 'Languages and frameworks',
  state: 'State and data',
  ui: 'UI and styling',
  graphics: '3D and graphics',
  tooling: 'Tooling and quality',
  management: 'Management',
};

const ITEMS_EN: Record<string, string> = {
  БЭМ: 'BEM',
  'Кроссбраузерная вёрстка': 'Cross-browser layout',
  Найм: 'Hiring',
  Онбординг: 'Onboarding',
  'Код-ревью': 'Code review',
  'Планирование и оценка': 'Planning and estimation',
  'Развитие команды': 'Growing the team',
};

const skillGroupsEn: readonly TSkillGroup[] = skillGroupsRu.map((group) => ({
  ...group,
  title: TITLES_EN[group.id] ?? group.title,
  items: group.items.map((item) => ITEMS_EN[item] ?? item),
}));

export const skillGroups: TLocalized<readonly TSkillGroup[]> = { ru: skillGroupsRu, en: skillGroupsEn };
