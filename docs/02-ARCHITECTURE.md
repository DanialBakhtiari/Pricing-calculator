# 02 — معماری فنی (Architecture)

> نقش نویسنده: **مهندس ارشد**. هدف: سادگی، خلوص منطق، قابلیت تست، و جاسازی‌پذیری.

## ۱. اصل معماری: «هسته‌ی خالص + پوسته‌ی نازک»

```
┌─────────────────────────────────────────────┐
│  UI (features / components)  ← فقط نمایش       │
│   ▲ props/handlers                            │
│  State (zustand + persist)  ← ورودی‌ها/سناریو  │
│   ▲ selectors                                 │
│  Core (lib/pricing)  ← توابع خالص، بدون React  │  ⭐ منبع حقیقت
└─────────────────────────────────────────────┘
```

- `lib/pricing` هیچ import از React/DOM ندارد ⇒ مستقل تست‌پذیر و قابل‌انتقال.
- UI هیچ فرمولی ندارد؛ فقط `core` را صدا می‌زند و نتیجه را رسم می‌کند.
- هر ماژول یک «feature slice» مستقل است: فرم + selectorها + نمودار + tour.

## ۲. مدیریت state

- **zustand** با میدلور `persist` روی `localStorage` (کلید نسخه‌دار مثل `pricing:v1`).
- یک store به‌ازای هر ماژول + یک `appStore` مشترک (تم، نرخ فعال/MAR، وضعیت تورها، سناریوهای ذخیره‌شده).
- شکل سناریو: `{ id, module, title, inputs, createdAt }` برای بازیابی/خروجی.
- مهاجرت داده: `persist` با `version` و تابع `migrate` تا تغییر اسکیمای ورودی‌ها داده‌ی قدیمی را نشکند.

## ۳. جریان داده‌ی یک ماژول (مثال: وب/وردپرس)

```
فرم (react-hook-form + zodResolver)
  → onChange → نرمال‌سازی اعداد فارسی (parsePersianNumber)
  → ذخیره در store
  → selector ورودی‌ها را به buildProposalPrice(core) می‌دهد
  → ProposalResult → ResultCards + WaterfallChart + Tiers
  → اکشن‌ها: ذخیره‌ی سناریو / چاپ / دانلود PNG
```
محاسبه **debounced** نیست مگر لازم شود؛ توابع خالص ارزان‌اند. اگر ورودی سنگین شد، `useMemo` روی نتیجه.

## ۴. فرمت و RTL (لایه‌ی `lib/format`)

```ts
formatToman(n: number, opts?): string      // "۱۲٬۰۰۰٬۰۰۰ تومان" با جداکننده و ارقام فارسی
toPersianDigits(s: string|number): string
parsePersianNumber(s: string): number      // "۱۲٬۰۰۰" → 12000 ، هم فارسی هم انگلیسی
formatPercent(n: number): string           // "۱۴۰٪"
```
- از `Intl.NumberFormat('fa-IR')` استفاده شود؛ اما برای ورودی‌ها نرمال‌سازی دستی لازم است (کاربر ممکن است هرچیزی تایپ کند).
- جهت: `<html dir="rtl" lang="fa">`. در Tailwind v4 از utilities منطقی (`ps/pe/ms/me/text-start/text-end`) استفاده کن. آیکن‌های جهت‌دار (فلش‌ها) با `rtl:` mirror شوند.

## ۵. نمودارها (Chart.js)

- یک wrapper مشترک `components/charts/ChartBase.tsx` که تم (رنگ‌ها از CSS variables/OKLCH)، فونت فارسی، و راست‌چین لجند را تنظیم می‌کند.
- چارت‌ها **lazy** شوند (`React.lazy`) تا از باندل اولیه جدا بمانند.
- نمودارهای کلیدی: `WaterfallChart` (ساخته‌شده با bar + پایه‌ی floating)، `RoiChart` (bar مقایسه‌ای)، `CostDoughnut`, `BlendedDonut`.
- هر نمودار باید `aria-label` و یک «جدول داده‌ی متنی» جایگزین برای screen-reader داشته باشد.
- دکمه‌ی «دانلود تصویر» از `chartRef.toBase64Image()`.

## ۶. آموزش کاربر (driver.js)

