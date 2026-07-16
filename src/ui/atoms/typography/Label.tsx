import { ComponentPropsWithRef, ElementType } from 'react';
import clsx from 'clsx';

import classes from './Label.module.scss';

export type TLabelVariant = 'eyebrow' | 'index' | 'channel' | 'value' | 'tick' | 'period' | 'legend' | 'domains' | 'notice';

type AllowedTags = 'span' | 'p' | 'div' | 'label' | 'button';

type TProps<T extends AllowedTags> = {
  as?: T;
  variant?: TLabelVariant;
  className?: string;
} & ComponentPropsWithRef<T>;

export default function Label<T extends AllowedTags = 'span'>(props: TProps<T>) {
  const { as, variant, className, children, ...rest } = props;

  const Tag = (as || 'span') as ElementType;

  return (
    <Tag
      className={clsx(classes.label, variant && classes[`label_${variant}`], className)}
      {...(rest as ComponentPropsWithRef<AllowedTags>)}
    >
      {children}
    </Tag>
  );
}
