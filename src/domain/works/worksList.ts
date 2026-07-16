export type TWork = {
  id: string;
  name: string;
  tech: readonly string[];
};

export const worksList: readonly TWork[] = [
  {
    id: 'geo-trips',
    name: 'География поездок',
    tech: ['Three.js', 'WebGL', 'React'],
  },
  {
    id: 'market',
    name: 'Реалтайм binance',
    tech: ['WebSocket', 'React', 'Canvas'],
  },
  {
    id: 'bank',
    name: 'Мобильный банк',
    tech: ['React', 'TypeScript', 'State'],
  },
];
