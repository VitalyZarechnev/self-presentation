import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { IBM_Plex_Mono, Inter, Playfair_Display } from 'next/font/google';
import { cookies } from 'next/headers';

import ApplicationProvider from '@application/ApplicationProvider';
import { bindServerRequestCookies } from '@application/di/server-cookies-storage/bindServerRequestCookies';
import ThemeProvider from '@application/theme/ThemeProvider';
import { DEFAULT_THEME, isTheme, THEME_COOKIE } from '@application/theme/themes';

import '@assets/styles/index.scss';

const TITLE = 'Виталий Заречнев — Frontend Lead';
const DESCRIPTION =
  'Веду фронтенд от архитектуры до продакшна и команду, которая это делает: финтех, блокчейн, IoT, бортовые системы, AI-интерфейсы.';

export const metadata: Metadata = {
  title: { default: TITLE, template: '%s — Виталий Заречнев' },
  description: DESCRIPTION,
  authors: [{ name: 'Виталий Заречнев' }],
  keywords: ['фронтенд', 'Frontend Lead', 'React', 'TypeScript', 'финтех', 'блокчейн', 'IoT'],
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Виталий Заречнев',
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary',
    title: TITLE,
    description: DESCRIPTION,
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

export default async function RootLayout({ children }: { children: ReactNode }) {
  await bindServerRequestCookies();

  const cookieStore = await cookies();
  const cookieTheme = cookieStore.get(THEME_COOKIE)?.value;
  const theme = isTheme(cookieTheme) ? cookieTheme : DEFAULT_THEME;

  return (
    <html lang='ru' data-theme={theme} className={`${inter.variable} ${playfair.variable} ${plexMono.variable}`}>
      <body>
        <ApplicationProvider>
          <ThemeProvider initialTheme={theme}>{children}</ThemeProvider>
        </ApplicationProvider>
      </body>
    </html>
  );
}
