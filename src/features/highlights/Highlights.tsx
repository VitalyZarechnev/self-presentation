'use client';

import { useLocalized } from '@application/locale/LocaleProvider';

import { highlightsList } from '@domain/highlights/highlightsList';

import Stat from '@ui/atoms/stat/Stat';

import classes from './Highlights.module.scss';

export default function Highlights() {
  return (
    <div className={classes.highlights}>
      {useLocalized(highlightsList).map((highlight) => (
        <Stat key={highlight.id} value={highlight.value} label={highlight.label} />
      ))}
    </div>
  );
}
