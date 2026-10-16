import { educationList } from '@domain/education/educationList';

import Timeline from '@ui/molecules/timeline/Timeline';

import { buildEducationTimeline } from './educationView';

const items = buildEducationTimeline(educationList);

export default function Education() {
  return <Timeline items={items} gutter={64} />;
}
