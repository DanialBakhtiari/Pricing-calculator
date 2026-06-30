# CLAUDE.md — قانون اساسی پروژه «ماشین‌حساب قیمت‌گذاری وب/وردپرس/سئو»

> این فایل را در **هر** نشست بخوان و رعایت کن. در صورت تعارض، اولویت با همین فایل است، سپس اسناد `docs/`، سپس قواعد `.claude/rules/`.
> زبان محصول **فارسی (RTL)** و واحد پول **تومان** است. کد، نام متغیر، کامیت و کامنت‌های فنی **انگلیسی**.

---

## ۱. مأموریت (Mission)

ساخت یک **ابزار تحت وب کلاینت‌ساید** که به فریلنسر/آژانس کمک می‌کند قیمت پروژه‌های وب، وردپرس و سئو را بر اساس فرمول‌های راهنمای مرجع، **دقیق، قابل‌دفاع و بصری** محاسبه کند. خروجی شامل نمودار و پروپوزال قابل‌دانلود است.

چهار ماژول اصلی:
1. موتور هزینه و **MAR**
2. قیمت‌گذاری پروژه **وب/وردپرس** (CM × (1+RB))
3. قیمت‌گذاری و **ROI سئو** (Audit / Retainer / Performance)
4. **مقیاس‌پذیری آژانس** (ASF و Blended Rate)

منطق محاسباتی دقیقاً در `docs/03-PRICING-ENGINE-SPEC.md` تعریف شده و **منبع حقیقت** است.

---

## ۲. استک فنی (پین‌شده — مطابق وضعیت پایدار میانه‌ی ۲۰۲۶)

| لایه | انتخاب | نسخه‌ی هدف |
|:---|:---|:---|
| Build/Dev | **Vite** (Rolldown) | `^8.1` |
| UI Runtime | **React** | `^19.2` |
| زبان | **TypeScript** (strict) | `^5.x` (آخرین پایدار) |
| استایل | **Tailwind CSS v4** + `@tailwindcss/vite` | `^4.x` |
| کامپوننت | **shadcn/ui** (Radix-based, data-slot, OKLCH) | آخرین CLI |
| فرم/اعتبارسنجی | **react-hook-form** + **zod** | `^7.x` / `^4.x` |
| نمودار | **chart.js** + **react-chartjs-2** | `^4.x` / `^5.3` |
| آموزش گام‌به‌گام | **driver.js** | `^1.6` |
| PWA | **vite-plugin-pwa** (Workbox) | `^1.3` |
| State | **zustand** + **persist** (localStorage) | آخرین پایدار |
| تست | **Vitest** + **@testing-library/react** + **Playwright** (e2e سبک) | آخرین پایدار |
| فرمت/لینت | **ESLint** (flat config) + **Prettier** | آخرین پایدار |
| خروجی PDF | **react-to-print** یا `html2canvas`+`jsPDF` (تصمیم در فاز ۶) | — |
| Runtime | **Node.js LTS** | `>=22` |
| Package manager | **pnpm** | `>=9` |

> قواعد نسخه: همان major پین‌شده را نگه‌دار. اگر نصب با خطای peer مواجه شد، **اول** سازگاری را بررسی کن، خودسرانه downgrade نکن، و در `docs/DECISIONS.md` ثبت کن.

نکات مهم استک:
- Tailwind v4 با **CSS-first config** کار می‌کند: تنظیمات تم در `@theme` داخل CSS، نه در `tailwind.config.js` قدیمی.
- shadcn/ui را با `npx shadcn@latest init` و سپس `add` راه‌اندازی کن؛ کامپوننت‌ها داخل `src/components/ui` کپی می‌شوند (owned code).
- RTL: روی `<html dir="rtl" lang="fa">` + پلاگین/utilityهای منطقی (`ps-*`, `pe-*`, `ms-*`, `me-*`) به‌جای left/right فیزیکی.

---

## ۳. ساختار پوشه (هدف)

```
src/
├── app/                 # bootstrap, router, providers, theme
├── components/
│   ├── ui/              # shadcn primitives (generated, owned)
│   ├── common/          # InfoTooltip, NumberField, MoneyField, ResultCard...
│   └── charts/          # WaterfallChart, RoiChart, BlendedDonut...
├── features/
│   ├── mar/             # ماژول ۱
│   ├── web-pricing/     # ماژول ۲
│   ├── seo-pricing/     # ماژول ۳
│   └── agency-scale/    # ماژول ۴
├── lib/
│   ├── pricing/         # ⭐ موتور خالص (types, mar, web, seo, agency, orchestrate)
│   ├── format/          # formatToman, toPersianDigits, parsePersianNumber
│   ├── storage/         # zustand stores + persist
│   └── onboarding/      # driver.js tours
├── data/                # featureCheatSheet, cmLevels, rbFactors, packages...
├── content/fa/          # تمام متن‌ها و tooltipها (microcopy) — i18n-ready
└── styles/              # globals.css (@theme), rtl utilities
public/                  # manifest, icons, screenshots برای PWA
tests/                   # unit (Vitest) + e2e (Playwright)
docs/                    # اسناد مرجع (همین پوشه)
```

اصل معماری: **منطق ← هسته‌ی خالص `lib/pricing`؛ نمایش ← features/components.** هیچ فرمولی در کامپوننت تکرار نشود.

