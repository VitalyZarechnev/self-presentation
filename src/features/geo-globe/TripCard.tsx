import { distanceKm, hemisphere } from '@domain/geo/cityStats';
import { cityName, countryName } from '@domain/geo/geoNames';
import { TCity } from '@domain/geo/tripCities';
import { TLocale } from '@domain/locale/locale';

import Label from '@ui/atoms/typography/Label';

import classes from './TripCard.module.scss';

type TProps = {
  city: TCity;
  home: TCity;
  locale: TLocale;
  onClose: () => void;
};

const MESSAGES = {
  ru: {
    intl: 'ru-RU',
    km: 'км',
    sameAsHome: 'как в Томске',
    diff: (hours: string) => `${hours} ч к Томску`,
    fromHome: 'от Томска',
    homeTown: 'родной город',
    timezone: 'часовой пояс',
    hemisphere: 'полушарие',
    north: 'Северное',
    south: 'Южное',
    east: 'Восточное',
    west: 'Западное',
    year: 'год',
    close: 'Закрыть',
  },
  en: {
    intl: 'en-GB',
    km: 'km',
    sameAsHome: 'same as Tomsk',
    diff: (hours: string) => `${hours} h vs Tomsk`,
    fromHome: 'from Tomsk',
    homeTown: 'home town',
    timezone: 'time zone',
    hemisphere: 'hemisphere',
    north: 'Northern',
    south: 'Southern',
    east: 'Eastern',
    west: 'Western',
    year: 'year',
    close: 'Close',
  },
} as const;

function formatTz(tz: number): string {
  return `UTC${tz >= 0 ? '+' : '−'}${Math.abs(tz)}`;
}

export default function TripCard({ city, home, locale, onClose }: TProps) {
  const t = MESSAGES[locale];
  const formatDiff = (diff: number): string => (diff === 0 ? t.sameAsHome : t.diff(`${diff > 0 ? '+' : '−'}${Math.abs(diff)}`));
  const side = hemisphere(city);
  const rows: { key: string; value: string }[] = [
    { key: t.fromHome, value: city.home ? t.homeTown : `${Math.round(distanceKm(home, city)).toLocaleString(t.intl)} ${t.km}` },
    { key: t.timezone, value: `${formatTz(city.tz)} · ${formatDiff(city.tz - home.tz)}` },
    { key: t.hemisphere, value: `${side.north ? t.north : t.south} · ${side.east ? t.east : t.west}` },
  ];

  if (city.year) rows.push({ key: t.year, value: city.year });

  return (
    <div className={classes.card}>
      <Label as='button' className={classes.card__close} onClick={onClose} aria-label={t.close}>
        ✕
      </Label>

      <div className={classes.card__head}>
        <Label as='p' className={classes.card__city}>
          {cityName(city.name, locale)}
        </Label>
        <Label className={classes.card__country}>{countryName(city, locale)}</Label>
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
