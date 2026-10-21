import { TLocalized } from '@domain/locale/locale';

import { THighlight } from './models/Highlight';

export const highlightsList: TLocalized<readonly THighlight[]> = {
  ru: [
    { id: 'years', value: '8+', label: 'лет в коммерческой разработке' },
    { id: 'lead', value: '4+', label: 'года руковожу командой' },
    { id: 'team', value: '10+', label: 'человек в команде в пике' },
    { id: 'projects', value: '25+', label: 'проектов выведено в продакшн' },
  ],
  en: [
    { id: 'years', value: '8+', label: 'years in commercial development' },
    { id: 'lead', value: '4+', label: 'years leading a team' },
    { id: 'team', value: '10+', label: 'people on the team at its peak' },
    { id: 'projects', value: '25+', label: 'projects shipped to production' },
  ],
};
