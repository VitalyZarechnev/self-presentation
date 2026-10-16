---
name: Виталий Заречнев — Frontend Lead
description: Сайт-визитка в двух темах — инженерная синька и тетрадный лист
colors:
  blueprint-surface: "#0e2233"
  blueprint-surface-raised: "#123049"
  blueprint-surface-grid: "rgba(120, 170, 230, 0.1)"
  blueprint-line: "#1f4a70"
  blueprint-ink: "#eaf3ff"
  blueprint-ink-muted: "#82abd6"
  blueprint-accent: "#5db0ff"
  blueprint-accent-soft: "rgba(93, 176, 255, 0.14)"
  blueprint-page-frame: "rgba(93, 176, 255, 0.28)"
  blueprint-danger: "#ff6b6b"
  blueprint-positive: "#5ad38f"
  paper-surface: "#faf7f0"
  paper-surface-raised: "#fffdf8"
  paper-surface-grid: "#e9e4d8"
  paper-line: "#d9d3c6"
  paper-ink: "#20201d"
  paper-ink-muted: "#737168"
  paper-accent-soft: "#efeae0"
  paper-margin-rule: "#e2a8a8"
  paper-danger: "#d64545"
  paper-positive: "#2f8f5b"
typography:
  display:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "54px"
    fontWeight: 400
    lineHeight: 1.08
  display-paper:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "54px"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "40px"
    fontWeight: 500
    lineHeight: "48px"
    letterSpacing: "0.06em"
  title:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "26px"
    fontWeight: 500
    lineHeight: "34px"
    letterSpacing: "0.06em"
  title-small:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "18px"
    fontWeight: 500
    lineHeight: "24px"
    letterSpacing: "0.06em"
  lead:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: 1.3
  stat:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "42px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
    letterSpacing: "-0.14px"
  control:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 500
  label-action:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "12px"
    letterSpacing: "0.1em"
  label:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "11px"
    lineHeight: 1.35
    letterSpacing: "0.08em"
rounded:
  panel: "0"
  focus: "2px"
  tag: "4px"
  pill: "999px"
spacing:
  gutter-mobile: "14px"
  gutter: "24px"
  section-head: "26px"
  grid-cell: "42px"
  section-gap: "88px"
  content-max: "900px"
  header-max: "1100px"
components:
  action-primary:
    backgroundColor: "{colors.blueprint-accent}"
    textColor: "{colors.blueprint-surface}"
    typography: "{typography.label-action}"
    rounded: "{rounded.panel}"
    padding: "12px 22px"
  action-primary-hover:
    backgroundColor: "transparent"
    textColor: "{colors.blueprint-accent}"
  action-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.blueprint-accent}"
    typography: "{typography.label-action}"
    rounded: "{rounded.panel}"
    padding: "12px 22px"
  action-secondary-hover:
    backgroundColor: "{colors.blueprint-accent}"
    textColor: "{colors.blueprint-surface}"
  tag:
    backgroundColor: "{colors.blueprint-accent-soft}"
    textColor: "{colors.blueprint-ink-muted}"
    rounded: "{rounded.tag}"
    padding: "4px 8px"
  stat:
    backgroundColor: "{colors.blueprint-surface-raised}"
    textColor: "{colors.blueprint-ink}"
    typography: "{typography.stat}"
    rounded: "{rounded.panel}"
    padding: "24px 20px"
  stat-hover:
    backgroundColor: "{colors.blueprint-accent-soft}"
  segmented-option:
    textColor: "{colors.blueprint-ink-muted}"
    typography: "{typography.control}"
    rounded: "{rounded.panel}"
    padding: "7px 16px"
  segmented-option-active:
    backgroundColor: "{colors.blueprint-surface-raised}"
    textColor: "{colors.blueprint-ink}"
  panel:
    backgroundColor: "{colors.blueprint-surface-raised}"
    rounded: "{rounded.panel}"
    padding: "18px 20px"
  market-ticker:
    backgroundColor: "{colors.blueprint-surface-raised}"
    textColor: "{colors.blueprint-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.panel}"
    width: "360px"
  demo-card:
    backgroundColor: "{colors.blueprint-surface-raised}"
    textColor: "{colors.blueprint-ink}"
    rounded: "{rounded.panel}"
    padding: "20px 20px 22px"
  demo-card-link:
    textColor: "{colors.blueprint-accent}"
    typography: "{typography.label-action}"
