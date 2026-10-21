import { TLocalized } from '@domain/locale/locale';

export type TWork = {
  id: string;
  name: string;
  tech: readonly string[];
  link?: string;
};

export const MARSHMALLOW_GAME_URL = 'https://vitalyzarechnev.github.io/marshmallow-game/';

export const INTERVIEW_PREP_URL = 'https://vitalyzarechnev.github.io/sobes/#/';

const worksRu: readonly TWork[] = [
  {
    id: 'geo-trips',
    name: 'География поездок',
    tech: ['Three.js', 'WebGL', 'React'],
  },
  {
    id: 'bank',
    name: 'Мобильный банк',
    tech: ['React', 'TypeScript', 'useReducer'],
  },
  {
    id: 'market',
    name: 'Лента сделок в реальном времени',
    tech: ['WebSocket', 'React', 'Canvas'],
  },
  {
    id: 'interview',
    name: 'Подготовка к собеседованию',
    tech: ['Frontend', 'SPA', 'iframe'],
    link: INTERVIEW_PREP_URL,
  },
  {
    id: 'marshmallow',
    name: 'Мини-игра «Зефирка»',
    tech: ['WebGL', '3D', 'iframe'],
    link: MARSHMALLOW_GAME_URL,
  },
];

const worksEn: readonly TWork[] = [
  { id: 'geo-trips', name: 'Travel geography', tech: ['Three.js', 'WebGL', 'React'] },
  { id: 'bank', name: 'Mobile bank', tech: ['React', 'TypeScript', 'useReducer'] },
  { id: 'market', name: 'Real-time trade feed', tech: ['WebSocket', 'React', 'Canvas'] },
  { id: 'interview', name: 'Interview prep', tech: ['Frontend', 'SPA', 'iframe'], link: INTERVIEW_PREP_URL },
  { id: 'marshmallow', name: 'Mini-game “Marshmallow”', tech: ['WebGL', '3D', 'iframe'], link: MARSHMALLOW_GAME_URL },
];

export const worksList: TLocalized<readonly TWork[]> = { ru: worksRu, en: worksEn };
