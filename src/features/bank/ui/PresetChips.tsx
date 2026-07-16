import clsx from 'clsx';

import classes from './PresetChips.module.scss';

type TOption = string | number;

type TProps = {
  options: readonly TOption[];
  onSelect: (option: TOption) => void;
  label?: string;
  value?: TOption;
  format?: (option: TOption) => string;
};

export default function PresetChips({ options, onSelect, label, value, format }: TProps) {
  return (
    <div className={classes.wrap}>
      {label && <span className={classes.label}>{label}</span>}
      <div className={classes.chips}>
        {options.map((option) => (
          <button key={String(option)} className={clsx(classes.chip, value === option && classes.on)} onClick={() => onSelect(option)}>
            {format ? format(option) : String(option)}
          </button>
        ))}
      </div>
    </div>
  );
}
