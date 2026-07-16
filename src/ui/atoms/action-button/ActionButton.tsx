import { AnchorHTMLAttributes } from 'react';
import clsx from 'clsx';

import classes from './ActionButton.module.scss';

type TProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: 'primary' | 'secondary';
};

export default function ActionButton({ variant = 'secondary', className, children, ...rest }: TProps) {
  return (
    <a className={clsx(classes.action, classes[`action_${variant}`], className)} {...rest}>
      {children}
    </a>
  );
}
