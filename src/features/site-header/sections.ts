export type TSectionMeta = {
  id: string;
  index: string;
  title: string;
  sub?: string;
};

export const sectionsMeta: readonly TSectionMeta[] = [
  { id: 'highlights', index: '01', title: 'В цифрах', sub: '8+ лет фронтенда · от разработчика до Head of Frontend' },
  {
    id: 'experience',
    index: '02',
    title: 'Опыт работы',
    sub: 'Финтех, блокчейн и NFT, IoT, бортовые системы, интерфейсы для AI-агентов',
  },
  { id: 'works', index: '03', title: 'Примеры работ', sub: 'Живые виджеты на разных стеках' },
  { id: 'skills', index: '04', title: 'Навыки', sub: 'Стек и зоны ответственности' },
  { id: 'education', index: '05', title: 'Образование' },
  { id: 'contacts', index: '06', title: 'Контакты', sub: 'Открыт к предложениям и интересным задачам' },
];
