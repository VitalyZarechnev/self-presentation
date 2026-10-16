import type { Metadata } from 'next';

import WorksView from '@views/works/WorksView';

export const metadata: Metadata = {
  title: 'Живые демо',
  description: 'Живые интерактивные виджеты на разных стеках.',
};

export default function WorksPage() {
  return <WorksView />;
}
