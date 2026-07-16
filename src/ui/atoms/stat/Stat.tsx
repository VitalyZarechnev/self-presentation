import clsx from 'clsx';

import classes from './Stat.module.scss';

type TProps = {
  value: string;
  label: string;
  className?: string;
};

export default function Stat({ value, label, className }: TProps) {
  return (
    <div className={clsx(classes.stat, className)}>
      <span className={classes.stat__value}>{value}</span>
      <span className={classes.stat__label}>{label}</span>
    </div>
  );
}
