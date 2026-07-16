import { educationList } from '@domain/education/educationList';

import Timeline, { TTimelineItem } from '@ui/molecules/timeline/Timeline';

const items: TTimelineItem[] = [...educationList]
  .sort((a, b) => b.year - a.year)
  .map((entry) => ({
    id: entry.id,
    date: String(entry.year),
    title: entry.qualification,
    subtitle: entry.field ? `${entry.institution} · ${entry.field}` : entry.institution,
  }));

export default function Education() {
  return <Timeline items={items} gutter={64} />;
}
