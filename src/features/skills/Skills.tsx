'use client';

import { useLocalized } from '@application/locale/LocaleProvider';

import { skillGroups } from '@domain/skills/skillGroups';

import TagGroups from '@ui/molecules/tag-groups/TagGroups';

export default function Skills() {
  return <TagGroups groups={useLocalized(skillGroups)} />;
}
