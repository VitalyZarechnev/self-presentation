import { PropsWithChildren } from 'react';
import clsx from 'clsx';

import classes from './Badge.module.scss';

type TBadgeVariant = 'brand' | 'active' | 'muted';

type TProps = PropsWithChildren<{
  variant?: TBadgeVariant;
  className?: string;
}>;

export default function Badge({ variant = 'brand', className, children }: TProps) {
  return <span className={clsx(classes.badge, classes[variant], className)}>{children}</span>;
}
