import { TExperience, TExperienceProject } from './models/Experience';

type TProjectCopy = Pick<TExperienceProject, 'name' | 'description'> & Partial<Pick<TExperienceProject, 'period' | 'role'>>;

export type TExperienceCopy = Pick<TExperience, 'achievements' | 'keyResults'> & {
  company?: string;
  location?: string;
  projects?: readonly TProjectCopy[];
};

// English prose for experienceList; dates, roles, stacks and ids come from the Russian source.
// Company names change only where the original is written in Cyrillic.
export const EXPERIENCE_COPY_EN: Record<string, TExperienceCopy> = {
  'betting-software': {
    location: 'Tomsk',
    achievements: [
      'Built White Label web apps and an admin panel with React + Redux — 10+ projects, including the Paryajpam gaming services aggregator.',
      'Built mini-apps (roulette, keno, horse racing) with Pixi.js, plus live scoreboards.',
      'Responsive cross-browser layout, unit tests with Jest + Enzyme, code review.',
    ],
    projects: [
      {
        name: 'Paryajpam — gaming services aggregator',
        description: 'A White Label web app aggregating betting and games; one of 10+ projects on the platform.',
      },
      {
        name: 'Admin panel',
        description: 'Designed and built a shared admin panel for the White Label products.',
      },
      {
        name: 'Mini-apps and live scoreboards',
        description: 'Gaming mini-apps (roulette, keno, horse racing) on Pixi.js and a live results board.',
      },
    ],
  },
  cbr: {
    company: 'Bank of Russia',
    achievements: [
      'Took over a large project with a heavy backlog and fixed its critical bugs on a tight deadline.',
      'Prioritised and planned the backlog work.',
      'Built reusable UI components and reviewed code.',
    ],
    projects: [
      {
        name: 'Large internal project in maintenance (NDA)',
        description:
          'Took over a project with a heavy backlog and bugs, fixed the critical issues fast and planned the work. Reusable UI components, data processing and display, code review.',
      },
    ],
  },
  'mag-development': {
    company: 'MAG Development',
    location: 'Tomsk',
    achievements: [
      'Developed and maintained kdvonline.ru and yarcheplus.ru; designed a role system for individual and business customers.',
      'Introduced the BEM methodology to the team.',
      'Moved the project to SSR within a year, migrating as much functionality as possible.',
      'Covered code with Jest unit tests.',
    ],
    projects: [
      {
        name: 'kdvonline.ru',
        description:
          'Development and maintenance of an online store: a role system for individual and business customers, the move to SSR.',
      },
      {
        name: 'yarcheplus.ru',
        description: 'Development and maintenance of the service: reusable components, BEM adoption, Jest unit tests.',
      },
    ],
  },
  redmadrobot: {
    location: 'remote',
    keyResults: [
      'Clean Architecture and starter repositories — ×4 faster project start',
      'React SPA → Next.js — First Paint ~×2, Lighthouse 90+',
      'Linting and tests in CI — −40% bugs and fixes',
    ],
    achievements: [
      'Grew from developer to head of the frontend department; the team peaked at 10+ people — hiring, onboarding, 1:1s, mentoring, code review.',
      'Combine hands-on development with management as the technical lead; own architecture, standards and code quality.',
      'Shipped major projects in fintech and banking, Web3 and blockchain, in-flight systems and GenAI products.',
      'Designed a unified frontend architecture on Clean Architecture principles; starter repositories made projects start 4× faster.',
      'Moved a React SPA to Next.js — First Paint roughly 2× faster, Lighthouse Performance 90+.',
      'Wrote Figma plugins that auto-export static assets and variables, removing manual asset copying.',
      'Introduced shared linting and mandatory tests in CI — 40% fewer bugs and fixes.',
      'Bringing AI tools into the team’s engineering culture: automating routine work, tests and refactoring with LLMs.',
    ],
    projects: [
      {
        name: 'GenAI transformation for a major Russian bank (NDA)',
        period: 'Apr 2026 – present',
        description:
          'AI agents inside banking services: chat interfaces and AI prompters on top of SSE streaming. Hiring and onboarding fullstack developers, designing and estimating tasks, quality control and review.',
      },
      {
        name: 'BNPL app for an Islamic bank (NDA)',
        period: 'Dec 2025 – Apr 2026',
        description:
          'Webview apps for the BNPL flow: UI kit and screens, a biometrics web component, autofilled forms, data encryption, banking API integration. Interviews, onboarding and mentoring, process documentation.',
      },
      {
        name: 'redmadrobot.ai — company site with AI search',
        period: 'May – Nov 2025',
        description: 'AI search and suggestions, articles from a headless CMS, AI service integrations.',
      },
      {
        name: 'In-flight entertainment system for VIP aircraft (NDA)',
        period: 'Dec 2023 – May 2025',
        description:
          'A demo rig for an IFE system: UI kit and screens, client apps synced over SSE, media players. Feature design, tech design approval, code quality review.',
      },
      {
        name: '2GIS Ebaba',
        period: 'Sep – Dec 2023',
        description:
          'Admin panel for an internal 2GIS voice service: UI kit and screens. Sprint planning, breakdown and estimates, client communication, tech design approval, review.',
      },
      {
        name: 'Gamified blockchain game (NDA)',
        period: 'Aug – Dec 2023',
        description:
          'A web app that pulls players into a blockchain game. Feature design, tech design approval, quality control and review.',
      },
      {
        name: 'Laundry — self-service chain (NDA)',
        period: 'May – Dec 2023',
        description:
          'A responsive web app for customers and an admin panel, YooKassa payments. Sprint planning, breakdown and estimates, tech design approval, review.',
      },
      {
        name: 'NFT marketplace (NDA)',
        period: 'Dec 2021 – Jun 2023',
        description:
          'A Web3 app for buying and selling NFTs: crypto-wallet sign-in, smart-contract operations, blockchain data parsing (transactions, wallets, contracts), dashboards and charts.',
      },
      {
        name: 'UGMK — initiative funnel analytics',
        period: 'Jun – Aug 2023',
        description: 'Widgets and pages for KPI analysis, shared formatting utilities, Recharts charts.',
      },
      {
        name: 'Vyaduk — warehouse and logistics automation',
        period: 'Dec 2021',
        description: 'Feature design and development, UI kit, widgets and pages, Chart.js charts, code review.',
      },
    ],
  },
};
