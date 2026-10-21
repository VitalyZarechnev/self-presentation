'use client';

import clsx from 'clsx';

import { useLocalized } from '@application/locale/LocaleProvider';

import { SITE_SOURCE_URL } from '@domain/site-case/siteAspectList';

import Label from '@ui/atoms/typography/Label';
import ArrowUpRightIcon from '@ui/icons/arrow-up-right.svg';

import classes from './SiteSourceLink.module.scss';

const LABEL = { ru: 'Исходники сайта на GitHub', en: 'Site source on GitHub' } as const;

type TProps = {
  className?: string;
};

export default function SiteSourceLink(props: TProps) {
  const { className } = props;
  const label = useLocalized(LABEL);

  return (
    <a className={clsx(classes.link, className)} href={SITE_SOURCE_URL} target='_blank' rel='noopener noreferrer'>
      <Label>{label}</Label>
      <ArrowUpRightIcon className={classes.link__icon} aria-hidden />
    </a>
  );
}