---

# Design System: Виталий Заречнев — Frontend Lead

## Overview

**Creative North Star: "Чертёж и черновик"**

Один и тот же документ существует в двух состояниях. **Blueprint** (тема по умолчанию) — инженерная синька: тёмно-синее поле, голубая разметочная сетка, моноширинные заголовки капсом с разрядкой, тонкая рамка по периметру экрана. **Barely-There** — тот же лист, но на тёплой бумаге: бежевая клетка, красная линия полей слева, как в тетради, и заголовки антиквой Playfair вместо моноширинного шрифта. Структура, отступы и компоненты в обеих темах одинаковые; меняются только материал и голос шрифта.

Система плоская и строгая. Глубина передаётся тоном поверхностей (поле → приподнятая панель) и тонкими линиями, а не тенями. Углы панелей острые. Плотность средняя: короткие текстовые блоки, крупные цифры, мелкие моноширинные подписи. Сетка фона — часть материала, а не украшение: размер клетки (42px) задаёт отступы, например сдвиг игры на главной ровно на одну клетку.

Темы переключаются вживую и без мигания (тема применяется до первой отрисовки), с мягким перетеканием цветов за 0.3s.

**Key Characteristics:**
- Две темы на общих токенах: все цвета и шрифты меняются через CSS-переменные на `[data-theme]`.
- Моноширинный шрифт как голос инженера: индексы разделов («01»), подписи, цифры, кнопки действий.
- Плоские панели с острыми углами; глубина — тоном, а не тенью.
- Сетка-клетка на фоне задаёт ритм и масштаб.
- Один акцент на тему, и в светлой теме он совпадает с цветом текста.

## Colors

Две палитры с одинаковыми ролями: холодная синька с одним голубым акцентом и тёплая бумага, где акцентом служит сам цвет чернил.

### Primary
- **Чертёжный голубой** (blueprint-accent): единственный акцент синьки. Обводка и заливка кнопок действий, кольцо фокуса, граница тега при наведении. В Barely-There роль акцента исполняет **Тушь** (paper-ink): акцент равен цвету текста, поэтому светлая тема монохромна.

### Neutral
- **Ночная синька** (blueprint-surface): поле страницы в тёмной теме.
- **Приподнятая синька** (blueprint-surface-raised): панели — статистика, Гант, таймлайн, активный сегмент.
- **Разметочная сетка** (blueprint-surface-grid): клетка фона и разделители строк внутри панелей.
- **Линия чертежа** (blueprint-line): границы панелей, шапки, тегов.
- **Белый мел** (blueprint-ink): основной текст и цифры.
- **Выцветший голубой** (blueprint-ink-muted): вторичный текст, подписи, неактивные пункты навигации.
- **Голубая дымка** (blueprint-accent-soft): подложка тегов и сегментов, фон строки при наведении.
- **Рамка листа** (blueprint-page-frame): тонкая рамка по периметру экрана с отступом 12px.
- **Тетрадная бумага** (paper-surface) и **Светлый лист** (paper-surface-raised): поле и панели светлой темы. Панели в Barely-There используют цвет поля и не имеют границы: лист цельный.
- **Карандашная клетка** (paper-surface-grid) и **Карандашная линия** (paper-line): сетка и границы.
- **Тушь** (paper-ink) и **Графит** (paper-ink-muted): основной и вторичный текст.
- **Бумажная подложка** (paper-accent-soft): подложка тегов, сегментов и наведения.
- **Красная линия полей** (paper-margin-rule): вертикальная линия слева от контента, только в светлой теме.

