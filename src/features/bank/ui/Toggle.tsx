import clsx from 'clsx';

import classes from './Toggle.module.scss';

type TProps = {
  label: string;
  on: boolean;
  onToggle: () => void;
};

export default function Toggle({ label, on, onToggle }: TProps) {
  return (
    <button className={classes.row} onClick={onToggle} role='switch' aria-checked={on}>
      <span>{label}</span>
      <span className={clsx(classes.track, on && classes.on)}>
        <span className={classes.knob} />
      </span>
    </button>
  );
}