---

## ۴. تعریف «انجام‌شده» (Definition of Done)

هیچ کاری «تمام» نیست مگر همه‌ی این‌ها سبز باشند:

- [ ] `pnpm typecheck` بدون خطا (TS strict).
- [ ] `pnpm lint` بدون خطا/اخطار.
- [ ] `pnpm test` سبز؛ موتور `lib/pricing` پوشش ۱۰۰٪ خطوط و **همه‌ی Test Vectorها** پاس.
- [ ] `pnpm build` موفق؛ بدون warning مهم.
- [ ] هر فیلد ورودی یک **InfoTooltip** (آیکن «!») با متن از `content/fa` دارد.
- [ ] حالت‌های empty / loading / error / invalid هر ماژول پیاده شده.
- [ ] RTL درست است (هیچ left/right فیزیکیِ شکسته)، و در موبایل (۳۶۰px) سالم است.
- [ ] دسترس‌پذیری: کنتراست AA، فوکوس قابل‌دیدن، ناوبری با کیبورد، `aria-*` روی tooltip/چارت.
- [ ] Lighthouse: Performance ≥ 90، PWA installable، A11y ≥ 95 (در فازهای مربوطه).
- [ ] برای هر تغییر، یک «Self-Review» طبق `docs/07-SELF-CORRECTION-LOOP.md` انجام و خلاصه‌اش ثبت شده.

---

## ۵. پروتکل حلقه‌ی خوداصلاحی (خلاصه)

هر واحد کار را در این حلقه انجام بده (جزئیات کامل: `docs/07-SELF-CORRECTION-LOOP.md`):

```
PLAN → BUILD → SELF-REVIEW → TEST → FIX → VERIFY → REPORT
         ▲                                   │
         └──────────── اگر معیار رد شد ───────┘  (حداکثر ۳ دور، بعد گزارش بده)
```

- **PLAN:** قبل از کد، معیار پذیرش همان واحد را از `docs/06-PHASES.md` بنویس.
- **SELF-REVIEW:** با چک‌لیست `skills/self-review` کد خودت را نقد کن (انگار reviewer سینیور هستی).
- **TEST:** تست بنویس/اجرا کن؛ برای موتور، Test Vector اجباری است.
- **VERIFY:** Definition of Done را عبور بده.
- **REPORT:** در پایان هر فاز، خلاصه‌ی «چه ساختم / چه تستی پاس شد / چه ریسکی ماند» بده و منتظر تأیید نمان مگر فاز نیاز به تصمیم محصولی داشته باشد.

---

## ۶. دستورها (Scripts هدف در package.json)

```bash
pnpm dev          # سرور توسعه
pnpm build        # بیلد پproduction
pnpm preview      # پیش‌نمایش بیلد
pnpm typecheck    # tsc --noEmit
pnpm lint         # eslint
pnpm test         # vitest run
pnpm test:watch   # vitest
pnpm test:cov     # vitest run --coverage
pnpm e2e          # playwright test
```

اگر اسکریپتی نبود، **اول** بسازش، بعد استفاده کن.

---

## ۷. خط‌قرمزها (Guardrails)

- ❌ فرمول را «از حافظه» ننویس؛ فقط از `docs/03-PRICING-ENGINE-SPEC.md`.
- ❌ هیچ بک‌اند، حساب کاربری، یا ارسال داده به سرور بیرونی. همه‌چیز کلاینت‌ساید + localStorage.
- ❌ هیچ راز/کلید/توکن در کد. هیچ فراخوانی شبکه‌ی غیرضروری.
- ❌ نصب کتابخانه‌ی سنگین برای کاری که با کم‌تر می‌شود؛ هر dependency جدید باید در `docs/DECISIONS.md` توجیه شود.
- ❌ left/right فیزیکی در CSS که RTL را بشکند.
- ✅ کامپوننت کوچک، تابع خالص، تایپ دقیق، نام معنادار.
- ✅ پیام خطا و microcopy فارسی، از `content/fa` (نه hard-code در JSX).
- ✅ اعداد ورودی کاربر ممکن است فارسی باشند؛ همیشه با `parsePersianNumber` نرمال‌سازی کن.
- ✅ کامیت‌ها Conventional Commits: `feat:`, `fix:`, `test:`, `chore:`, `docs:`.

---

## ۸. نقشه‌ی اسناد

| می‌خواهی… | برو سراغ |
|:---|:---|
| فرمول‌ها و Test Vectorها | `docs/03-PRICING-ENGINE-SPEC.md` |
| چیستی محصول، کاربر، نیازمندی‌ها | `docs/01-PRD.md` |
| معماری فنی و تصمیمات | `docs/02-ARCHITECTURE.md` |
| دیزاین، توکن‌ها، RTL، چارت، تور آموزشی | `docs/04-DESIGN-SYSTEM.md` |
| متن دقیق tooltipها و microcopy | `docs/05-CONTENT-TOOLTIPS.md` |
| فازبندی و معیار پذیرش هر فاز | `docs/06-PHASES.md` |
| حلقه‌ی خوداصلاحی و چک‌لیست QA | `docs/07-SELF-CORRECTION-LOOP.md` |
| شروع کار (prompt اصلی) | `START.md` |

> قاعده‌ی طلایی: **«اول بخوان، بعد بساز، بعد خودت را نقد کن.»**
