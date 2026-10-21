'use client';

import clsx from 'clsx';
import Link from 'next/link';

import { useLocale } from '@application/locale/LocaleProvider';
import { LOCALE_LABELS } from '@application/locale/locales';
import { useTheme } from '@application/theme/ThemeProvider';
import { THEME_LABELS } from '@application/theme/themes';

import ActionButton from '@ui/atoms/action-button/ActionButton';
import Moon from '@ui/icons/moon.svg';
import SlidersIcon from '@ui/icons/sliders.svg';
import Sun from '@ui/icons/sun.svg';

import { sectionsMeta } from './sections';
import classes from './SiteHeader.module.scss';

const TELEGRAM_HREF = 'https://t.me/VitalyZarechnev';

const MESSAGES = {
  ru: { skip: 'Перейти к содержимому', name: 'Виталий Заречнев', nav: 'Разделы', theme: 'Оформление', custom: 'Своя', write: 'Написать' },
  en: { skip: 'Skip to content', name: 'Vitaly Zarechnev', nav: 'Sections', theme: 'Appearance', custom: 'Custom', write: 'Message me' },
} as const;

export default function SiteHeader() {
  const { themes, selection, custom, setTheme, selectCustom } = useTheme();
  const { locale, setLocale } = useLocale();
  const t = MESSAGES[locale];
  const otherLocale = locale === 'ru' ? 'en' : 'ru';

  return (
    <>
      <a href='#content' className={classes.skip}>
        {t.skip}
      </a>
      <header className={classes.header}>
        <div className={classes.inner}>
          <Link href='/' className={classes.brand}>
            <span className={classes.name}>{t.name}</span>
            <span className={classes.role}>Senior Frontend Engineer</span>
          </Link>

          <nav className={classes.nav} aria-label={t.nav}>
            {sectionsMeta[locale].map((section) => (
              <Link key={section.id} href={`/#${section.id}`} className={classes.navLink}>
                {section.title}
              </Link>
            ))}
          </nav>

          <div className={classes.actions}>
            <div className={classes.theme} role='radiogroup' aria-label={t.theme}>
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
                  aria-label={t.custom}
                  title={t.custom}
                  className={clsx(classes.themeOption, selection === 'custom' && classes.themeOptionActive)}
                  onClick={selectCustom}
                >
                  <SlidersIcon className={classes.themeIcon} />
                </button>
              )}
            </div>

            <button
              type='button'
              lang={otherLocale}
              aria-label={LOCALE_LABELS[otherLocale].switchTo}
              title={LOCALE_LABELS[otherLocale].switchTo}
              className={classes.lang}
              onClick={() => setLocale(otherLocale)}
            >
              {LOCALE_LABELS[otherLocale].short}
            </button>

            <ActionButton href={TELEGRAM_HREF} variant='primary' target='_blank' rel='noopener noreferrer' className={classes.cta}>
              {t.write}
            </ActionButton>
          </div>
        </div>
      </header>
    </>
  );
}
