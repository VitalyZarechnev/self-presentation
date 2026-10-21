import { TLocalized } from '@domain/locale/locale';

import { EXPERIENCE_COPY_EN } from './experienceListEn';
import { TExperience } from './models/Experience';

const experienceRu: readonly TExperience[] = [
  {
    id: 'betting-software',
    company: 'Betting Software',
    role: 'Frontend Developer',
    location: 'Томск',
    start: { year: 2017, month: 9 },
    end: { year: 2019, month: 10 },
    officialFrom: { year: 2018, month: 4, day: 10 },
    stack: ['React', 'Redux', 'Pixi.js', 'Jest', 'Enzyme', 'Stylus'],
    achievements: [
      'Разрабатывал «White Label» веб-приложения и админ-панель на React + Redux — более 10 проектов, включая агрегатор игровых сервисов Paryajpam.',
      'Создавал мини-приложения (рулетка, кено, horse racing) на Pixi.js и онлайн-табло.',
      'Адаптивная кроссбраузерная вёрстка, unit-тесты на Jest + Enzyme, код-ревью.',
    ],
    projects: [
      {
        name: 'Paryajpam — агрегатор игровых сервисов',
        description: 'White Label веб-приложение агрегатора ставок и игр; один из 10+ проектов на платформе.',
        stack: ['React', 'Redux', 'Stylus'],
      },
      {
        name: 'Административная панель',
        description: 'Проектирование и разработка общей админ-панели для White Label продуктов.',
        stack: ['React', 'Redux'],
      },
      {
        name: 'Мини-приложения и онлайн-табло',
        description: 'Игровые мини-приложения (рулетка, кено, horse racing) на Pixi.js и онлайн-табло результатов.',
        stack: ['Pixi.js', 'React', 'Jest', 'Enzyme'],
      },
    ],
  },
  {
    id: 'cbr',
    company: 'Центробанк РФ',
    role: 'Frontend Developer',
    start: { year: 2019, month: 11 },
    end: { year: 2020, month: 7 },
    stack: ['React', 'Redux', 'Single-SPA', 'SCSS'],
    achievements: [
      'Принял на поддержку крупный проект с большим бэклогом и в сжатые сроки устранил критические баги.',
      'Приоритизировал и спланировал работу над задачами бэклога.',
      'Разрабатывал переиспользуемые UI-компоненты, вёл ревью кода.',
    ],
    projects: [
      {
        name: 'Крупный внутренний проект на поддержке (NDA)',
        description:
          'Принял проект с большим бэклогом и багами, в сжатые сроки устранил критические ошибки и спланировал работу. Переиспользуемые UI-компоненты, обработка и отображение данных, ревью кода.',
        stack: ['React', 'Redux', 'Single-SPA', 'SCSS'],
      },
    ],
  },
  {
    id: 'mag-development',
    company: 'МАГ Девелопмент',
    role: 'Frontend Developer',
    location: 'Томск',
    start: { year: 2020, month: 7 },
    end: { year: 2021, month: 12 },
    stack: ['React', 'TypeScript', 'Redux-Saga', 'SSR'],
    achievements: [
      'Развивал и поддерживал kdvonline.ru и yarcheplus.ru; спроектировал ролевую систему для физ- и юрлиц.',
      'Инициировал внедрение методологии БЭМ в команде.',
      'Перевёл проект на SSR за год — мигрировал максимум возможного функционала.',
      'Покрывал код unit-тестами на Jest.',
    ],
    projects: [
      {
        name: 'kdvonline.ru',
        description: 'Развитие и поддержка интернет-магазина: ролевая система для физических и юридических лиц, перевод на SSR.',
        stack: ['React', 'TypeScript', 'Redux-Saga', 'SSR'],
      },
      {
        name: 'yarcheplus.ru',
        description: 'Развитие и поддержка сервиса: переиспользуемые компоненты, внедрение БЭМ, unit-тесты на Jest.',
        stack: ['React', 'TypeScript', 'Redux-Saga', 'Jest'],
      },
    ],
  },
  {
    id: 'redmadrobot',
    company: 'red_mad_robot',
    role: 'Head of Frontend',
    location: 'удалённо',
    start: { year: 2021, month: 12 },
    end: null,
    stack: ['React', 'Vue', 'TypeScript', 'Next.js'],
    keyResults: [
      'Clean Architecture и стартовые репозитории — старт разработки ×4',
      'React SPA → Next.js — First Paint ~×2, Lighthouse 90+',
      'Линтинг и тесты в CI — −40% багов и фиксов',
    ],
    achievements: [
      'Вырос от разработчика до руководителя отдела фронтенда; команда более 10 человек в пике — найм, онбординг, 1:1, менторинг, код-ревью.',
      'Совмещаю разработку и управление, оставаясь техническим лидером; отвечаю за архитектуру, стандарты и качество кода.',
      'Вывел в продакшн крупные проекты в финтехе и банкинге, Web3 и блокчейне, in-flight системах и GenAI-продуктах.',
      'Спроектировал единую фронтенд-архитектуру на принципах Clean Architecture; стартовые репозитории ускорили старт разработки в 4 раза.',
      'Перевёл React SPA на Next.js — ускорил First Paint примерно в 2 раза; довёл Lighthouse Performance до 90+.',
      'Написал плагины Figma для автоэкспорта статики и переменных — исключил ручное копирование ассетов.',
      'Внедрил единый линтинг и обязательные тесты в CI — снизил количество багов и фиксов на 40%.',
      'Внедряю AI-инструменты в инженерную культуру команды: автоматизация рутины, тесты и рефакторинг с помощью LLM.',
    ],
    projects: [
      {
        name: 'GenAI-трансформация для крупного банка РФ (NDA)',
        period: 'Апр 2026 – н.в.',
        role: 'Frontend / Chapter Lead',
        description:
          'Внедрение AI-агентов в банковские сервисы, разработка чатовых интерфейсов и AI-суфлёров поверх SSE-стриминга. Найм и онбординг fullstack-разработчиков, проектирование и оценка задач, контроль качества и ревью.',
        stack: ['React', 'TanStack Query', 'SSE', 'Playwright'],
      },
      {
        name: 'BNPL-приложение исламского банка (NDA)',
        period: 'Дек 2025 – апр 2026',
        role: 'Chapter Lead',
        description:
          'Webview-приложения для процесса BNPL: UI-Kit и экраны, веб-компонент биометрии, формы с автозаполнением, шифрование данных, интеграция банковского API. Собеседования, онбординг и менторинг, документирование процессов.',
        stack: ['Vue 3', 'Nuxt', 'Vite', 'Pinia', 'Vee-validate', 'Zod', 'Vitest'],
      },
      {
        name: 'redmadrobot.ai — сайт компании с AI-поиском',
        period: 'Май – ноя 2025',
        description: 'Интеграция AI-поиска и подсказок, вывод статей из headless-CMS, интеграция AI-сервисов.',
        stack: ['React', 'Next.js', 'TanStack Query', 'Zod', 'Strapi', 'Vitest'],
      },
      {
        name: 'In-flight развлекательная система для VIP-бортов (NDA)',
        period: 'Дек 2023 – май 2025',
        description:
          'Демо-стенд IFE-системы: UI-Kit и экраны, синхронизация клиентских приложений по SSE, медиаплееры. Проектирование фичей, аппрув техдизайна, ревью качества кода.',
        stack: ['React', 'Vite', 'TanStack Query', 'React Spring', 'Video.js', 'OpenPlayer.js', 'Three.js', 'Cesium'],
      },
      {
        name: '2GIS Ebaba',
        period: 'Сен – дек 2023',
        description:
          'Административная панель для внутреннего голосового сервиса 2ГИС: UI-Kit и экраны. Планирование спринтов, декомпозиция и оценка, коммуникация с заказчиком, аппрув техдизайна, ревью.',
        stack: ['React', 'Next.js', 'TanStack Query', 'Zod', 'MUI'],
      },
      {
        name: 'Блокчейн-игра с геймификацией (NDA)',
        period: 'Авг – дек 2023',
        description:
          'Веб-приложение для вовлечения игроков в блокчейн-игру. Проектирование фичей, аппрув техдизайна, контроль качества и ревью.',
        stack: ['React', 'Next.js', 'Radix UI', 'Wagmi', 'TanStack Query', 'React Spring', 'Tailwind', 'Jest'],
      },
      {
        name: 'Laundry — сеть самообслуживания (NDA)',
        period: 'Май – дек 2023',
        description:
          'Адаптивное веб-приложение для клиентов и панель администраторов, интеграция оплаты ЮKassa. Планирование спринтов, декомпозиция и оценка, аппрув техдизайна, ревью.',
        stack: ['React', 'Next.js', 'TanStack Query', 'Recharts', 'Zod', 'MUI', 'Jest'],
      },
      {
        name: 'NFT-маркетплейс (NDA)',
        period: 'Дек 2021 – июн 2023',
        role: 'TeamLead',
        description:
          'Web3-приложение для покупки и продажи NFT: авторизация через криптокошелёк, операции через смарт-контракты, парсинг блокчейн-данных (транзакции, кошельки, контракты), дашборды и графики.',
        stack: ['Vue 3', 'Vitedge', 'Vuex', 'Vitest', 'Ethers.js', 'Highcharts'],
      },
      {
        name: 'УГМК — аналитика воронки инициатив',
        period: 'Июн – авг 2023',
        role: 'Frontend',
        description: 'Виджеты и страницы для анализа ключевых показателей, общие утилиты форматирования, графики на Recharts.',
        stack: ['React', 'Next.js', 'Recharts'],
      },
      {
        name: 'Vyaduk — автоматизация склада и логистики',
        period: 'Дек 2021',
        role: 'Frontend',
        description: 'Проектирование и разработка фичей, UI-Kit, виджеты и страницы, графики на Chart.js, ревью кода.',
        stack: ['React', 'Next.js', 'MobX', 'Chart.js'],
      },
    ],
  },
];

function translate(item: TExperience): TExperience {
  const copy = EXPERIENCE_COPY_EN[item.id];
  if (!copy) return item;
  return {
    ...item,
    company: copy.company ?? item.company,
    location: item.location && (copy.location ?? item.location),
    achievements: copy.achievements ?? item.achievements,
    keyResults: copy.keyResults ?? item.keyResults,
    projects: item.projects?.map((project, index) => ({ ...project, ...copy.projects?.[index] })),
  };
}

export const experienceList: TLocalized<readonly TExperience[]> = { ru: experienceRu, en: experienceRu.map(translate) };
