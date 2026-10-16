'use client';

import { ComponentType, CSSProperties, useRef } from 'react';

import { TWork } from '@domain/works/worksList';

import Tag from '@ui/atoms/tag/Tag';
import Heading from '@ui/atoms/typography/Heading';
import Label from '@ui/atoms/typography/Label';
import ArrowUpRightIcon from '@ui/icons/arrow-up-right.svg';

import { useInView } from '@utils/hooks/useInView';

import classes from './Works.module.scss';

type TProps = {
  work: TWork;
  widget: ComponentType;
  minHeight?: number;
  scale?: number;
};

export default function WorkItem({ work, widget: Widget, minHeight, scale }: TProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef);

  const stageStyle = minHeight
    ? ({
        '--stage-min-h': `${minHeight}px`,
        '--stage-min-h-mobile': `${scale ? Math.round(minHeight / scale) : minHeight}px`,
      } as CSSProperties)
    : undefined;

  return (
    <article id={work.id} className={classes.work}>
      <header className={classes.work__head}>
        <div className={classes.work__title}>
          <Heading variant='h3' as='h2'>
            {work.name}
          </Heading>
          {work.link && (
            <a
              className={classes.work__link}
              href={work.link}
              target='_blank'
              rel='noopener noreferrer'
              aria-label={`Открыть ${work.name} в новой вкладке`}
            >
              <ArrowUpRightIcon />
            </a>
          )}
        </div>
        <div className={classes.work__tags}>
          {work.tech.map((tech) => (
            <Tag key={tech}>{tech}</Tag>
          ))}
        </div>
      </header>
      <div className={classes.work__stage} ref={stageRef} style={stageStyle}>
        {inView ? (
          scale ? (
            <div className={classes.work__scale} style={{ '--stage-scale': scale } as CSSProperties}>
              <Widget />
            </div>
          ) : (
            <Widget />
          )
        ) : (
          <Label as='div' className={classes.work__placeholder}>
            Загрузка…
          </Label>
        )}
      </div>
    </article>
  );
}
