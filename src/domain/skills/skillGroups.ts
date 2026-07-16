import { TSkillGroup } from './models/SkillGroup';

export const skillGroups: readonly TSkillGroup[] = [
  {
    id: 'languages',
    title: 'Языки и фреймворки',
    items: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue.js', 'Node.js'],
  },
  {
    id: 'state',
    title: 'Состояние и данные',
    items: ['Redux', 'Redux-Saga', 'MobX', 'Pinia', 'GraphQL', 'WebSocket', 'SSE'],
  },
  {
    id: 'ui',
    title: 'UI и стилизация',
    items: ['SCSS', 'Stylus', 'Tailwind', 'MUI', 'Ant Design', 'Chakra UI', 'Radix UI', 'БЭМ'],
  },
  {
    id: 'graphics',
    title: '3D и графика',
    items: ['Three.js', 'Cesium', 'Pixi.js'],
  },
  {
    id: 'tooling',
    title: 'Инструменты и качество',
    items: ['Webpack', 'Single-SPA', 'Git', 'Jest', 'Enzyme', 'SSR', 'Кроссбраузерная вёрстка'],
  },
  {
    id: 'management',
    title: 'Управление',
    items: ['Найм', 'Онбординг', 'Код-ревью', 'Планирование и оценка', 'Развитие команды'],
  },
];
