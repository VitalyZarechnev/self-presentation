'use client';

import { useMemo, useState } from 'react';
import clsx from 'clsx';

import { experienceList } from '@domain/experience/experienceList';

import SegmentedControl, { TSegmentedOption } from '@ui/atoms/segmented-control/SegmentedControl';
import Gantt from '@ui/molecules/gantt/Gantt';
import Timeline from '@ui/molecules/timeline/Timeline';

import classes from './Experience.module.scss';
import { buildGantt, buildTimeline, currentPoint } from './experienceView';

type TMode = 'gantt' | 'timeline';

const MODES: readonly TSegmentedOption<TMode>[] = [
  { value: 'gantt', label: 'Гант' },
  { value: 'timeline', label: 'Таймлайн' },
];

export default function Experience() {
  const [mode, setMode] = useState<TMode>('gantt');
  const [now] = useState(() => currentPoint(new Date()));

  const gantt = useMemo(() => buildGantt(experienceList, now), [now]);
  const timeline = useMemo(() => buildTimeline(experienceList), []);

  const ganttActive = mode === 'gantt';

  return (
    <div className={classes.experience}>
      <SegmentedControl<TMode> options={MODES} value={mode} onChange={setMode} ariaLabel='Вид опыта работы' />

      <div className={classes.experience__stage}>
        <div className={clsx(classes.experience__pane, !ganttActive && classes.experience__pane_hidden)} inert={!ganttActive}>
          <Gantt rows={gantt.rows} ticks={gantt.ticks} gridStep={gantt.gridStep} />
        </div>
        <div className={clsx(classes.experience__pane, ganttActive && classes.experience__pane_hidden)} inert={ganttActive}>
          <Timeline items={timeline} />
        </div>
      </div>
    </div>
  );
}
