import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { IBM_Plex_Mono, Inter, Playfair_Display } from 'next/font/google';

import ApplicationProvider from '@application/ApplicationProvider';
import ThemeProvider from '@application/theme/ThemeProvider';
import { DEFAULT_THEME } from '@application/theme/themes';

import '@assets/styles/index.scss';

const THEME_INIT_SRC = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/theme-init.js`;

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

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
});

const playfair = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700'],
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-plex-mono',
  weight: ['400', '500', '600'],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang='ru'
      data-theme={DEFAULT_THEME}
      className={`${inter.variable} ${playfair.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src={THEME_INIT_SRC} />
      </head>
      <body>
        <ApplicationProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </ApplicationProvider>
      </body>
    </html>
  );
}
