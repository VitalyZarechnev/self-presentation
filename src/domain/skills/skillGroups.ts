import { TSkillGroup } from './models/SkillGroup';

export const skillGroups: readonly TSkillGroup[] = [
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
