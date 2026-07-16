import { AnchorHTMLAttributes } from 'react';
import clsx from 'clsx';
import Link from 'next/link';

import classes from './ActionButton.module.scss';

type TProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: 'primary' | 'secondary';
};

export default function ActionButton({ variant = 'secondary', className, children, href, ...rest }: TProps) {
  const classNames = clsx(classes.action, classes[`action_${variant}`], className);

  if (href && href.startsWith('/')) {
    return (
      <Link href={href} className={classNames} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={classNames} {...rest}>
      {children}
    </a>
  );
}
