import { TLocalized } from '@domain/locale/locale';

export type TSectionMeta = {
  id: string;
  index: string;
  title: string;
  sub?: string;
};

const sectionsRu: readonly TSectionMeta[] = [
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

const sectionsEn: readonly TSectionMeta[] = [
  { id: 'highlights', index: '01', title: 'In numbers', sub: '8+ years in frontend · from developer to Head of Frontend' },
  { id: 'works', index: '02', title: 'Live demos', sub: 'They run right in the browser: spin them, click around' },
  { id: 'site', index: '03', title: 'How this site is built', sub: 'The site is a case study too: how it works and why' },
  {
    id: 'experience',
    index: '04',
    title: 'Experience',
    sub: 'Fintech, blockchain and NFT, IoT, avionics, interfaces for AI agents',
  },
  { id: 'skills', index: '05', title: 'Skills', sub: 'Stack and areas of ownership' },
  { id: 'education', index: '06', title: 'Education' },
  {
    id: 'contacts',
    index: '07',
    title: 'Contact',
    sub: 'Looking for a Senior Frontend role in a product where architecture and complex interfaces matter. I reply on Telegram within a day',
  },
];

export const sectionsMeta: TLocalized<readonly TSectionMeta[]> = { ru: sectionsRu, en: sectionsEn };
