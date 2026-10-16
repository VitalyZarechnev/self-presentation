import { TEducation } from '@domain/education/models/Education';

import { TTimelineItem } from '@ui/molecules/timeline/Timeline';

const KIND_ORDER: Record<TEducation['kind'], number> = { degree: 0, course: 1 };

export function buildEducationTimeline(entries: readonly TEducation[]): TTimelineItem[] {
  return [...entries]
    .sort((a, b) => KIND_ORDER[a.kind] - KIND_ORDER[b.kind] || b.year - a.year)
    .map((entry) => ({
      id: entry.id,
      date: String(entry.year),
      title: entry.qualification,
      subtitle: entry.field ? `${entry.institution} · ${entry.field}` : entry.institution,
    }));
}
