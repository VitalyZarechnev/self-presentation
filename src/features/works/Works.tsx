'use client';

import { ComponentType } from 'react';
import dynamic from 'next/dynamic';

import { useLocalized } from '@application/locale/LocaleProvider';

import { worksList } from '@domain/works/worksList';

import LoadingLabel from './LoadingLabel';
import WorkItem from './WorkItem';
import classes from './Works.module.scss';

const WIDGETS: Record<string, ComponentType> = {
  'geo-trips': dynamic(() => import('@features/geo-globe/GeoGlobe'), {
    ssr: false,
    loading: () => <LoadingLabel className={classes.works__placeholder} />,
  }),
  interview: dynamic(() => import('@features/interview-prep/InterviewPrep'), {
    ssr: false,
    loading: () => <LoadingLabel className={classes.works__placeholder} />,
  }),
  marshmallow: dynamic(() => import('@features/marshmallow-game/MarshmallowGame'), {
    ssr: false,
    loading: () => <LoadingLabel className={classes.works__placeholder} />,
  }),
  market: dynamic(() => import('@features/market/LiveMarket'), {
    ssr: false,
    loading: () => <LoadingLabel className={classes.works__placeholder} />,
  }),
  bank: dynamic(() => import('@features/bank/AlbatrosBank'), {
    ssr: false,
    loading: () => <LoadingLabel className={classes.works__placeholder} />,
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
  const works = useLocalized(worksList);

  return (
    <div className={classes.works__list}>
      {works.map((work) => {
        const widget = WIDGETS[work.id];
        if (!widget) return null;
        return <WorkItem key={work.id} work={work} widget={widget} minHeight={STAGE_MIN_HEIGHT[work.id]} scale={STAGE_SCALE[work.id]} />;
      })}
    </div>
  );
}