- ماژول `lib/onboarding/tours.ts`: برای هر ماژول یک آرایه‌ی steps با `element` (data-tour-id) و متن فارسی از `content/fa`.
- اولین بازدید: تور «خوش‌آمد» خودکار (یک‌بار، با فلگ در `appStore`). دکمه‌ی «؟ راهنما» در هدر هر ماژول تور همان صفحه را دوباره اجرا می‌کند.
- عناصر هدف با `data-tour="mar-utilization"` و … علامت‌گذاری شوند تا تور به DOM گره نخورد.

## ۷. tooltipها («!»)

- کامپوننت `components/common/InfoTooltip.tsx` مبتنی بر `Tooltip` و `Popover` shadcn:
  - دسکتاپ: hover + focus.
  - موبایل: tap → Popover (چون hover نیست).
  - محتوا از `content/fa/tooltips.ts` با کلید پایدار (مثل `tooltip.mar.utilization`).
  - دسترس‌پذیر: `aria-describedby`, قابل‌فوکوس با Tab، بسته‌شدن با Esc.

## ۸. استراتژی جاسازی (Embedding)

چون پلتفرم سایت اصلی هنوز قطعی نیست، ابزار را **مستقل و قابل‌جاسازی** بساز:
1. **حالت Standalone:** اپ کامل روی `tools.example.com` (پیش‌فرض).
2. **حالت Embed:** پشتیبانی از `?embed=1` که هدر/فوتر سایت را مخفی و فقط ابزار را نشان می‌دهد؛ مناسب `<iframe>`.
3. **اسکریپت تعبیه:** یک snippet کوتاه برای وردپرس/HTML که iframe ریسپانسیو با ارتفاع خودکار می‌سازد (postMessage برای ارتفاع).
4. مسیرها با **hash router** یا `basename` قابل‌تنظیم تا زیر مسیر دلخواه سایت هم کار کند.
5. CORS لازم نیست (کلاینت‌ساید). فقط `frame-ancestors` در CSP برای دامنه‌ی سایت اصلی.

## ۹. PWA

- `vite-plugin-pwa` با `registerType: 'autoUpdate'`, استراتژی `generateSW` (Workbox).
- `manifest`: نام فارسی، `dir:"rtl"`, `lang:"fa"`, آیکن‌های ۱۹۲/۵۱۲ + maskable, `theme_color`/`background_color`, `display:"standalone"`.
- precache دارایی‌های اپ (کاملاً آفلاین چون داده‌ای از سرور نمی‌آید).
- prompt «نصب اپ» و «نسخه‌ی جدید آماده است؛ بارگذاری مجدد؟» با UI سفارشی.

## ۱۰. تست

- **Unit (Vitest):** کل `lib/pricing` (Test Vectorها) + `lib/format` (ارقام فارسی، parse).
- **Component (Testing Library):** فرم‌ها، اعتبارسنجی، رندر tooltip، رندر نتیجه.
- **E2E (Playwright، سبک):** سناریوی «پر کردن ماژول وب و دیدن قیمت»، نصب‌پذیری PWA (smoke)، اجرای یک تور.
- آستانه‌ی پوشش: `lib/**` ≥ ۹۰٪ کلی، `lib/pricing` = ۱۰۰٪ خطوط.

## ۱۱. بودجه‌ی عملکرد (Performance Budget)

- JS اولیه (gz) < **170KB**؛ چارت و PDF و driver.js همگی **lazy/code-split**.
- فونت فارسی subset + `font-display: swap`.
- بدون layout shift روی نتیجه (skeleton آماده).
- هدف Lighthouse: Perf ≥ ۹۰ موبایل.

## ۱۲. کیفیت کد و CI

- ESLint flat config (typescript-eslint, react-hooks, jsx-a11y) + Prettier.
- Husky + lint-staged (typecheck/lint/test روی فایل‌های تغییر‌یافته) — اختیاری ولی پیشنهادی.
- GitHub Actions: `install → typecheck → lint → test → build` روی هر PR.
- خروجی بیلد: استاتیک (`dist/`) قابل‌میزبانی روی هر CDN/هاست استاتیک یا داخل ساب‌دامین.

## ۱۳. تصمیمات باز (در `docs/DECISIONS.md` ثبت شوند)
- روش PDF: `react-to-print` (ساده، چاپ مرورگر) در برابر `html2canvas+jsPDF` (فایل واقعی). پیش‌فرض: شروع با چاپ مرورگر، ارتقا در فاز ۶.
- Waterfall: پیاده‌سازی دستی روی Bar (بدون پلاگین اضافه) برای حفظ سبکی.
