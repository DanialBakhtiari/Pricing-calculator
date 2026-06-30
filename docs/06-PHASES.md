# 06 — فازبندی پروژه و prompt هر فاز

> هر فاز یک واحد قابل‌تحویل با **معیار پذیرش** مشخص است. ترتیب را رعایت کن. در پایان هر فاز، حلقه‌ی خوداصلاحی (`docs/07`) را اجرا و گزارش بده.
> هر فاز یک «prompt آماده» دارد که می‌توانی مستقیم به Claude Code بدهی. اما اگر از `START.md` استفاده کنی، خودش فازها را پشت‌سرهم پیش می‌برد.

اصل کلی: **اول هسته و تست، بعد UI.** هیچ فازی بدون سبز بودن `typecheck/lint/test/build` تمام نمی‌شود.

---

## فاز ۰ — اسکلت و ابزار (Scaffold)
**هدف:** پایه‌ی سالم و قابل‌تست.
**تحویل:**
- Vite 8 + React 19 + TS strict (pnpm).
- Tailwind v4 با `@tailwindcss/vite` + `globals.css` (`@import "tailwindcss"` + `@theme`).
- shadcn/ui init (New York)، نصب چند کامپوننت پایه (button, card, input, label, tooltip).
- ESLint (flat) + Prettier + Vitest + Testing Library؛ scriptهای package.json مطابق CLAUDE.md §۶.
- ساختار پوشه مطابق CLAUDE.md §۳. پوسته‌ی RTL: `<html dir=rtl lang=fa>`، فونت Vazirmatn (self-host)، تم روشن/تیره.
- توکن‌های رنگ OKLCH مطابق design §۲.

**معیار پذیرش:** `pnpm dev` بالا می‌آید؛ صفحه‌ی «سلام» راست‌چین با فونت فارسی و تاگل تم؛ `typecheck/lint/test/build` سبز (حتی با یک تست بدیهی).

**Prompt:**
> «فاز ۰ را اجرا کن: اسکلت پروژه طبق `CLAUDE.md` و `docs/02-ARCHITECTURE.md` و `docs/04-DESIGN-SYSTEM.md`. استک و نسخه‌ها را از CLAUDE.md §۲ رعایت کن. Tailwind v4 را CSS-first راه بینداز، shadcn را init کن، RTL و Vazirmatn و تم روشن/تیره را ست کن، scriptها را بساز. در پایان حلقه‌ی خوداصلاحی را اجرا و گزارش بده. کد بزن، تأیید نخواه مگر تصمیم محصولی لازم شود.»

---

## فاز ۱ — هسته‌ی موتور قیمت‌گذاری (بدون UI)
**هدف:** کل منطق محاسباتی، خالص و تست‌شده.
**تحویل:**
- `src/lib/pricing/{types,mar,web,seo,agency,orchestrate}.ts` دقیقاً طبق `docs/03`.
- جدول‌های داده در `src/data/*` (CM_LEVELS, RB_FACTORS, featureCheatSheet, AUDIT_COMPONENTS, SCALE_STAGES, SEO_PACKAGES).
- اعتبارسنجی zod برای ورودی‌ها.
- تست‌ها + `engine.golden.test.ts` با **همه‌ی Test Vectors** سند ۰۳.

**معیار پذیرش:** پوشش `lib/pricing` = ۱۰۰٪ خطوط؛ همه‌ی Test Vectorها سبز؛ هیچ وابستگی به React در این لایه.

**Prompt:**
> «فاز ۱: موتور `src/lib/pricing` را طبق `docs/03-PRICING-ENGINE-SPEC.md` پیاده کن و مهارت `pricing-formulas` را دنبال کن. همه‌ی Test Vectorها را به‌صورت تست بنویس و پوشش ۱۰۰٪ بگیر. هیچ UI نساز.»

---

## فاز ۲ — کمکی‌ها و پایه‌های UI
**هدف:** فرمت فارسی، کامپوننت‌های مشترک، پوسته‌ی اپ و داشبورد.
**تحویل:**
- `lib/format`: `formatToman, toPersianDigits, parsePersianNumber, formatPercent` + تست.
- کامپوننت‌های مشترک: `InfoTooltip, MoneyField, NumberField, PercentField, ResultCard, BenchmarkBar, ModuleHeader, ScenarioBar` (design §۵).
- لایه‌ی محتوا `content/fa/{tooltips,tours,messages}.ts` از `docs/05`.
- router + داشبورد چهار ماژول + state پایه (zustand + persist، appStore با «نرخ فعال» و تم).

**معیار پذیرش:** کامپوننت‌ها در یک صفحه‌ی نمونه کار می‌کنند؛ ورودی فارسی درست parse/format می‌شود؛ tooltip روی دسکتاپ(hover) و موبایل(tap) باز می‌شود؛ تست‌های format و InfoTooltip سبز.

**Prompt:**
> «فاز ۲: `lib/format` (+تست)، کامپوننت‌های مشترک طبق design §۵، لایه‌ی content/fa از `docs/05`، router و داشبورد و state پایه را بساز. مهارت `shadcn-ui-builder` و قواعد `rtl-i18n`/`accessibility` را رعایت کن.»

