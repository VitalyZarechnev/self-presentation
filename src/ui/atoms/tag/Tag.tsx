import { PropsWithChildren } from 'react';
import clsx from 'clsx';

import classes from './Tag.module.scss';

type TProps = PropsWithChildren & {
  className?: string;
};

export default function Tag({ children, className }: TProps) {
  return <span className={clsx(classes.tag, className)}>{children}</span>;
}
