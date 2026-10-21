'use client';

import { useMemo, useState } from 'react';
import clsx from 'clsx';

import { useLocale } from '@application/locale/LocaleProvider';

import { experienceList } from '@domain/experience/experienceList';
import { TLocalized } from '@domain/locale/locale';

import SegmentedControl, { TSegmentedOption } from '@ui/atoms/segmented-control/SegmentedControl';
import Gantt from '@ui/molecules/gantt/Gantt';
import Timeline from '@ui/molecules/timeline/Timeline';

import classes from './Experience.module.scss';
import { buildGantt, buildTimeline, currentPoint } from './experienceView';

type TMode = 'gantt' | 'timeline';

const MESSAGES = {
  ru: {
    modes: [
      { value: 'gantt', label: 'Гант' },
      { value: 'timeline', label: 'Таймлайн' },
    ],
    view: 'Вид опыта работы',
    more: 'Подробнее',
    projects: 'Проекты',
  },
  en: {
    modes: [
      { value: 'gantt', label: 'Gantt' },
      { value: 'timeline', label: 'Timeline' },
    ],
    view: 'Experience view',
    more: 'Details',
    projects: 'Projects',
  },
} satisfies TLocalized<{ modes: readonly TSegmentedOption<TMode>[]; view: string; more: string; projects: string }>;

export default function Experience() {
  const [mode, setMode] = useState<TMode>('gantt');
  const [now] = useState(() => currentPoint(new Date()));

  const { locale } = useLocale();
  const t = MESSAGES[locale];

  const gantt = useMemo(() => buildGantt(experienceList[locale], now, locale), [now, locale]);
  const timeline = useMemo(() => buildTimeline(experienceList[locale], locale), [locale]);

  const ganttActive = mode === 'gantt';

  return (
    <div className={classes.experience}>
      <SegmentedControl<TMode> options={t.modes} value={mode} onChange={setMode} ariaLabel={t.view} />

      <div className={classes.experience__stage}>
        <div className={clsx(classes.experience__pane, !ganttActive && classes.experience__pane_hidden)} inert={!ganttActive}>
          <Gantt rows={gantt.rows} ticks={gantt.ticks} gridStep={gantt.gridStep} labels={{ more: t.more, projects: t.projects }} />
        </div>
        <div className={clsx(classes.experience__pane, ganttActive && classes.experience__pane_hidden)} inert={ganttActive}>
          <Timeline items={timeline} projectsLabel={t.projects} />
        </div>
      </div>
    </div>
  );
}
