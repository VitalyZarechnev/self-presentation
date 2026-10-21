'use client';

import { useState } from 'react';
import clsx from 'clsx';

import { useLocale } from '@application/locale/LocaleProvider';

import { SITE_SOURCE_URL, siteAspectList } from '@domain/site-case/siteAspectList';

import ActionButton from '@ui/atoms/action-button/ActionButton';
import Content from '@ui/atoms/typography/Content';
import Heading from '@ui/atoms/typography/Heading';
import Label from '@ui/atoms/typography/Label';
import ArrowUpRightIcon from '@ui/icons/arrow-up-right.svg';
import ChevronDownIcon from '@ui/icons/chevron-down.svg';

import InlineCode from './InlineCode';
import classes from './SiteCase.module.scss';
import TokenSandbox from './TokenSandbox';
import TokenTable from './TokenTable';

// Everything starts folded: three one-line summaries read faster than the sandbox, table and code of an open aspect.
const NOTHING_OPEN: ReadonlySet<string> = new Set();
const CODE_CTA = { ru: 'Смотреть код на GitHub', en: 'View the code on GitHub' } as const;

export default function SiteCase() {
  const [open, setOpen] = useState<ReadonlySet<string>>(NOTHING_OPEN);
  const { locale } = useLocale();

  const toggle = (id: string): void => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className={classes.site_case}>
      <ul className={classes.site_case__list}>
        {siteAspectList[locale].map((aspect) => {
          const expanded = open.has(aspect.id);
          const panelId = `site-case-${aspect.id}`;

          return (
            <li key={aspect.id} className={classes.site_case__item}>
              <button
                type='button'
                className={classes.site_case__toggle}
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => toggle(aspect.id)}
              >
                <span className={classes.site_case__heading}>
                  <Heading variant='h3' as='h3'>
                    {aspect.title}
                  </Heading>
                  <Content as='span' size='mini' className={classes.site_case__summary}>
                    {aspect.summary}
                  </Content>
                </span>
                <ChevronDownIcon className={clsx(classes.site_case__chevron, expanded && classes.site_case__chevron_open)} aria-hidden />
              </button>

              {expanded && (
                <div id={panelId} className={classes.site_case__panel}>
                  <ul className={classes.site_case__points}>
                    {aspect.points.map((point) => (
                      <li key={point} className={classes.site_case__point}>
                        <InlineCode text={point} />
                      </li>
                    ))}
                  </ul>

                  {aspect.id === 'themes' && (
                    <>
                      <TokenSandbox />
                      <TokenTable />
                    </>
                  )}

                  <figure className={classes.site_case__code}>
                    <figcaption className={classes.site_case__file}>
                      <Label>{aspect.code.file}</Label>
                    </figcaption>
                    <pre className={classes.site_case__pre}>
                      <code>{aspect.code.source}</code>
                    </pre>
                  </figure>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <ActionButton href={SITE_SOURCE_URL} variant='secondary' target='_blank' rel='noopener noreferrer' className={classes.site_case__cta}>
        {CODE_CTA[locale]}
        <ArrowUpRightIcon className={classes.site_case__cta_icon} aria-hidden />
      </ActionButton>
    </div>
  );
}