### Status
- **danger** и **positive** (по паре на тему): только для данных — рост и падение на рынке, ошибки, приход и расход в банке. Не используются для декора.

### Named Rules
**The One Accent Rule.** На тему один акцент. В Blueprint это голубой, в Barely-There — тушь. Второй декоративный цвет не вводится.

**The Theme Token Rule.** Любой цвет в новом UI берётся из токенов темы (`--surface`, `--ink`, `--accent`, `--line` и т. д.). Шестнадцатеричный цвет прямо в компоненте — ошибка: он сломает вторую тему.

## Typography

**Display Font:** IBM Plex Mono (в Blueprint) / Playfair Display (в Barely-There), с запасными ui-monospace и Georgia
**Body Font:** Inter (с запасным system-ui)
**Label/Mono Font:** IBM Plex Mono

**Character:** Голос заголовков меняется вместе с темой: в синьке это моноширинная разметка капсом с разрядкой 0.06em, как надписи на чертеже; на бумаге — антиква с лёгким отрицательным трекингом, как заголовок в записной книжке. Inter остаётся нейтральным рабочим текстом в обеих темах.

### Hierarchy
- **Display** (400, 54px → 32px на мобильном, 1.08): только заголовок героя на главной, ширина до 22ch. В Blueprint — IBM Plex Mono капсом с разрядкой темы, в Barely-There — Playfair Display.
- **Headline** (500, 40px/48px → 24px/32px на мобильном): h1 страниц.
- **Title** (500, 26px/34px): заголовки разделов рядом с индексом «01»–«06».
- **Title Small** (500, 18px/24px): h3 — название карточки демо и работы в списке работ.
- **Lead** (400, 22px → 18px на мобильном, 1.3): подзаголовок героя шрифтом заголовков темы, ширина до 34ch, цвет вторичного текста.
- **Stat** (500, 42px, 1): крупные цифры в блоке «В цифрах».
- **Body** (Inter 400, 14px/20px): описательный текст; подписи разделов — 14px до 60ch.
- **Control** (Inter 500, 13px): ссылки разделов в шапке и опции сегментированного контрола.
- **Label Action** (Plex Mono, 12px, 0.1em, капс): подписи действий — кнопки действий, ссылка «Открыть демо» на карточке. На том же 12px с разрядкой 0.08em стоят заголовок списка дополнительных демо и пара инструментов в тикере.
- **Label** (Plex Mono, 11px, 0.08em, капс): надзаголовки, подписи цифр, индексы разделов (12px, 0.1em), каналы рынка (0.14em), ссылка «Весь виджет» в тикере. Деления осей и периоды — 10–10.5px.

### Named Rules
**The Mono Speaks Data Rule.** Всё, что является данными или разметкой — индексы, цифры, подписи осей, кнопки действий, — набирается Plex Mono. Inter — только для связного текста.

**The Theme Owns Headings Rule.** Регистр и разрядку заголовков задают переменные темы (`--heading-transform`, `--heading-tracking`); компонент не прописывает `uppercase` сам.

## Layout

Одна колонка контента шириной до 900px по центру, с отступами 24px по бокам и 44px слева: там проходит линия полей. Разделы отделены друг от друга на 88px; голова раздела — индекс плюс заголовок и подпись, отступ до контента 26px. Шапка липкая, внутренняя ширина до 1100px, полупрозрачный фон с размытием 10px.

Фон — клетка 42px из линий `--surface-grid`. Герой занимает высоту экрана минус шапку и центрирован; на мобильном он становится обычным блоком от верха.

Брейкпоинты: 600px — мобильная раскладка (меньше шрифты, отступы 14px, линия полей ближе к краю); 860px — навигация в шапке скрывается. Широкие панели (Гант, минимум 560px) прокручиваются по горизонтали внутри себя, а не страница целиком.

## Elevation & Depth

