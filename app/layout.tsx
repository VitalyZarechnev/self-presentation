import { ReactNode } from 'react';
import type { Metadata } from 'next';

import ApplicationProvider from '@application/ApplicationProvider';
import LocaleProvider from '@application/locale/LocaleProvider';
import ThemeProvider from '@application/theme/ThemeProvider';
import { DEFAULT_THEME } from '@application/theme/themes';

import '@assets/fonts/fonts.css';
import '@assets/styles/index.scss';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const THEME_INIT_SRC = `${BASE_PATH}/theme-init.js`;
const LOCALE_INIT_SRC = `${BASE_PATH}/locale-init.js`;

const TITLE = 'Виталий Заречнев — Senior Frontend Engineer';
const DESCRIPTION =
  'Веду фронтенд от архитектуры до продакшна и команду, которая это делает: Clean Architecture, живые демо, финтех, блокчейн, IoT, бортовые системы, AI-интерфейсы.';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
const OG_IMAGE = { url: 'og.png', width: 1200, height: 630, alt: TITLE };

export const metadata: Metadata = {
  metadataBase: SITE_URL ? new URL(SITE_URL.replace(/\/?$/, '/')) : undefined,
  title: { default: TITLE, template: '%s — Виталий Заречнев' },
  description: DESCRIPTION,
  authors: [{ name: 'Виталий Заречнев' }],
  keywords: ['фронтенд', 'Senior Frontend', 'Frontend Lead', 'React', 'TypeScript', 'финтех', 'блокчейн', 'IoT'],
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Виталий Заречнев',
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang='ru'
      data-theme={DEFAULT_THEME}
      suppressHydrationWarning
    >
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src={THEME_INIT_SRC} />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src={LOCALE_INIT_SRC} />
      </head>
      <body>
        <ApplicationProvider>
          <LocaleProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </LocaleProvider>
        </ApplicationProvider>
      </body>
    </html>
  );
}
