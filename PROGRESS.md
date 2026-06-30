# PROGRESS — وضعیت فازها

> بعد از هر فاز به‌روزرسانی می‌شود. منبع فازها: `docs/06-PHASES.md`.

وضعیت‌ها: ⬜ شروع‌نشده · 🟦 در حال انجام · ✅ تمام (typecheck/lint/test/build سبز) · ⚠️ بلاک‌شده

| فاز | عنوان | وضعیت | یادداشت |
|:---:|:---|:---:|:---|
| ۰ | اسکلت و ابزار (Scaffold) | ✅ | typecheck/lint/test/build سبز، dev بالا، bundle 72.5KB gz |
| ۱ | هسته‌ی موتور قیمت‌گذاری | ✅ | ۵۹ تست، پوشش lib/pricing ۱۰۰٪، همه Test Vectorها سبز، راستی‌آزمایی ۶-عاملی |
| ۲ | کمکی‌ها و پایه‌های UI | ✅ | ۸۸ تست، format/content/store/۸ کامپوننت/router/داشبورد، راستی‌آزمایی ۲-عاملی |
| ۳ | ماژول MAR | ✅ | فرم+نتیجه+CostDoughnut+سناریو+tour، ۹۸ تست، نرخ فعال تزریق، باندل ۱۴۹KB gz |
| ۴ | ماژول وب/وردپرس | ✅ | Cheat Sheet+CM/RB/Builder+افزودنی+Waterfall+۳سطح، ۱۰۶ تست، Vector 337.5M |
| ۵ | ماژول سئو/ROI + آژانس | ✅ | SEO(۴مدل+ROI+RoiChart)+آژانس(ASF/blended/margin+donut)، ۱۲۱ تست، Vectorها |
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

### فاز ۲ — کمکی‌ها و پایه‌های UI (✅ تمام — 2026-06-30)
معیار پذیرش: کامپوننت‌ها در صفحه‌ی نمونه کار می‌کنند؛ ورودی فارسی parse/format؛ tooltip دسکتاپ(hover)+موبایل(tap)؛ تست format و InfoTooltip سبز.

**چه ساختم:** `lib/format` (toPersianDigits/parsePersianNumber/formatToman/formatPercent)، `content/fa` (tooltips/tours/messages/labels + accessorهای `label/message/tooltip`)، `lib/storage/appStore` (zustand+persist: theme/activeRate/scenarios/welcomeTour). ۱۷ کامپوننت shadcn + ۸ کامپوننت سفارشی (InfoTooltip/NumberField/MoneyField/PercentField/SliderField/ResultCard/BenchmarkBar/ModuleHeader/ScenarioBar). hash router + داشبورد + صفحات placeholder ماژول‌ها + صفحه‌ی Playground (نمونه‌ی یکپارچه فیلد→موتور→فرمت).

**تست‌های سبز:** ۸۸ تست (۱۲ فایل) شامل format، InfoTooltip (tap→popover)، NumberField (parse فارسی + stepper + خطا/aria)، appStore، Playground (محاسبه‌ی واقعی ۳۳۷٬۵۰۰٬۰۰۰). پوشش lib کلی ۱۰۰٪ خط/۹۶٪ شاخه، lib/pricing ۱۰۰٪. `typecheck/lint/format/build` سبز؛ dev با `dir="rtl"` بالا.

**راستی‌آزمایی مستقل (۲ reviewer):** ۷ یافته؛ ۶ اعمال شد — unit پیش‌فرض MoneyField/PercentField از content؛ هدف لمس stepperها ۳۶→۴۴px؛ حذف `role="tooltip"` ناقص؛ aria-labelledby اسلایدر؛ Label متصل (sr-only) در ScenarioBar. ۱ رد شد (حذف `dir="rtl"` اسلایدر — Radix dir سند را ارث نمی‌برد؛ حذف، جهت RTL را می‌شکست).

**ریسک باقی‌مانده:** باندل اولیه ۱۶۵٫۶KB gz (نزدیک سقف ۱۷۰)؛ chart.js/driver.js/PDF فازهای بعد باید lazy شوند. هدف لمس آیکن «!» (size-5) در فاز ۷ (axe/Lighthouse) بازبینی شود.

### فاز ۳ — ماژول MAR (✅ تمام — 2026-06-30)
معیار پذیرش: اعداد با Test Vector؛ نمودار درست؛ «نرخ فعال»=MAR در appStore؛ empty/invalid/success؛ tour ماژول کار کند.

**چه ساختم:** `features/mar/{marForm,MarPage}` — فرم RHF+zodResolver (Controller روی MoneyField/NumberField/SliderField)، نتیجه‌ی زنده از `computeMarResult` (فقط موتور فاز ۱ را صدا می‌زند). نتایج: MAR (بزرگ)، ساعت قابل‌فاکتور، کل هزینه، نسبت سربار با BenchmarkBar. `components/charts/{ChartBase,CostDoughnut,chartTheme}` — دونات lazy با رنگ از CSS-var/OKLCH، role=img + جدول متنی (thead/tbody) + دانلود PNG. `lib/onboarding/runTour` — تور driver.js lazy، RTL. ScenarioBar متصل. نرخ MAR به appStore تزریق می‌شود.

