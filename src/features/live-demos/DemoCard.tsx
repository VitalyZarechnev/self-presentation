import { ReactNode } from 'react';
import clsx from 'clsx';
import Link from 'next/link';

import { TLiveDemo } from '@domain/works/liveDemos';

import Tag from '@ui/atoms/tag/Tag';
import Content from '@ui/atoms/typography/Content';
import Heading from '@ui/atoms/typography/Heading';
import Label from '@ui/atoms/typography/Label';
import ArrowRightIcon from '@ui/icons/arrow-right.svg';

import classes from './DemoCard.module.scss';

export type TDemoCardLayout = 'feature' | 'half' | 'inline';

type TProps = {
  demo: TLiveDemo;
  layout: TDemoCardLayout;
  preview: ReactNode;
  className?: string;
};

export default function DemoCard(props: TProps) {
  const { demo, layout, preview, className } = props;
  const { href } = demo;

  return (
    <article className={clsx(classes.card, classes[`card_layout_${layout}`], className)}>
      {href ? (
        <Link href={href} className={classes.card__stage} tabIndex={-1} aria-hidden>
          {preview}
        </Link>
      ) : (
        <div className={classes.card__stage}>{preview}</div>
      )}

      <div className={classes.card__body}>
        <Heading variant='h3'>{demo.name}</Heading>
        <Content as='p' size='mini' className={classes.card__proves}>
          {demo.proves}
        </Content>
        <div className={classes.card__tags}>
          {demo.tech.map((tech) => (
            <Tag key={tech}>{tech}</Tag>
          ))}
        </div>
        {href && (
          <Link href={href} className={classes.card__open}>
            <Label>Открыть демо</Label>
            <ArrowRightIcon className={classes.card__open_icon} aria-hidden />
          </Link>
        )}
      </div>
    </article>
  );
}
