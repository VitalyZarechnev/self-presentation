'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { useLocale } from '@application/locale/LocaleProvider';
import { useTheme } from '@application/theme/ThemeProvider';

import { cityName, tripTitle } from '@domain/geo/geoNames';
import { tripCities } from '@domain/geo/tripCities';
import { TLocale } from '@domain/locale/locale';

import Label from '@ui/atoms/typography/Label';

import { useIsVisible } from '@utils/hooks/useIsVisible';

import classes from './GeoGlobe.module.scss';
import { GeoGlobeController, TTimelineInfo } from './GeoGlobeController';
import Timeline from './Timeline';
import TripCard from './TripCard';

const HOME_CITY = tripCities.find((city) => city.home) ?? tripCities[0];

const INITIAL_TIMELINE: TTimelineInfo = { t: 0, playing: true, follow: true, tripIndex: null, tripTitle: null, currentTime: null };

const MESSAGES = {
  ru: {
    globe: 'Интерактивный глобус с городами из поездок',
    hint: 'тяни — вращать · Ctrl+колесо / пинч — зум · клик — город',
    follow: 'Камера закреплена за транспортом. Открепите её кнопкой ⌖, чтобы вращать глобус.',
  },
  en: {
    globe: 'Interactive globe with cities from my trips',
    hint: 'drag — rotate · Ctrl+wheel / pinch — zoom · click — city',
    follow: 'The camera follows the vehicle. Unpin it with the ⌖ button to rotate the globe.',
  },
} as const;

function pinColor(): string {
  return getComputedStyle(document.documentElement).getPropertyValue('--danger').trim() || '#d64545';
}

// Label sizes are measured once for collision layout, so a language switch remounts the scene.
export default function GeoGlobe() {
  const { locale } = useLocale();
  return <GeoGlobeScene key={locale} locale={locale} />;
}

function GeoGlobeScene({ locale }: { locale: TLocale }) {
  const t = MESSAGES[locale];
  const { theme } = useTheme();
  const mountRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const controllerRef = useRef<GeoGlobeController | null>(null);
  const visible = useIsVisible(mountRef);
  const [selected, setSelected] = useState<number | null>(null);
  const [timeline, setTimeline] = useState<TTimelineInfo>(INITIAL_TIMELINE);
  const [followHint, setFollowHint] = useState(false);
  const followHintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showFollowHint = useCallback(() => {
    setFollowHint(true);
    if (followHintTimer.current) clearTimeout(followHintTimer.current);
    followHintTimer.current = setTimeout(() => setFollowHint(false), 2800);
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const controller = new GeoGlobeController({
      mount,
      labels: labelRefs.current,
      reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      pinColor: pinColor(),
      grabbingClass: classes.globe_grabbing,
      cameraFollow: INITIAL_TIMELINE.follow,
      onSelect: setSelected,
      onTimeline: setTimeline,
      onFollowBlocked: showFollowHint,
    });
    controllerRef.current = controller;

    return () => {
      controller.dispose();
      controllerRef.current = null;
      if (followHintTimer.current) clearTimeout(followHintTimer.current);
    };
  }, [showFollowHint]);

  useEffect(() => {
    if (visible) controllerRef.current?.start();
    else controllerRef.current?.stop();
  }, [visible]);

  useEffect(() => {
    controllerRef.current?.setSelected(selected);
  }, [selected]);

  useEffect(() => {
    controllerRef.current?.setPinColor(pinColor());
  }, [theme]);

  return (
    <div className={classes.globe}>
      <Timeline
        playing={timeline.playing}
        progress={timeline.t}
        follow={timeline.follow}
        tripTitle={timeline.tripTitle && tripTitle(timeline.tripTitle, locale)}
        currentTime={timeline.currentTime}
        onTogglePlay={() => controllerRef.current?.setTimelinePlaying(!timeline.playing)}
        onToggleFollow={() => controllerRef.current?.setCameraFollow(!timeline.follow)}
        onScrub={(t) => controllerRef.current?.setTimelineProgress(t)}
      />
      <div className={classes.globe__viewport}>
        <div className={classes.globe__stage} ref={mountRef} role='img' aria-label={t.globe} />
        <div className={classes.globe__labels} aria-hidden>
          {tripCities.map((city, index) => (
            <Label
              key={city.name}
              ref={(el) => {
                labelRefs.current[index] = el;
              }}
              className={clsx(classes.globe__label, city.important && classes.globe__label_important)}
            >
              {cityName(city.name, locale)}
            </Label>
          ))}
        </div>
        {selected === null ? (
          <Label className={classes.globe__hint}>{t.hint}</Label>
        ) : (
          <TripCard city={tripCities[selected]} home={HOME_CITY} locale={locale} onClose={() => setSelected(null)} />
        )}
        {followHint && timeline.follow && (
          <Label as='div' className={classes.globe__follow_hint} role='status'>
            {t.follow}
          </Label>
        )}
      </div>
    </div>
  );
}
