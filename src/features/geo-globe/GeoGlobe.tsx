'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { useTheme } from '@application/theme/ThemeProvider';

import { tripCities } from '@domain/geo/tripCities';

import Label from '@ui/atoms/typography/Label';

import { useIsVisible } from '@utils/hooks/useIsVisible';

import classes from './GeoGlobe.module.scss';
import { GeoGlobeController } from './GeoGlobeController';
import TripCard from './TripCard';

const HOME_CITY = tripCities.find((city) => city.home) ?? tripCities[0];

function pinColor(): string {
  return getComputedStyle(document.documentElement).getPropertyValue('--danger').trim() || '#d64545';
}

export default function GeoGlobe() {
  const { theme } = useTheme();
  const mountRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const controllerRef = useRef<GeoGlobeController | null>(null);
  const visible = useIsVisible(mountRef);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const controller = new GeoGlobeController({
      mount,
      labels: labelRefs.current,
      reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      pinColor: pinColor(),
      grabbingClass: classes.globe_grabbing,
      onSelect: setSelected,
    });
    controllerRef.current = controller;

    return () => {
      controller.dispose();
      controllerRef.current = null;
    };
  }, []);

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
      <div className={classes.globe__stage} ref={mountRef} role='img' aria-label='Интерактивный глобус с городами из поездок' />
      <div className={classes.globe__labels} aria-hidden>
        {tripCities.map((city, index) => (
          <Label
            key={city.name}
            ref={(el) => {
              labelRefs.current[index] = el;
            }}
            className={clsx(classes.globe__label, city.important && classes.globe__label_important)}
          >
            {city.name}
          </Label>
        ))}
      </div>
      {selected === null ? (
        <Label className={classes.globe__hint}>тяни — вращать · Ctrl+колесо / пинч — зум · клик — город</Label>
      ) : (
        <TripCard city={tripCities[selected]} home={HOME_CITY} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