---

## فاز ۳ — ماژول ۱: موتور هزینه و MAR
**تحویل:** فرم کامل (هزینه‌ها، هفته/ساعت/بهره‌وری) + نتایج (`H_billable, C_total, MAR, Overhead Ratio` با BenchmarkBar) + `CostDoughnut` + ذخیره‌ی سناریو + tooltipها + tour.
**معیار پذیرش:** اعداد با Test Vector می‌خوانند؛ نمودار درست؛ «نرخ فعال» برابر MAR در appStore ست می‌شود؛ empty/invalid/success پیاده؛ tour ماژول کار می‌کند.
**Prompt:**
> «فاز ۳: ماژول MAR را کامل بساز (فرم+نتیجه+نمودار+سناریو+tooltip+tour). از core فاز ۱ استفاده کن، فرمول تکرار نکن. مهارت‌های `chartjs-viz` و `pwa-and-onboarding` (بخش tour) را دنبال کن.»

---

## فاز ۴ — ماژول ۲: قیمت‌گذاری وب/وردپرس
**تحویل:** انتخاب از Cheat Sheet یا ساعت دستی، نرخ (MAR/بازار)، `CM`، `RB` جمع‌شونده، Builder، افزودنی‌ها (نگهداری/CWV/چندزبانه)، `WaterfallChart`، `TierCards` سه‌سطحی (Pro هایلایت)، خروجی.
**معیار پذیرش:** `adjustedPrice(150M,1.8,0.25)=337.5M` در UI دیده شود؛ waterfall سهم هر ضریب را درست نشان دهد؛ سه سطح ساخته شوند؛ tour و tooltipها کامل.
**Prompt:**
> «فاز ۴: ماژول وب/وردپرس را کامل بساز طبق PRD §۴ و design. نمودار Waterfall و TierCards و Cheat Sheet را پیاده کن. همه از core.»

---

## فاز ۵ — ماژول ۳ (سئو/ROI) و ماژول ۴ (آژانس)
**تحویل:**
- سئو: Audit، Retainer، Performance Hybrid (با هشدار ایمنی)، ROI calculator + `RoiChart` + جمله‌ی مذاکره‌ی آماده.
- آژانس: ASF، Rate_agency، Blended Rate (ردیف نقش‌ها)، Margin با محک + `BlendedDonut`.
**معیار پذیرش:** Test Vectorهای ۳ و ۴ در UI درست؛ هشدارها (Performance، Margin<۱۵٪) ظاهر می‌شوند؛ tooltip/tour کامل.
**Prompt:**
> «فاز ۵: ماژول‌های سئو/ROI و آژانس را کامل بساز. هشدارهای ایمنی و محک‌ها را پیاده کن. نمودارها از مهارت `chartjs-viz`.»

---

## فاز ۶ — قابلیت‌های فرابخشی
**تحویل:** ذخیره/بازیابی/حذف سناریوها (همه‌ی ماژول‌ها)، خروجی **PDF** پروپوزال + دانلود **PNG** نمودار، تور «خوش‌آمد» اولیه، اتصال کامل content/fa، حالت `?embed=1`.
**معیار پذیرش:** پروپوزال سه‌سطحی چاپ/PDF تمیز و راست‌چین؛ PNG نمودار سالم؛ سناریوها بعد از رفرش می‌مانند؛ embed بدون هدر/فوتر درست است.
**Prompt:**
> «فاز ۶: سناریوها، خروجی PDF/PNG، تور خوش‌آمد، و حالت embed را پیاده کن طبق `docs/02 §۸` و design. تصمیم PDF را در `docs/DECISIONS.md` ثبت کن.»

---

## فاز ۷ — PWA، عملکرد، دسترس‌پذیری، تست e2e، انتشار
**تحویل:** vite-plugin-pwa (نصب‌پذیر/آفلاین/آپدیت)، code-split چارت‌ها/PDF/driver.js، subset فونت، audit دسترس‌پذیری (axe)، Playwright e2e (یک سناریوی هر ماژول + smoke PWA)، snippet جاسازی iframe برای وردپرس/HTML، README انتشار.
**معیار پذیرش:** Lighthouse Perf ≥ ۹۰، A11y ≥ ۹۵، PWA installable؛ e2e سبز؛ باندل اولیه < ۱۷۰KB gz؛ snippet جاسازی کار می‌کند.
**Prompt:**
> «فاز ۷: PWA و بهینه‌سازی عملکرد و دسترس‌پذیری و e2e و snippet جاسازی را کامل کن طبق مهارت `pwa-and-onboarding` و قاعده‌ی `accessibility` و بودجه‌ی عملکرد `docs/02 §۱۱`. در پایان گزارش نهایی + چک‌لیست Definition of Done.»

---

## نقشه‌ی وابستگی
```
فاز۰ → فاز۱ → فاز۲ → فاز۳ → فاز۴ → فاز۵ → فاز۶ → فاز۷
                 (۱ و ۲ پیش‌نیاز همه‌ی ماژول‌ها)
```
بعد از هر فاز: commit با پیام Conventional + گزارش کوتاه + (در صورت تصمیم) ثبت در `docs/DECISIONS.md`.
