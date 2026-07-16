import { PropsWithChildren } from 'react';
import clsx from 'clsx';

import classes from './Display.module.scss';

export type TDisplayVariant = 'lead';

type TProps = PropsWithChildren & {
  as?: 'span' | 'p';
  variant?: TDisplayVariant;
  className?: string;
};

export default function Display(props: TProps) {
  const { as: Tag = 'p', variant = 'lead', className, children } = props;

  return <Tag className={clsx(classes.display, classes[`display_${variant}`], className)}>{children}</Tag>;
}
