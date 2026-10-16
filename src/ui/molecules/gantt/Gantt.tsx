'use client';

import { CSSProperties, useState } from 'react';
import clsx from 'clsx';

import Label from '@ui/atoms/typography/Label';
import Text from '@ui/atoms/typography/Text';
import ChevronDownIcon from '@ui/icons/chevron-down.svg';
import ProjectList, { TProjectView } from '@ui/molecules/project-list/ProjectList';

import classes from './Gantt.module.scss';
import { pct } from './utils';

export type TGanttTone = 'accent' | 'danger' | 'muted';

export type TGanttTick = {
  label: string;
  position: number;
};

export type TGanttSegment = {
  start: number;
  end: number;
  tone: TGanttTone;
  caption?: string;
};

export type TGanttRow = {
  id: string;
  title: string;
  subtitle?: string;
  start: number;
  end: number;
  ongoing?: boolean;
  caption?: string;
  segments?: readonly TGanttSegment[];
  details?: readonly string[];
  projects?: readonly TProjectView[];
};

export type TGanttLegendItem = {
  tone: TGanttTone;
  label: string;
};

type TProps = {
  rows: readonly TGanttRow[];
  ticks: readonly TGanttTick[];
  gridStep: number;
  legend?: readonly TGanttLegendItem[];
};

export default function Gantt({ rows, ticks, gridStep, legend }: TProps) {
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(() => new Set());

  const trackStyle = { '--gantt-grid': pct(gridStep) } as CSSProperties;

  const toggle = (id: string): void => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const renderLine = (row: TGanttRow, open: boolean) => (
    <>
      <div className={classes.gantt__meta}>
        <span className={classes.gantt__meta_text}>
          <Text variant='companySm' className={classes.gantt__company}>
            {row.title}
          </Text>
          {row.subtitle && (
            <Text variant='roleSm' className={classes.gantt__role}>
              {row.subtitle}
            </Text>
          )}
          {row.caption && (
            <Label variant='period' className={classes.gantt__period}>
              {row.caption}
            </Label>
          )}
        </span>
        {((row.details && row.details.length > 0) || (row.projects && row.projects.length > 0)) && (
          <ChevronDownIcon className={clsx(classes.gantt__chevron, open && classes.gantt__chevron_open)} />
        )}
      </div>
      <div className={classes.gantt__track} style={trackStyle}>
        <div
          className={clsx(classes.gantt__bar, row.ongoing && classes.gantt__bar_ongoing)}
          style={{ left: pct(row.start), width: pct(row.end - row.start) }}
          title={row.caption}
          aria-label={row.caption ? `${row.title}: ${row.caption}` : row.title}
        >
          {row.ongoing && <span className={classes.gantt__now} aria-hidden />}
        </div>

        {row.segments?.map((segment, index) => (
          <div
            key={`${row.id}-${index}`}
            className={clsx(classes.gantt__segment, classes[`gantt__segment_${segment.tone}`])}
            style={{ left: pct(segment.start), width: pct(segment.end - segment.start) }}
            title={segment.caption}
            aria-label={segment.caption}
          />
        ))}
      </div>
    </>
  );

  return (
    <div className={classes.gantt}>
      <div className={classes.gantt__scroll}>
        <div className={classes.gantt__inner}>
          <div className={clsx(classes.gantt__row, classes.gantt__row_axis)}>
            <div className={classes.gantt__meta} />
            <div className={classes.gantt__axis}>
              {ticks.map((tick) => (
                <Label key={tick.label} variant='tick' className={classes.gantt__tick} style={{ left: pct(tick.position) }}>
                  {tick.label}
                </Label>
              ))}
            </div>
          </div>

          {rows.map((row) => {
            const hasDetails = !!row.details && row.details.length > 0;
            const hasProjects = !!row.projects && row.projects.length > 0;
            const expandable = hasDetails || hasProjects;
            const open = expanded.has(row.id);

            return (
              <div key={row.id} className={classes.gantt__group}>
                {expandable ? (
                  <button
                    type='button'
                    className={clsx(classes.gantt__row, classes.gantt__row_button)}
                    aria-expanded={open}
                    aria-label={`Подробнее: ${row.title}`}
                    onClick={() => toggle(row.id)}
                  >
                    {renderLine(row, open)}
                  </button>
                ) : (
                  <div className={classes.gantt__row}>{renderLine(row, open)}</div>
                )}

                {open && hasDetails && (
                  <ul className={classes.gantt__details}>
                    {row.details?.map((detail, index) => (
                      <Text key={index} as='li' variant='detail' className={classes.gantt__detail}>
                        {detail}
                      </Text>
                    ))}
                  </ul>
                )}

                {open && hasProjects && (
                  <div className={classes.gantt__projects}>
                    <ProjectList projects={row.projects ?? []} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {legend && legend.length > 0 && (
        <div className={classes.gantt__legend}>
          {legend.map((item) => (
            <span key={item.label} className={classes.gantt__legend_item}>
              <i className={clsx(classes.gantt__swatch, classes[`gantt__swatch_${item.tone}`])} aria-hidden />
              <Label variant='legend'>{item.label}</Label>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