Система плоская. Глубина — тональная: поле → приподнятая панель → голубая дымка при наведении. Тени почти не используются и не несут структуры. Единственная системная тень — едва заметная подложка активного сегмента в переключателях. Более тяжёлые тени живут только внутри демо-виджетов (банк, карточки), это часть их собственных миров.

### Shadow Vocabulary
- **Активный сегмент** (`box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08)`): выбранная опция переключателя темы и сегментированного контрола.
- **Ореол узла** (`box-shadow: 0 0 0 4px var(--accent-soft)`, при наведении 6px): мягкое кольцо вокруг узла на таймлайне опыта.

### Named Rules
**The Flat-By-Default Rule.** Панели плоские в покое. Отделение от фона — тоном `--panel-surface` и линией `--panel-line`, никогда тенью.

## Shapes

Прямые углы — правило: панели, кнопки, сегменты и переключатель темы используют `--panel-radius` (0). Небольшое скругление допустимо только у мелких элементов: тег (4px), обводка фокуса (2px). Круги — только для точек данных и маркеров. Скругления 12–20px встречаются лишь внутри мока мобильного банка и принадлежат ему. Точно так же собственные радиусы виджетов — плашка результата в крестиках-ноликах (6px), полосы Ганта (5px) — сознательные исключения, которыми владеют сами виджеты; рамка встраивания следует `--panel-radius` (0), её 12px — лишь запасное значение вне темы.

Линии тонкие, 1px. Выносная точка — круг 5px на конце выносной линии 1px: так подпись чертежа указывает на деталь, которую называет. Рамка листа по периметру экрана (отступ 12px) и линия полей — фирменные силуэты тем.

## Components

### Buttons (Action Button)
Чертёжная кнопка: моноширинная подпись капсом, острые углы, обводка акцентом.
- **Shape:** прямые углы (0), обводка 1px цветом акцента.
- **Primary:** заливка акцентом, текст цветом поля; Plex Mono 12px, разрядка 0.1em, отступы 12px 22px.
- **Secondary:** прозрачный фон, текст и обводка акцентом.
- **Hover:** варианты меняются местами — primary становится контурной, secondary заливается. Переход 0.15s ease.
- **Focus:** общее кольцо 2px акцентом со смещением 2px.

### Chips (Tag)
- **Style:** подложка `--accent-soft`, текст вторичного цвета, граница 1px `--line`, скругление 4px, 11px.
- **State:** при наведении текст становится основным, граница — акцентной, тег поднимается на 1px.

### Cards / Containers (Panel)
- **Corner Style:** прямые углы (`--panel-radius`).
- **Background:** `--panel-surface` — приподнятая синька в Blueprint, цвет листа в Barely-There.
- **Shadow Strategy:** нет, см. Elevation & Depth.
- **Border:** `--panel-line` — линия чертежа в синьке, прозрачная на бумаге.
- **Internal Padding:** 18px 20px (Гант, таймлайн), 24px 20px (ячейка статистики).

### Stat
Ячейка «В цифрах»: цифра шрифтом заголовков 42px над моноширинной подписью 11px. При наведении фон становится `--accent-soft`.

### Segmented Control / Theme Switch
- **Style:** подложка `--accent-soft`, граница `--line`, внутренний отступ 3px, промежуток 2px, опции 13px/500.
- **Active:** фон `--surface-raised`, основной цвет текста, тень активного сегмента.

### Navigation (Site Header)
- **Style:** липкая шапка, фон `--surface-blur` с размытием 10px, нижняя линия `--line`. Слева имя (15px/600) и роль (11px), по центру ссылки разделов (13px, вторичный цвет → основной при наведении), справа переключатель темы.
- **Mobile:** ссылки разделов скрыты ниже 860px, остаются имя и переключатель.

### Gantt / Timeline (Signature)
Опыт работы как инженерная диаграмма: строки по 60px с колонкой подписей 160px, ось времени с делениями 10px моноширинным шрифтом, разделители строк цветом сетки. Строка при наведении получает `--accent-soft`, полоса становится ярче (`brightness(1.08)`). Переключение Гант ↔ таймлайн — сегментированным контролом.

