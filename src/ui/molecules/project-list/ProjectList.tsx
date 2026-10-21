'use client';

import { useState } from 'react';
import clsx from 'clsx';

import Tag from '@ui/atoms/tag/Tag';
import Label from '@ui/atoms/typography/Label';
import Text from '@ui/atoms/typography/Text';
import ChevronDownIcon from '@ui/icons/chevron-down.svg';

import classes from './ProjectList.module.scss';

export type TProjectView = {
  id: string;
  name: string;
  meta?: string;
  description: string;
  stack: readonly string[];
};

type TProps = {
  projects: readonly TProjectView[];
  title: string;
};

export default function ProjectList({ projects, title }: TProps) {
  const [open, setOpen] = useState(false);

  if (projects.length === 0) return null;

  return (
    <div className={classes.projects}>
      <button type='button' className={classes.projects__toggle} aria-expanded={open} onClick={() => setOpen((prev) => !prev)}>
        <Label className={classes.projects__title}>
          {title} · {projects.length}
        </Label>
        <ChevronDownIcon className={clsx(classes.projects__chevron, open && classes.projects__chevron_open)} />
      </button>

      {open && (
        <ul className={classes.projects__list}>
          {projects.map((project) => (
            <li key={project.id} className={classes.projects__item}>
              <div className={classes.projects__head}>
                <Text variant='companySm' className={classes.projects__name}>
                  {project.name}
                </Text>
                {project.meta && (
                  <Label variant='period' className={classes.projects__meta}>
                    {project.meta}
                  </Label>
                )}
              </div>
              <Text as='p' variant='detail' className={classes.projects__description}>
                {project.description}
              </Text>
              {project.stack.length > 0 && (
                <div className={classes.projects__stack}>
                  {project.stack.map((tech) => (
                    <Tag key={tech}>{tech}</Tag>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
