'use client';

import { ComponentType, CSSProperties, useRef } from 'react';

import { useLocalized } from '@application/locale/LocaleProvider';

import { TWork } from '@domain/works/worksList';

import Tag from '@ui/atoms/tag/Tag';
import Heading from '@ui/atoms/typography/Heading';
import ArrowUpRightIcon from '@ui/icons/arrow-up-right.svg';

import { useInView } from '@utils/hooks/useInView';

import LoadingLabel from './LoadingLabel';
import classes from './Works.module.scss';

const OPEN_IN_TAB = { ru: (name: string) => `Открыть ${name} в новой вкладке`, en: (name: string) => `Open ${name} in a new tab` } as const;

type TProps = {
  work: TWork;
  widget: ComponentType;
  minHeight?: number;
  scale?: number;
};

export default function WorkItem({ work, widget: Widget, minHeight, scale }: TProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef);
  const openInTab = useLocalized(OPEN_IN_TAB);

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
            <a className={classes.work__link} href={work.link} target='_blank' rel='noopener noreferrer' aria-label={openInTab(work.name)}>
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
          <LoadingLabel className={classes.work__placeholder} />
        )}
      </div>
    </article>
  );
}
