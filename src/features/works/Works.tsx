'use client';

import { ComponentType } from 'react';
import dynamic from 'next/dynamic';

import { worksList } from '@domain/works/worksList';

import Label from '@ui/atoms/typography/Label';

import WorkItem from './WorkItem';
import classes from './Works.module.scss';

const WIDGETS: Record<string, ComponentType> = {
  'geo-trips': dynamic(() => import('@features/geo-globe/GeoGlobe'), {
    ssr: false,
    loading: () => (
      <Label as='div' className={classes.works__placeholder}>
        Загрузка…
      </Label>
    ),
  }),
  interview: dynamic(() => import('@features/interview-prep/InterviewPrep'), {
    ssr: false,
    loading: () => (
      <Label as='div' className={classes.works__placeholder}>
        Загрузка…
      </Label>
    ),
  }),
  marshmallow: dynamic(() => import('@features/marshmallow-game/MarshmallowGame'), {
    ssr: false,
    loading: () => (
      <Label as='div' className={classes.works__placeholder}>
        Загрузка…
      </Label>
    ),
  }),
  market: dynamic(() => import('@features/market/LiveMarket'), {
    ssr: false,
    loading: () => (
      <Label as='div' className={classes.works__placeholder}>
        Загрузка…
      </Label>
    ),
  }),
  bank: dynamic(() => import('@features/bank/AlbatrosBank'), {
    ssr: false,
    loading: () => (
      <Label as='div' className={classes.works__placeholder}>
        Загрузка…
      </Label>
    ),
  }),
};

const STAGE_MIN_HEIGHT: Record<string, number> = {
  'geo-trips': 720,
  bank: 1000,
  market: 500,
  interview: 620,
  marshmallow: 560,
};

const STAGE_SCALE: Record<string, number> = {
  market: 1.55,
  bank: 1.6,
};

export default function Works() {
  return (
    <div className={classes.works__list}>
      {worksList.map((work) => {
        const widget = WIDGETS[work.id];
        if (!widget) return null;
        return <WorkItem key={work.id} work={work} widget={widget} minHeight={STAGE_MIN_HEIGHT[work.id]} scale={STAGE_SCALE[work.id]} />;
      })}
    </div>
  );
}
