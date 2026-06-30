# PROGRESS — وضعیت فازها

> بعد از هر فاز به‌روزرسانی می‌شود. منبع فازها: `docs/06-PHASES.md`.

وضعیت‌ها: ⬜ شروع‌نشده · 🟦 در حال انجام · ✅ تمام (typecheck/lint/test/build سبز) · ⚠️ بلاک‌شده

| فاز | عنوان | وضعیت | یادداشت |
|:---:|:---|:---:|:---|
| ۰ | اسکلت و ابزار (Scaffold) | ✅ | typecheck/lint/test/build سبز، dev بالا، bundle 72.5KB gz |
| ۱ | هسته‌ی موتور قیمت‌گذاری | ✅ | ۵۹ تست، پوشش lib/pricing ۱۰۰٪، همه Test Vectorها سبز، راستی‌آزمایی ۶-عاملی |
| ۲ | کمکی‌ها و پایه‌های UI | ⬜ | — |
| ۳ | ماژول MAR | ⬜ | — |
| ۴ | ماژول وب/وردپرس | ⬜ | — |
| ۵ | ماژول سئو/ROI + آژانس | ⬜ | — |
| ۶ | قابلیت‌های فرابخشی (PDF/سناریو/embed) | ⬜ | — |
| ۷ | PWA، عملکرد، A11y، e2e، انتشار | ⬜ | — |

---

## گزارش فازها

### فاز ۰ — Scaffold (✅ تمام — 2026-06-30)
معیار پذیرش: `pnpm dev` بالا می‌آید؛ صفحه‌ی سلام RTL با Vazirmatn و تاگل تم؛ `typecheck/lint/test/build` سبز.

**چه ساختم:** Vite 8.1 + React 19.2 + TS 5.9 strict (project references) + Tailwind v4 (CSS-first، توکن‌های OKLCH design §۲) + shadcn New York (button/card/input/label/tooltip) + ESLint flat + Prettier + Vitest/Testing-Library. پوسته‌ی RTL `dir=rtl lang=fa`، فونت Vazirmatn (`@fontsource-variable`, self-host)، تم روشن/تیره با اسکریپت pre-paint و تاگل ماندگار (`pricing:theme`).

**تست‌های سبز:** `typecheck` ✓ · `lint` ✓ · `test` ۲/۲ ✓ (رندر پوسته + تاگل تم) · `build` ✓ (JS 72.5KB gz < بودجه‌ی ۱۷۰KB) · `dev` ✓ (HTTP 200، transform main.tsx 200).

**پاس review مستقل (docs/07 §۴):** reviewer ۳ مورد RTL + ۱ سؤال داد؛ همه پس از بررسی رد شدند — `justify-self-end`/`justify-between`/flex در RTL خصیصه‌های منطقی‌اند (نه فیزیکی) و درست‌اند؛ glob لینت idiom رسمی Vite است و pass شد؛ threshold پوشش عمداً به فاز ۱ موکول شد. ارزیابی نقادانه = بخشی از حلقه، نه اعمال کورکورانه.

**ریسک باقی‌مانده:** subset فونت کامل (فعلاً arabic+latin+latin-ext لود می‌شود) به فاز ۷ موکول. threshold پوشش ۱۰۰٪ موتور در فاز ۱ فعال می‌شود.

### فاز ۱ — هسته‌ی موتور قیمت‌گذاری (✅ تمام — 2026-06-30)
معیار پذیرش: پوشش `lib/pricing` ۱۰۰٪، همه Test Vectorهای docs/03 سبز، صفر وابستگی React.

**چه ساختم:** `src/lib/pricing/{types,mar,web,seo,agency,orchestrate,index}.ts` — توابع خالص zod-validated دقیقاً از docs/03. هفت جدول داده در `src/data/*` (CM_LEVELS, RB_FACTORS, BUILDER_MULTIPLIER, FEATURE_CHEAT_SHEET, AUDIT_COMPONENTS, SCALE_STAGES, SEO_PACKAGES) با `as const`.

**تست‌های سبز:** ۵۹ تست (هر تابع: vector + ورودی نامعتبر) + `engine.golden.test.ts` با همه‌ی Test Vectorها. پوشش ۱۰۰٪ (statements 101/101، branches 7/7، functions 27/27، lines 98/98). `typecheck/lint/build` سبز.

**راستی‌آزمایی مستقل:** Workflow با ۶ verifier موازی، spec را تازه خواندند. ۴ منطبق کامل؛ ۲ یافته‌ی SEO اعمال شد (قاعده‌ی دو شرطی §۳.۲ + نام‌گذاری schema). جزئیات در DECISIONS.

**ریسک باقی‌مانده:** zod هنوز در باندل اولیه نیست (موتور را UI فاز ۳ import می‌کند)؛ اثر باندل zod در فاز ۷ سنجیده شود. توابع `pluginVsCustom`/`multilangHours`/`performanceBudget` خروجی‌های float دارند — UI باید با `formatToman` گرد کند (موتور گرد نمی‌کند، طبق Spec).
