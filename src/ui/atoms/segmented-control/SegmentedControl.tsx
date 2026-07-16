import clsx from 'clsx';

import classes from './SegmentedControl.module.scss';

export type TSegmentedOption<T extends string> = {
  value: T;
  label: string;
};

type TProps<T extends string> = {
  options: readonly TSegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel?: string;
  className?: string;
};

export default function SegmentedControl<T extends string>(props: TProps<T>) {
  const { options, value, onChange, ariaLabel, className } = props;

  return (
    <div className={clsx(classes.segmented, className)} role='radiogroup' aria-label={ariaLabel}>
      {options.map((option) => {
        const active = option.value === value;

        return (
          <button
            key={option.value}
            type='button'
            role='radio'
            aria-checked={active}
            className={clsx(classes.segmented__option, active && classes.segmented__option_active)}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
