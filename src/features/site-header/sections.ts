export type TSectionMeta = {
  id: string;
  index: string;
  title: string;
  sub?: string;
};

export const sectionsMeta: readonly TSectionMeta[] = [
  { id: 'highlights', index: '01', title: 'В цифрах', sub: '8+ лет фронтенда · от разработчика до Head of Frontend' },
  { id: 'works', index: '02', title: 'Живые демо', sub: 'Работают прямо в браузере: их можно покрутить и понажать' },
  { id: 'site', index: '03', title: 'Как сделан сайт', sub: 'Сайт — тоже кейс: как он устроен и почему именно так' },
  {
    id: 'experience',
    index: '04',
    title: 'Опыт работы',
    sub: 'Финтех, блокчейн и NFT, IoT, бортовые системы, интерфейсы для AI-агентов',
  },
  { id: 'skills', index: '05', title: 'Навыки', sub: 'Стек и зоны ответственности' },
  { id: 'education', index: '06', title: 'Образование' },
  {
    id: 'contacts',
    index: '07',
    title: 'Контакты',
    sub: 'Ищу роль Senior Frontend в продукте, где важны архитектура и сложные интерфейсы. Отвечаю в Telegram в течение дня',
  },
];
