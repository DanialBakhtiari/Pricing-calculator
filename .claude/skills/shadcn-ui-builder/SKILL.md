---
name: shadcn-ui-builder
description: >
  راه‌اندازی و استفاده‌ی درست از shadcn/ui با Tailwind v4 + React 19 + Vite، به‌صورت RTL فارسی.
  هر زمان کامپوننت UI اضافه/می‌سازی یا تم را تنظیم می‌کنی این را دنبال کن.
---

# Skill — ساخت UI با shadcn/ui (Tailwind v4, RTL)

## راه‌اندازی (یک‌بار)
1. Vite + React + TS بساز (pnpm).
2. Tailwind v4: نصب `tailwindcss @tailwindcss/vite` و افزودن پلاگین به `vite.config.ts`؛ در `globals.css` فقط `@import "tailwindcss";` + بلوک `@theme`.
3. `npx shadcn@latest init` (سبک New York پیشنهادی)، مسیر `src/components/ui`.
4. کامپوننت‌ها را با `npx shadcn@latest add <name>` بیاور. لیست لازم در docs/04-DESIGN-SYSTEM.md §۵.

## قواعد
- کامپوننت‌های `ui/` «owned code» هستند؛ آزادانه برای RTL/فارسی ویرایش کن، ولی الگوی data-slot و variantها را حفظ کن.
- رنگ‌ها از CSS variables (`--primary`, `--success`…)، نه هگز هارد‌کد.
- چیدمان با utilities منطقی (ps/pe/ms/me/start/end). رجوع به rule `rtl-i18n`.
- هر فیلد فرم = Label + InfoTooltip + Field + پیام خطا.
- حالت‌های empty/loading/error/success را همیشه بساز (design §۷).

## کامپوننت‌های سفارشی کلیدی
`InfoTooltip, MoneyField, NumberField, PercentField, ResultCard, BenchmarkBar, TierCards, ModuleHeader, ScenarioBar` — مطابق design §۵.

## خروجی موفق
- بدون left/right فیزیکی. کنتراست AA. فوکوس دیده‌شود.
- موبایل ۳۶۰px سالم. تم روشن/تیره کار کند.
