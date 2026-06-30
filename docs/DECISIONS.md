# DECISIONS — لاگ تصمیم‌های معماری و وابستگی

> هر تصمیم مهم (انتخاب کتابخانه، انحراف از پیش‌فرض، حل تعارض نسخه) این‌جا با تاریخ و دلیل ثبت می‌شود.
> فرمت هر ردیف: تاریخ — تصمیم — دلیل — جایگزین‌های رد‌شده.

---

## 2026-06-30 — Phase 0 (Scaffold)

- **git init روی شاخه‌ی `main`** — START.md و CLAUDE.md کامیت Conventional در پایان هر فاز را الزام کرده‌اند؛ مخزن وجود نداشت پس مقداردهی اولیه شد. جایگزین: کار بدون VCS (رد شد، تاریخچه و rollback لازم است).
- **Vite (Rolldown) `^8` + React `^19` + TypeScript strict** — طبق CLAUDE.md §۲ (استک پین‌شده). جایگزین: Next.js (رد شد، نیاز کلاینت‌ساید خالص و قابل‌جاسازی است، SSR لازم نیست).
- **pnpm** به‌عنوان package manager — طبق CLAUDE.md §۲. Node 22.18 LTS، pnpm 11.7 موجود.
- **Tailwind CSS v4 (CSS-first) + `@tailwindcss/vite`** — تنظیم تم در `@theme` داخل CSS، نه `tailwind.config.js`. طبق design §۲.
- **shadcn/ui (New York)** — کامپوننت‌های owned در `src/components/ui`. طبق phase 0.
- **Vitest + @testing-library/react + jsdom** — تست واحد و کامپوننت. Playwright در فاز ۷.
- **ESLint flat config + Prettier** — طبق architecture §۱۲.
- **Vazirmatn self-host (subset)** — فونت فارسی، `font-display: swap`. طبق design §۳ و rule rtl-i18n.
- **تم روشن/تیره با کلاس `.dark`** روی `<html>` + ذخیره در localStorage. توکن‌های OKLCH طبق design §۲.

## 2026-06-30 — Phase 1 (Pricing Engine Core)

- **zod ^4 (4.4.3)** برای اعتبارسنجی ورودی موتور — پین‌شده در CLAUDE.md §۲. در zod 4، خود `z.number()` مقادیر NaN و ±Infinity را رد می‌کند (نیازی به `.finite()` نیست). جایگزین: اعتبارسنجی دستی (رد شد، zod تایپ‌سیف و خوانا).
- **اعمال سخت دامنه‌های §۰** (utilization 0.4–0.85، weeks 40–52، CM 1.0–2.5، ASF 1.0–3.0، …) در zod. سند §۰ صراحتاً می‌گوید این دامنه‌ها «برای اعتبارسنجی zod» هستند. پیامد: مثلاً `utilization=1.0` رد می‌شود (هم‌راستا با microcopy «فرض ۱.۰ اشتباه مرگبار»). هشدارهای نرم (نزدیک سقف) در لایه‌ی UI جدا می‌آیند.
- **`maintenanceRetainer(buildCost, pct=0.175)`**: سند باند ۱۵٪–۲۰٪ و امضای `pct=0.175` را می‌دهد. تفسیر: `pct` میانه‌ی باند و نیم‌پهنا `MAINTENANCE_HALF_BAND=0.025` ⇒ `[pct−0.025, pct+0.025]`. با پیش‌فرض ۰٫۱۷۵ دقیقاً [۱۵٪، ۲۰٪] و Test Vector `{7.5M, 10M}` پاس می‌شود؛ هم پارامتری می‌ماند. (هیچ عدد ابداعی؛ ۲٫۵٪ از خود باند سند مشتق شده.)
- **`breakdown[]` بدون متن فارسی**: گام‌های Waterfall فقط `key` پایدار (`base|cm|rb|asf`) + `amount` + `cumulative` برمی‌گردانند؛ برچسب فارسی در لایه‌ی UI از `content/fa` می‌آید (قاعده‌ی rtl-i18n: بدون فارسی هارد‌کد، حتی در lib).
- **بازاستفاده‌ی `adjustedPrice` در `orchestrate`**: مرحله‌ی `afterRB` از `adjustedPrice({base,cm,rb})` استفاده می‌کند تا فرمول هسته‌ی §۲.۲ تکرار نشود.
- **توابع فراتر از Test Vector** که از prose سند پیاده شدند (با تست + پوشش): `performanceBudget` (§۲.۷ ۱۰–۱۵٪)، `multilangHours` (§۲.۷ +۲۰٪/زبان)، `performancePayment` و `isPerformanceBaseSafe` (§۳.۲)، `toolsPerProject` (§۴.۵).
- **پوشش:** `src/lib/pricing` = ۱۰۰٪ (statements/branches/functions/lines)؛ آستانه‌ی per-glob در `vite.config.ts` + آستانه‌ی کلی lib ۹۰٪.
- **راستی‌آزمایی مستقل (docs/07 §۴):** ۶ verifier موازی، هر کدام spec را تازه خواند و impl را سنجید. ۴ ماژول منطبق کامل. دو یافته‌ی SEO اعمال شد: (۱) قاعده‌ی ایمنی §۳.۲ **دو شرطی** است (پوشش پایه ≥۷۰٪ **و** RB ≥۰٫۴)؛ `isPerformanceModelSafe(...)` افزوده شد که هر دو را در core بررسی می‌کند (`isPerformanceBaseSafe` برای هشدار اختصاصی پایه باقی ماند). (۲) `deltaTraffic` با `zNonNeg` عمومی اعتبارسنجی شد (به‌جای نام گمراه‌کننده‌ی hours).

### تصمیمات باز (طبق architecture §۱۳ — در فاز مربوطه قطعی می‌شوند)
- روش PDF: شروع با چاپ مرورگر (`react-to-print`)، ارتقا به `html2canvas+jsPDF` در صورت نیاز (تصمیم نهایی: فاز ۶).
- Waterfall: پیاده‌سازی دستی روی Bar چارت بدون پلاگین اضافه (حفظ سبکی باندل).
