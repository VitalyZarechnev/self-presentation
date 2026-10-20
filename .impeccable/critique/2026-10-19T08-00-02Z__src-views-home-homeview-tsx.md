---
target: главная после слияния PR
total_score: 23
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 1
target_identity: "file:/Users/developer/projects/ZV_demo/src/views/home/HomeView.tsx"
target_fingerprint: "sha256:69393a4a721362dd1762341f6751f74ea78662ef7aae40e862ddd20102535ce9"
target_path: /Users/developer/projects/ZV_demo/src/views/home/HomeView.tsx
timestamp: 2026-10-19T08-00-02Z
slug: src-views-home-homeview-tsx
---
Method: dual-agent (A: a440f7ce5920eb659 · B: a8f454403e40e1c2a)

## Heuristics (7, 10 n/a — Persuade)
1 Status 3 — «Своя» тема теряется при перезагрузке молча
2 Real world 3 — английские имена тем, хуки в выносках без перевода «что это доказывает»
3 Control 3 — нет навигации по разделам на мобильном
4 Consistency 2 — растровые превью демо нарушают правила DESIGN.md (цветная крупная цена), не перекрашиваются темой; Jest/Enzyme в навыках при Vitest на сайте
5 Error prevention 3 — песочница не мешает акценту совпасть с --danger/--positive
6 Recognition 3 — иконки тем без подписей на мобильном
8 Minimal 3 — 06 по умолчанию раскрыт на самом тяжёлом аспекте (~1500px на телефоне); рынок дважды
9 Recovery 3
Total 23/32 (72%, Good)

## Priority issues
- [P1] Превью «Живых демо» — устаревшие скриншоты: карточка рынка дублирует живой тикер, показывает другую цену, красную крупную цену, текст 6–7px на телефоне, не реагирует на тему. Fix: убрать карточку рынка или заменить ссылкой; переснять/сделать theme-aware превью банка и глобуса. distill, polish.
- [P2] Песочница: акцент может совпасть с цветом статуса (hue 25° = danger). Fix: зона ±30° вокруг статусных оттенков или пересчёт статусов. harden.
- [P2] Навыки отстают от самого сайта: Webpack/Single-SPA/Jest/Enzyme при Vitest, RTL, React Compiler, Next 16, TanStack Query. Fix: обновить domain. clarify.
- [P2] Тап-цели <44px на мобильном: кнопки тем 30×30, «Написать» 97×33, «Весь виджет» 14px высотой, «Открыть демо» 21px, ссылка на GitHub 15px, слайдеры 28px. adapt.
- [P2] Контраст: Tag 11px #8fb6de на accent-soft = 4.2:1 (blueprint, mobile). colorize/polish.
- [P3] 06 раскрыт на «Темах» по умолчанию; сильнейшее доказательство ниже образования. layout.

## Detector
CLI exit 0, 121 advisory; на `/` релевантны: font-size 30px (MarketTicker:61), 15px (Text companyMd, SiteHeader name), мобильные шаги ramp не задокументированы. Bank/geo-globe — вне страницы. Overlay: numbered-section-labels (намеренно), em-dash (русская типографика, ложное), repeating-stripes (штриховка Ганта несёт смысл, ложное), low-contrast Tag 4.2:1 (истинное).

## Minor
H1 «держит нагрузку» не подкреплён фактом из domain; пустой квадрант под подписью в герое на 1440; повтор подсказки в песочнице; поля тетради начинаются с 01, не с героя; проверить, что «Центробанк РФ» — работодатель, а не клиент.