### Market Ticker (Signature)
Тикер в герое — панель чертежа с выносками.
- **Shape:** плоская панель `--panel-surface`, граница 1px `--line` в обеих темах (не `--panel-line`: на бумаге панель тоже очерчена), прямые углы; ширина до 360px справа от лида, на узком экране — во всю колонку под лидом.
- **Content:** пара инструментов и пауза; цена (Plex Mono 30px/600 → 26px на мобильном) цветом основного текста; изменение (13px) — единственное место, которое несёт `--positive` / `--danger`; статус потока с точкой 7px; спарклайн на canvas; четыре строки ленты сделок (на мобильном две). Разделы панели разделены линиями 1px `--line`, цифры — табличные.
- **Blueprint callouts:** мелкие моноширинные подписи (11px, вторичный цвет) сидят прямо на линии 1px панели, фон подложки разрывает линию; от подписи вниз идёт выносная линия 1px (9px), на конце точка 5px указывает в деталь, которую подпись называет (datasource, canvas, MarketFeed → useSyncExternalStore).
- **Link:** «Весь виджет» внизу справа — Plex Mono 11px капсом цветом акцента со стрелкой SVG 14px; при наведении подчёркивание со смещением 3px.

### Demo Card
Карточка живого демо: плоская панель, на которую положен настоящий снимок виджета.
- **Shape:** `--panel-surface`, граница 1px `--line`, прямые углы, без тени.
- **Preview:** растровый снимок реального виджета (по снимку на тему) сверху, 4:3 (16:10 на мобильном); в широкой раскладке снимок слева (1.5fr к 1fr, от 340px высотой) и отделён линией 1px.
- **Body:** h3 (Title Small), описание вторичным цветом до 52ch, теги, внизу ссылка «Открыть демо» (Label Action) цветом акцента со стрелкой SVG 14px. Отступы 20px 20px 22px, в широкой раскладке 28px; промежутки 12px.
- **Hover:** стрелка сдвигается на 4px вправо, снимок увеличивается до 1.03; плавно, `cubic-bezier(0.16, 1, 0.3, 1)` за 0.25–0.4s.
- **Grid:** две колонки с промежутком 16px, одна ниже 860px; главная карточка и строчная занимают всю ширину.

## Do's and Don'ts

### Do:
- **Do** брать цвета, шрифты, радиус и регистр заголовков только из переменных темы, чтобы компонент работал в обеих темах без правок.
- **Do** набирать цифры, индексы, подписи и кнопки действий шрифтом Plex Mono (`--font-mono`).
- **Do** отделять панели тоном (`--panel-surface`) и линией (`--panel-line`), углы — `--panel-radius`.
- **Do** выравнивать крупные смещения по клетке сетки (`--surface-grid-cell`, 42px).
- **Do** проверять каждую новую поверхность в обеих темах и на ширине до 600px.
- **Do** брать стрелки в элементах управления из авторских SVG-иконок `src/ui/icons`; типографские стрелки (→) — только внутри нотации потока данных.
- **Do** уважать `prefers-reduced-motion`: глобальные переходы цвета и плавная прокрутка уже отключаются в этом режиме.

### Don't:
- **Don't** использовать старую палитру из `colors.scss` (жёлтый `--core-primary`, `--bg-*`, `--but-*`, `--text-label-*`, `--icon-*`, `--divider-*`). Это наследие, она не входит в систему и не переключается вместе с темой.
- **Don't** вводить второй акцентный цвет или красить декор цветами `--danger` и `--positive`: они только для данных.
- **Don't** добавлять тени панелям и карточкам для «объёма».
- **Don't** скруглять панели и кнопки; скругление допустимо только у тегов (4px) и точек данных.
- **Don't** прописывать `text-transform: uppercase` в заголовках вручную: регистр задаёт тема.
- **Don't** красить крупную цифру (цену, главное значение) по направлению тика: `--positive` и `--danger` несёт только значение изменения.
