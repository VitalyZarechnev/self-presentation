'use client';

import { ComponentType, useRef } from 'react';

import { TWork } from '@domain/works/worksList';

import Tag from '@ui/atoms/tag/Tag';
import Heading from '@ui/atoms/typography/Heading';
import Label from '@ui/atoms/typography/Label';

import { useInView } from '@utils/hooks/useInView';

import classes from './Works.module.scss';

type TProps = {
  work: TWork;
  widget: ComponentType;
  minHeight?: number;
};

export default function WorkItem({ work, widget: Widget, minHeight }: TProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef);

  return (
    <article className={classes.work}>
      <header className={classes.work__head}>
        <Heading variant='h3'>{work.name}</Heading>
        <div className={classes.work__tags}>
          {work.tech.map((tech) => (
            <Tag key={tech}>{tech}</Tag>
          ))}
        </div>
      </header>
      <div className={classes.work__stage} ref={stageRef} style={minHeight ? { minHeight } : undefined}>
        {inView ? (
          <Widget />
        ) : (
          <Label as='div' className={classes.work__placeholder}>
            Загрузка…
          </Label>
        )}
      </div>
    </article>
  );
}
