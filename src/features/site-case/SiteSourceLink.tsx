import clsx from 'clsx';

import { SITE_SOURCE_URL } from '@domain/site-case/siteAspectList';

import Label from '@ui/atoms/typography/Label';
import ArrowUpRightIcon from '@ui/icons/arrow-up-right.svg';

import classes from './SiteSourceLink.module.scss';

type TProps = {
  className?: string;
};

export default function SiteSourceLink(props: TProps) {
  const { className } = props;

  return (
    <a className={clsx(classes.link, className)} href={SITE_SOURCE_URL} target='_blank' rel='noopener noreferrer'>
      <Label>Исходники сайта на GitHub</Label>
      <ArrowUpRightIcon className={classes.link__icon} aria-hidden />
    </a>
  );
}
