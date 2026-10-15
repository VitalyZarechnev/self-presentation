import { TExperience, TExperiencePoint, TExperienceProject } from '@domain/experience/models/Experience';

import { TGanttLegendItem, TGanttRow, TGanttSegment, TGanttTick } from '@ui/molecules/gantt/Gantt';
import { TProjectView } from '@ui/molecules/project-list/ProjectList';
import { TTimelineItem } from '@ui/molecules/timeline/Timeline';

const MONTHS_SHORT = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

function buildProjects(id: string, projects: readonly TExperienceProject[] | undefined): TProjectView[] {
  return (projects ?? []).map((project, index) => ({
    id: `${id}-p${index}`,
    name: project.name,
    meta: [project.period, project.role].filter(Boolean).join(' · ') || undefined,
    description: project.description,
    stack: project.stack,
  }));
}

const toMonths = (point: TExperiencePoint): number => point.year * 12 + (point.month - 1) + ((point.day ?? 1) - 1) / 31;

const formatPoint = (point: TExperiencePoint): string => `${MONTHS_SHORT[point.month - 1]}’${String(point.year).slice(2)}`;

const pad = (value: number): string => String(value).padStart(2, '0');

const formatDate = (point: TExperiencePoint): string =>
  point.day ? `${pad(point.day)}.${pad(point.month)}.${point.year}` : `${pad(point.month)}.${point.year}`;

export function currentPoint(now: Date): TExperiencePoint {
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

type TGanttModel = {
  rows: TGanttRow[];
  ticks: TGanttTick[];
  gridStep: number;
  legend: TGanttLegendItem[];
};

export function buildGantt(items: readonly TExperience[], now: TExperiencePoint): TGanttModel {
  const ends = items.map((item) => item.end ?? now);
  const minYear = Math.min(...items.map((item) => item.start.year));
  const maxYear = Math.max(...ends.map((point) => point.year));

  const rangeStart = minYear * 12;
  const span = (maxYear + 1) * 12 - rangeStart;
  const years = maxYear + 1 - minYear;

  const frac = (point: TExperiencePoint): number => (toMonths(point) - rangeStart) / span;

  let hasUnofficial = false;

  const rows: TGanttRow[] = [...items]
    .sort((a, b) => toMonths(a.start) - toMonths(b.start))
    .map((item) => {
      const end = item.end ?? now;

      const segments: TGanttSegment[] = [];
      if (item.officialFrom) {
        hasUnofficial = true;
        segments.push({
          start: frac(item.start),
          end: frac(item.officialFrom),
          tone: 'danger',
          caption: `Неофициально: ${formatPoint(item.start)} — официально с ${formatDate(item.officialFrom)}`,
        });
      }

      return {
        id: item.id,
        title: item.company,
        subtitle: item.role,
        start: frac(item.start),
        end: frac(end),
        ongoing: item.end === null,
        caption: `${formatPoint(item.start)} — ${item.end ? formatPoint(item.end) : 'сейчас'}`,
        segments,
        details: item.achievements,
        projects: buildProjects(item.id, item.projects),
      };
    });

  const ticks: TGanttTick[] = [];
  for (let year = minYear; year <= maxYear; year += 1) {
    ticks.push({ label: `’${String(year).slice(2)}`, position: (year * 12 - rangeStart) / span });
  }

  const legend: TGanttLegendItem[] = hasUnofficial
    ? [
        { tone: 'accent', label: 'Официально' },
        { tone: 'danger', label: 'Неофициально' },
      ]
    : [];

  return { rows, ticks, gridStep: 1 / years, legend };
}

export function buildTimeline(items: readonly TExperience[]): TTimelineItem[] {
  return [...items]
    .sort((a, b) => toMonths(b.start) - toMonths(a.start))
    .map((item) => ({
      id: item.id,
      title: item.company,
      subtitle: item.role,
      date: `${item.start.year} — ${item.end ? item.end.year : 'сейчас'}`,
      tags: item.stack,
      details: item.achievements,
      projects: buildProjects(item.id, item.projects),
    }));
}