**تست‌های سبز:** ۹۸ تست؛ `computeMarResult` با Test Vector (MAR=۳۸۴٬۶۱۵)، MarPage (رندر + ست‌شدن activeRate)، `numberFieldSchema`. پوشش lib ۱۰۰٪ (همه‌ی متریک‌ها). `typecheck/lint/format/build` سبز.

**راستی‌آزمایی مستقل (۱ reviewer):** ۲ یافته — (۱) محک سربار <۴۰٪ سبز: رد شد با استدلال (سند فقط سربار بالا را ریسک می‌داند؛ ابداع رنگ برای <۴۰٪ ممنوع)، کامنت توضیحی افزوده شد. (۲) thead برای جدول نمودار: اعمال شد.

**بهینه‌سازی:** route-level code-splitting ⇒ باندل اولیه ۱۸۱→۱۴۹KB gz (زیر سقف ۱۷۰). chart.js/driver.js/MarPage همه lazy chunk.

**ریسک باقی‌مانده:** رنگ oklch در canvas نیاز مرورگر مدرن دارد (۲۰۲۶ اوکی). تور driver.js در فاز ۶ (تور خوش‌آمد) و ۷ (axe) صیقل بخورد.

### فاز ۴ — ماژول وب/وردپرس (✅ تمام — 2026-06-30)
معیار پذیرش: adjustedPrice(150M,1.8,0.25)=337.5M در UI؛ waterfall سهم هر ضریب؛ سه سطح؛ tour+tooltip کامل.

**چه ساختم:** `features/web/{webForm,WebPage}` — فرم RHF: انتخاب از Cheat Sheet (پرکردن خودکار ساعت/CM)، نرخ (MAR از appStore یا بازار دستی)، CM اسلایدر، RB چک‌باکس جمع‌شونده، Builder select، افزودنی‌ها (نگهداری/CWV سوییچ + چندزبانه). همه از موتور فاز ۱ (`computeWebResult`→`buildProposalPrice`/`maintenanceRetainer`/`performanceBudget`/`multilangHours`). `WaterfallChart` (lazy، میله‌های شناور)، `TierCards` (سه سطح، حرفه‌ای هایلایت). ScenarioBar + تور driver.js.

**تست‌های سبز:** ۱۰۶ تست؛ Vector adjustedPrice=۳۳۷٫۵M، سه سطح، multilang، helperها (rbTotal/builderFactor)، WebPage render. پوشش lib ۱۰۰٪. `typecheck/lint/format/build` سبز. باندل اولیه ۱۵۰٫۶KB gz.

**راستی‌آزمایی مستقل (۱ reviewer):** ۱ باگ واقعی یافت و رفع شد — چندزبانه روی قیمت اعمال نمی‌شد (فقط نمایشی). حالا ساعت پایه را تعدیل می‌کند. (نکته‌ی ASF در waterfall: web همیشه ASF=1، پس مرحله‌اش صفر و حذف‌شده — درست.)

**ریسک باقی‌مانده:** سه‌سطحی‌سازی (afterCM/final/final+extras) یک تفسیر قابل‌دفاع از §2.9 است (سند فرمول دقیق سه قیمت را نمی‌دهد). در فاز ۶ (پروپوزال) بازبینی شود.

### فاز ۵ — ماژول سئو/ROI + آژانس (✅ تمام — 2026-06-30)
معیار پذیرش: Test Vectorهای ۳ و ۴ در UI درست؛ هشدارها (Performance ناایمن، Margin<۱۵٪)؛ tooltip/tour کامل.

**SEO:** `features/seo/{seoForm,SeoPage}` — Tabs سه مدل (Retainer/Performance/Audit) + ROI همیشه‌نمایان. همه از موتور (`computeRetainer/Performance/Audit/Roi`). `RoiChart` (lazy) + جمله‌ی مذاکره از درصد ROI. هشدار ایمنی دو شرطی §3.2.
**Agency:** `features/agency/{agencyForm,AgencyPage}` — ASF، نرخ آژانس، نرخ ترکیبی با `useFieldArray` (افزودن/حذف نقش) + دونات سهم نقش‌ها (بازاستفاده‌ی CostDoughnut)، حاشیه با محک §4.4 + هشدار <۱۵٪.
**مشترک:** پل‌های فرم `FormMoney/Number/Percent/Slider`؛ `toPersianDigits` اعشار را به «٫» تبدیل می‌کند؛ `ModulePlaceholder` حذف شد.

**تست‌های سبز:** ۱۲۱ تست؛ Vectorها — Retainer ۱۰M، ROI ۱۴۰٪، Performance ۱۴M+safe، Audit؛ ASF ۲٫۲، Blended ۷۰۰k، Margin ۳۰٪. پوشش lib ۱۰۰٪. `typecheck/lint/format/build` سبز. باندل اولیه ۱۳۶٫۶KB gz.

**راستی‌آزمایی مستقل (۱ reviewer):** ۵ یافته؛ ۱ واقعی (نبود tooltip فیلد MAR آژانس) اعمال شد + tooltipهای roles/margin افزوده شد. ۴ رد شد (cm در computeAgencyRate guard دارد؛ roleShares و dataDoughnut هردو guard دارند؛ بازاستفاده‌ی tooltip CM عمومی قابل‌قبول است).

**ریسک باقی‌مانده:** تزریق خودکار activeRate به نرخ آژانس به فاز ۶ موکول. تورهای driver.js نیاز به data-tour روی همه‌ی عناصر هدف دارند (فاز ۶/۷ صیقل).
