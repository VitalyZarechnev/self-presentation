import { CSSProperties, ReactNode } from 'react';

import Label from '@ui/atoms/typography/Label';

import classes from './HuePicker.module.scss';

const HUE_STOPS = [0, 45, 90, 135, 180, 225, 270, 315, 360];

type TProps = {
  label: string;
  hue: number;
  track: { l: number; c: number };
  readout: ReactNode;
  valueText: string;
  onChange: (hue: number) => void;
};

export default function HuePicker(props: TProps) {
  const { label, hue, track, readout, valueText, onChange } = props;
  const style = {
    '--hue-track': `linear-gradient(90deg, ${HUE_STOPS.map((stop) => `oklch(${track.l} ${track.c} ${stop})`).join(', ')})`,
  } as CSSProperties;

  return (
    <label className={classes.picker}>
      <span className={classes.picker__row}>
        <Label className={classes.picker__name}>{label}</Label>
        <span className={classes.picker__readout}>{readout}</span>
      </span>
      <input
        type='range'
        className={classes.picker__range}
        style={style}
        min={0}
        max={359}
        value={Math.round(hue)}
        aria-valuetext={valueText}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
