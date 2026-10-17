'use client';

import clsx from 'clsx';
import Link from 'next/link';

import { useTheme } from '@application/theme/ThemeProvider';
import { THEME_LABELS } from '@application/theme/themes';

import ActionButton from '@ui/atoms/action-button/ActionButton';
import Moon from '@ui/icons/moon.svg';
import SlidersIcon from '@ui/icons/sliders.svg';
import Sun from '@ui/icons/sun.svg';

import { sectionsMeta } from './sections';
import classes from './SiteHeader.module.scss';

const CUSTOM_THEME_LABEL = 'Своя';
const TELEGRAM_HREF = 'https://t.me/VitalyZarechnev';

export default function SiteHeader() {
  const { themes, selection, custom, setTheme, selectCustom } = useTheme();

  return (
    <>
      <a href='#content' className={classes.skip}>
        Перейти к содержимому
      </a>
      <header className={classes.header}>
        <div className={classes.inner}>
          <Link href='/' className={classes.brand}>
            <span className={classes.name}>Виталий Заречнев</span>
            <span className={classes.role}>Senior Frontend Engineer</span>
          </Link>

          <nav className={classes.nav} aria-label='Разделы'>
            {sectionsMeta.map((section) => (
              <Link key={section.id} href={`/#${section.id}`} className={classes.navLink}>
                {section.title}
              </Link>
            ))}
          </nav>

          <div className={classes.actions}>
            <div className={classes.theme} role='radiogroup' aria-label='Оформление'>
              {themes.map((item) => {
                const Icon = item === 'blueprint' ? Moon : Sun;
                const active = selection === item;
                return (
                  <button
                    key={item}
                    type='button'
                    role='radio'
                    aria-checked={active}
                    aria-label={THEME_LABELS[item]}
                    title={THEME_LABELS[item]}
                    className={clsx(classes.themeOption, active && classes.themeOptionActive)}
                    onClick={() => setTheme(item)}
                  >
                    <Icon className={classes.themeIcon} />
                  </button>
                );
              })}
              {custom && (
                <button
                  type='button'
                  role='radio'
                  aria-checked={selection === 'custom'}
                  aria-label={CUSTOM_THEME_LABEL}
                  title={CUSTOM_THEME_LABEL}
                  className={clsx(classes.themeOption, selection === 'custom' && classes.themeOptionActive)}
                  onClick={selectCustom}
                >
                  <SlidersIcon className={classes.themeIcon} />
                </button>
              )}
            </div>

            <ActionButton href={TELEGRAM_HREF} variant='primary' target='_blank' rel='noopener noreferrer' className={classes.cta}>
              Написать
            </ActionButton>
          </div>
        </div>
      </header>
    </>
  );
}
