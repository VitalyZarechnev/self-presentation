import Tag from '@ui/atoms/tag/Tag';
import Label from '@ui/atoms/typography/Label';

import classes from './TagGroups.module.scss';

export type TTagGroup = {
  id: string;
  title: string;
  items: readonly string[];
};

type TProps = {
  groups: readonly TTagGroup[];
};

export default function TagGroups({ groups }: TProps) {
  return (
    <div className={classes.tag_groups}>
      {groups.map((group) => (
        <div key={group.id} className={classes.tag_groups__group}>
          <Label variant='eyebrow' className={classes.tag_groups__title}>
            {group.title}
          </Label>
          <div className={classes.tag_groups__items}>
            {group.items.map((item) => (
              <Tag key={item}>{item}</Tag>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
