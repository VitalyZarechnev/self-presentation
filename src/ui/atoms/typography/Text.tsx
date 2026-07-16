import { PropsWithChildren } from 'react';
import clsx from 'clsx';

import classes from './Text.module.scss';

export type TTextVariant = 'companySm' | 'companyMd' | 'roleSm' | 'roleMd' | 'detail';

type TProps = PropsWithChildren & {
  as?: 'span' | 'p' | 'div' | 'li';
  variant: TTextVariant;
  className?: string;
};

export default function Text(props: TProps) {
  const { as: Tag = 'span', variant, className, children } = props;

  return <Tag className={clsx(classes.text, classes[`text_${variant}`], className)}>{children}</Tag>;
}
