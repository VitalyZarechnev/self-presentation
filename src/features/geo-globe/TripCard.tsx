import { distanceKm, hemisphere } from '@domain/geo/cityStats';
import { TCity } from '@domain/geo/tripCities';

import Label from '@ui/atoms/typography/Label';

import classes from './TripCard.module.scss';

type TProps = {
  city: TCity;
  home: TCity;
  onClose: () => void;
};

function formatKm(km: number): string {
  return `${Math.round(km).toLocaleString('ru-RU')} км`;
}

function formatTz(tz: number): string {
  return `UTC${tz >= 0 ? '+' : '−'}${Math.abs(tz)}`;
}

function formatDiff(diff: number): string {
  if (diff === 0) return 'как в Томске';
  return `${diff > 0 ? '+' : '−'}${Math.abs(diff)} ч к Томску`;
}

export default function TripCard({ city, home, onClose }: TProps) {
  const rows: { key: string; value: string }[] = [
    { key: 'от Томска', value: city.home ? 'родной город' : formatKm(distanceKm(home, city)) },
    { key: 'часовой пояс', value: `${formatTz(city.tz)} · ${formatDiff(city.tz - home.tz)}` },
    { key: 'полушарие', value: hemisphere(city) },
  ];

  if (city.year) rows.push({ key: 'год', value: city.year });

  return (
    <div className={classes.card}>
      <Label as='button' className={classes.card__close} onClick={onClose} aria-label='Закрыть'>
        ✕
      </Label>

      <div className={classes.card__head}>
        <Label as='p' className={classes.card__city}>
          {city.name}
        </Label>
        <Label className={classes.card__country}>{city.country}</Label>
      </div>

      <div className={classes.card__stats}>
        {rows.map((row) => (
          <div className={classes.card__row} key={row.key}>
            <Label className={classes.card__key}>{row.key}</Label>
            <Label className={classes.card__value}>{row.value}</Label>
          </div>
        ))}
      </div>

      {city.note && (
        <Label as='p' className={classes.card__note}>
          {city.note}
        </Label>
      )}
    </div>
  );
}
