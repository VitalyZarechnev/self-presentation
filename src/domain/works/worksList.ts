export type TWork = {
  id: string;
  name: string;
  tech: readonly string[];
  link?: string;
};

export const MARSHMALLOW_GAME_URL = 'https://vitalyzarechnev.github.io/marshmallow-game/';

export const INTERVIEW_PREP_URL = 'https://vitalyzarechnev.github.io/sobes/#/';

export const worksList: readonly TWork[] = [
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
    name: 'Реалтайм Binance',
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
