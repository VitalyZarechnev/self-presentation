# Виталий Заречнев — сайт-визитка

Персональный сайт-визитка Frontend Lead с живыми интерактивными демо-виджетами.
Одностраничная презентация опыта плюс страница `/works` с тремя работающими виджетами,
которые можно потрогать прямо в браузере.

## Технологии

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **TypeScript** в strict-режиме
- **SCSS Modules** (по одному модулю на компонент), темизация через CSS-переменные
- **three.js** — интерактивный глобус (WebGL)
- **TanStack Query** — доступ к данным через тонкую обёртку `createDatasource` / `createUsecase`
- **Zod** — валидация на границах
- **Vitest** + Testing Library — юнит-тесты
- **ESLint** (flat config) + **Prettier** — качество и формат кода

## Возможности

- **Две темы**: `blueprint` (тёмная, по умолчанию) и `barely-there` (светлая).
  Выбор сохраняется в `localStorage` и применяется до первой отрисовки — без «мигания» темы.
- **Страница `/works` с живыми виджетами**:
  - **География поездок** — вращаемый глобус на three.js с городами из поездок (drag, зум по `Ctrl`+колесо / пинчу, клик по городу).
  - **Реалтайм Binance** — поток сделок по WebSocket со спарклайном и деградацией в демо-режим.
  - **Банк «Альбатрос»** — мок мобильного банка: главный экран, аналитика, карта, страховка, перевод, пополнение, чек по операции.
- **Крестики-нолики** на главной — интерактивная демо-игра с ИИ.
- **Опыт работы** — переключение между диаграммой Ганта и таймлайном.
- Доступность: семантические роли, `aria-*`, управление фокусом в модалках, живые области (`aria-live`).
- Кастомная страница **404**.

## Требования

- **Node.js ≥ 22.22.3**

## Быстрый старт

```bash
# установка зависимостей
npm install

# переменные окружения (см. раздел ниже)
cp .env.example .env   # или создайте .env вручную

# режим разработки
npm run dev            # http://localhost:3000

# продакшн-сборка
npm run build
npm run start
```

## Переменные окружения

Все переменные **опциональны** — без них сайт работает, а виджет рынка переходит в демо-режим
(симулированный поток), если WebSocket недоступен.

| Переменная                    | Назначение                                                         |
| ----------------------------- | ------------------------------------------------------------------ |
| `NEXT_PUBLIC_BASE_URL`        | Базовый URL HTTP-клиента (в текущей сборке не используется)        |
| `NEXT_PUBLIC_BINANCE_API_URL` | URL WebSocket-потока Binance; без него рынок показывает демо-поток |

Пример `.env`:

```env
NEXT_PUBLIC_BASE_URL=https://example.com/api
NEXT_PUBLIC_BINANCE_API_URL=wss://stream.binance.com:9443
```

## Скрипты

| Скрипт                   | Что делает                   |
| ------------------------ | ---------------------------- |
| `npm run dev`            | Дев-сервер (Turbopack)       |
| `npm run build`          | Продакшн-сборка              |
| `npm run start`          | Запуск собранного приложения |
| `npm run test`           | Юнит-тесты (Vitest)          |
| `npm run test:watch`     | Тесты в watch-режиме         |
| `npm run tsc`            | Проверка типов без эмита     |
| `npm run eslint`         | Линт с автофиксом            |
| `npm run eslint:check`   | Линт без изменений (для CI)  |
| `npm run prettier`       | Форматирование               |
| `npm run prettier:check` | Проверка форматирования      |

Перед коммитом рекомендуется прогнать полный набор: `tsc` → `eslint:check` → `test` → `prettier:check`.

## Архитектура

Проект построен по принципам чистой архитектуры со **строгими границами между слоями**,
которые проверяются ESLint (`eslint/layer-boundaries.mjs`). Зависимости направлены внутрь —
внешние слои знают о внутренних, но не наоборот.

```
app (маршруты) → views → features → application / ui
                                        │
                          domain ◄──────┘ (data реализует интерфейсы domain)
```

Ключевые правила границ:

