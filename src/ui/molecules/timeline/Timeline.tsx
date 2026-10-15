'use client';

import { CSSProperties, useState } from 'react';
import clsx from 'clsx';

import Tag from '@ui/atoms/tag/Tag';
import Label from '@ui/atoms/typography/Label';
import Text from '@ui/atoms/typography/Text';
import ChevronDownIcon from '@ui/icons/chevron-down.svg';
import ProjectList, { TProjectView } from '@ui/molecules/project-list/ProjectList';

import classes from './Timeline.module.scss';

export type TTimelineItem = {
  id: string;
  date: string;
  title: string;
  subtitle?: string;
  tags?: readonly string[];
  details?: readonly string[];
  projects?: readonly TProjectView[];
};

type TProps = {
  items: readonly TTimelineItem[];
  gutter?: number;
};

export default function Timeline({ items, gutter }: TProps) {
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(() => new Set());

  const style = gutter ? ({ '--tl-gutter': `${gutter}px` } as CSSProperties) : undefined;

  const toggle = (id: string): void => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const renderBody = (item: TTimelineItem, open: boolean, expandable: boolean) => (
    <>
      <div className={classes.timeline__heading}>
        <Text variant='companyMd' className={classes.timeline__company}>
          {item.title}
        </Text>
        {expandable && <ChevronDownIcon className={clsx(classes.timeline__chevron, open && classes.timeline__chevron_open)} />}
      </div>
      {item.subtitle && (
        <Text as='div' variant='roleMd' className={classes.timeline__role}>
          {item.subtitle}
        </Text>
      )}
      {item.tags && item.tags.length > 0 && (
        <div className={classes.timeline__tags}>
          {item.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      )}
    </>
  );

  return (
    <div className={classes.timeline} style={style}>
      <div className={classes.timeline__scroll}>
        <ol className={classes.timeline__list}>
          <span className={classes.timeline__line} aria-hidden />

          {items.map((item) => {
            const hasDetails = !!item.details && item.details.length > 0;
            const hasProjects = !!item.projects && item.projects.length > 0;
            const expandable = hasDetails || hasProjects;
            const open = expanded.has(item.id);

            return (
              <li key={item.id} className={classes.timeline__item}>
                <Label className={classes.timeline__date}>{item.date}</Label>
                <span className={classes.timeline__node} aria-hidden />

                {expandable ? (
                  <button
                    type='button'
                    className={clsx(classes.timeline__card, classes.timeline__card_button)}
                    aria-expanded={open}
                    onClick={() => toggle(item.id)}
                  >
                    {renderBody(item, open, true)}
                  </button>
                ) : (
                  <div className={classes.timeline__card}>{renderBody(item, open, false)}</div>
                )}

                {open && hasDetails && (
                  <ul className={classes.timeline__details}>
                    {item.details?.map((detail, index) => (
                      <Text key={index} as='li' variant='detail' className={classes.timeline__detail}>
                        {detail}
                      </Text>
                    ))}
                  </ul>
                )}

                {open && hasProjects && (
                  <div className={classes.timeline__projects}>
                    <ProjectList projects={item.projects ?? []} />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
