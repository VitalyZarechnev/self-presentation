import { PropsWithChildren } from 'react';
import clsx from 'clsx';

import classes from './Heading.module.scss';

type TProps = PropsWithChildren & {
  variant: 'h1' | 'h2' | 'h3';
  id?: string;
  className?: string;
};

export default function Heading(props: TProps) {
  const { variant, id, className, children } = props;

  const Tag = variant;

  return (
    <Tag id={id} className={clsx(classes.heading, classes[`heading__${variant}`], className)}>
      {children}
    </Tag>
  );
}