- **`domain`** — модели и чистая логика; не импортирует внешние слои (можно `@errors`, `@utils`).
- **`data`** — реализации источников данных, сеть, хранилище; видит только `domain`, `errors`, `utils` и себя.
- **`utils`** — переиспользуемые хелперы; не зависит от других слоёв (можно `@errors`).
- **`ui`** — атомы/молекулы; импортирует только `utils` (изредка enum/модели из `domain`).
- **`features`** — фичи-слайсы; не импортируют `data` и `views` напрямую (данные — через registry / use-cases).
- **`views`** — страничные представления; делегируют доступ к `domain`/`data` в `features`.
- **`app`** — маршруты Next.js; композируют `views`, а не `features`.

### Псевдонимы путей

| Alias            | Каталог             |
| ---------------- | ------------------- |
| `@app/*`         | `app/*`             |
| `@application/*` | `src/application/*` |
| `@assets/*`      | `src/assets/*`      |
| `@data/*`        | `src/data/*`        |
| `@domain/*`      | `src/domain/*`      |
| `@errors/*`      | `src/errors/*`      |
| `@features/*`    | `src/features/*`    |
| `@ui/*`          | `src/ui/*`          |
| `@utils/*`       | `src/utils/*`       |
| `@views/*`       | `src/views/*`       |

### Структура проекта

```
app/                    # Маршруты Next.js (App Router)
  (domain)/page.tsx     # Главная
  works/page.tsx        # Страница работ
  not-found.tsx         # 404
  error.tsx             # Error boundary
  layout.tsx            # Корневой layout, провайдеры, темы, метаданные

src/
  views/                # Страничные представления (home, works, not-found)
  features/             # Фичи: bank, geo-globe, market, tic-tac-toe,
                        #       experience, site-header, works, ...
  ui/                   # atoms, molecules, icons (SVGR)
  domain/               # Модели, интерфейсы источников, чистая логика
  data/                 # Реализации источников, network (http/websocket), storage
  application/          # Провайдеры, DI-контейнер, темизация
  utils/                # Хуки и хелперы
  errors/               # Типы ошибок
  assets/               # Глобальные стили, миксины, токены тем
```

## Темизация

Темы описаны CSS-переменными в `src/assets/styles/themes.scss` и переключаются атрибутом
`data-theme` на `<html>`. Выбор хранится в `localStorage`; чтобы не было «мигания» при
загрузке, небольшой inline-скрипт в `<head>` проставляет тему до первой отрисовки. Компоненты
используют только токены (`--ink`, `--surface`, `--accent`, `--panel-*` и т.д.), поэтому обе
темы работают из коробки.

## Деплой (GitHub Pages)

Проект собирается в статический экспорт (`output: 'export'`) и деплоится на GitHub Pages
через GitHub Actions ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)).

Как включить:

1. **Settings → Pages → Source: GitHub Actions**.
2. (Опционально) завести переменные (**Settings → Secrets and variables → Actions → Variables**):
   - `NEXT_PUBLIC_BINANCE_API_URL` — WebSocket-поток Binance для **живого** рынка (без неё — демо-режим);
   - `NEXT_PUBLIC_SITE_URL` — полный адрес сайта (например `https://<user>.github.io/self-presentation/`),
     нужен для абсолютного `og:image` в мета-тегах;
   - `NEXT_PUBLIC_BASE_URL` — базовый URL HTTP-клиента (в текущей сборке не используется).
3. Пушнуть в `main` — workflow соберёт `out/` и опубликует.

`basePath` задаётся в workflow через `NEXT_PUBLIC_BASE_PATH` (по имени репозитория, например
`/self-presentation`); та же переменная используется для путей к статике (текстуры глобуса).
Для локальной проверки экспорта: `NEXT_PUBLIC_BASE_PATH=/self-presentation npm run build`
и раздать каталог `out/` любым статическим сервером.

Favicon — [app/icon.svg](app/icon.svg) (буква «V» на фоне blueprint). Картинка для соцсетей —
[public/og.png](public/og.png) (1200×630), сгенерирована через `next/og`; подключается в
`openGraph`/`twitter` метаданных [app/layout.tsx](app/layout.tsx).

## Качество кода

- Git-хуки настроены через **Husky** (`prepare`).
- Границы слоёв, неиспользуемые импорты и совместимость с React Compiler проверяются ESLint.
- Стиль кода: комментарии в исходниках намеренно отсутствуют; закругления оставлены только на «типсах»/тегах.
