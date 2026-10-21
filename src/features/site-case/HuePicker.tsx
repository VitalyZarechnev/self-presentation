import { CSSProperties, ReactNode } from 'react';

import { THueBand } from '@application/theme/customTheme';

import Label from '@ui/atoms/typography/Label';

import classes from './HuePicker.module.scss';

const HUE_STOPS = [0, 45, 90, 135, 180, 225, 270, 315, 360];
const HUE_MAX = 359;
const VEIL = 'color-mix(in oklab, var(--surface) 70%, transparent)';

const percent = (hue: number): string => `${((hue / HUE_MAX) * 100).toFixed(2)}%`;

function bandSegments({ from, to }: THueBand): Array<[number, number]> {
  if (from < 0)
    return [
      [0, to],
      [from + 360, HUE_MAX],
    ];
  if (to > HUE_MAX)
    return [
      [from, HUE_MAX],
      [0, to - 360],
    ];
  return [[from, to]];
}

function veilLayers(bands: readonly THueBand[]): string[] {
  return bands
    .flatMap(bandSegments)
    .map(
      ([from, to]) =>
        `linear-gradient(90deg, transparent ${percent(from)}, ${VEIL} ${percent(from)} ${percent(to)}, transparent ${percent(to)})`,
    );
}

type TProps = {
  label: string;
  hue: number;
  track: { l: number; c: number };
  readout: ReactNode;
  valueText: string;
  bands?: readonly THueBand[];
  note?: string;
  onChange: (hue: number) => void;
};

export default function HuePicker(props: TProps) {
  const { label, hue, track, readout, valueText, bands = [], note, onChange } = props;
  const spectrum = `linear-gradient(90deg, ${HUE_STOPS.map((stop) => `oklch(${track.l} ${track.c} ${stop})`).join(', ')})`;
  const style = { '--hue-track': [...veilLayers(bands), spectrum].join(', ') } as CSSProperties;

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
      {note && <Label className={classes.picker__note}>{note}</Label>}
    </label>
  );
}
