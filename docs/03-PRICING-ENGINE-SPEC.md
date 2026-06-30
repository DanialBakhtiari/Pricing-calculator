# 03 — مشخصات موتور قیمت‌گذاری (Pricing Engine Spec)

> این سند، **منبع حقیقت (Source of Truth)** برای تمام منطق محاسباتی ابزار است.
> هر فرمول این‌جا باید دقیقاً مطابق همین تعریف در `src/lib/pricing/` پیاده شود و با `Test Vectors` انتهای هر بخش اعتبارسنجی شود.
> منبع علمی: «راهنمای جامع قیمت‌گذاری پروژه‌های وب، وردپرس و سئو».

اصول کلی پیاده‌سازی:

- موتور قیمت‌گذاری باید **خالص (pure)** و بدون وابستگی به UI باشد: ورودی → خروجی، بدون side-effect.
- همه‌ی توابع در `src/lib/pricing/*.ts` و کاملاً تایپ‌شده (TypeScript strict) نوشته شوند.
- واحد پولی پیش‌فرض **تومان** است؛ اعداد به‌صورت `number` نگه‌داری شوند و فقط در لایه‌ی نمایش با جداکننده‌ی هزارگان و ارقام فارسی فرمت شوند.
- هر تابع باید ورودی نامعتبر (منفی، صفرِ نامجاز، NaN) را با `zod` اعتبارسنجی کند و خطای قابل‌فهم بدهد.
- هیچ گرد‌کردنی داخل موتور انجام نشود؛ گرد‌کردن فقط در لایه‌ی نمایش (`formatToman`) رخ دهد.

---

## ۰. مدل داده‌ی مشترک (Shared Types)

```ts
// src/lib/pricing/types.ts
export type Toman = number;          // واحد پول، همیشه عدد خام
export type Hours = number;          // ساعت
export type Ratio = number;          // نسبت اعشاری: 0.65 یعنی ۶۵٪
export type Multiplier = number;     // ضریب: 1.8

export interface MoneyRange { min: Toman; max: Toman; }
```

دامنه‌های مجاز (برای اعتبارسنجی `zod` و راهنمای UI):

| پارامتر | حداقل | حداکثر | پیش‌فرض پیشنهادی |
|:---|:---:|:---:|:---:|
| `U_rate` (بهره‌وری) | 0.4 | 0.85 | 0.65 |
| `W_weeks` | 40 | 52 | 48 |
| `H_week` | 10 | 60 | 40 |
| `CM` (ضریب پیچیدگی) | 1.0 | 2.5 | 1.0 |
| `RB` (بافر ریسک) | 0.0 | 1.0 | 0.0 |
| `ASF` | 1.0 | 3.0 | 1.0 |

---

## ۱. ماژول «موتور هزینه و MAR»

### 1.1 ساعات قابل‌فاکتور سالانه

$$H_{billable} = (W_{weeks} \times H_{week}) \times U_{rate}$$

```ts
export function billableHours(input: {
  weeks: number;        // W_weeks
  hoursPerWeek: number; // H_week
  utilization: Ratio;   // U_rate
}): Hours;
```

### 1.2 کل هزینه‌ی سالانه

$$C_{total} = C_{direct} + C_{overhead} + C_{profit\_target}$$

```ts
export function totalAnnualCost(input: {
  direct: Toman;        // C_direct
  overhead: Toman;      // C_overhead
  profitTarget: Toman;  // C_profit_target
}): Toman;
```

### 1.3 نسبت سربار

$$R_{overhead} = \frac{C_{overhead}}{C_{direct}} \times 100\%$$

```ts
export function overheadRatio(overhead: Toman, direct: Toman): number; // درصد
```

**محک سلامت (برای رنگ‌بندی UI):** ۴۰–۸۰٪ سبز، ۸۰–۱۰۰٪ زرد، بالای ۱۰۰٪ قرمز («ساختار بیش از حد سنگین»).

### 1.4 حداقل نرخ قابل‌قبول

$$MAR = \frac{C_{total}}{H_{billable}}$$

```ts
export function minimumAcceptableRate(totalCost: Toman, billable: Hours): Toman;
```

### ✅ Test Vectors — ماژول ۱

```
billableHours({weeks:48, hoursPerWeek:40, utilization:0.65}) === 1248
totalAnnualCost({direct:0, overhead:0, profitTarget:480_000_000}) === 480_000_000
minimumAcceptableRate(480_000_000, 1248) ≈ 384_615.384...   // tolerance 1e-3
overheadRatio(40_000_000, 80_000_000) === 50   // ۵۰٪
```

---

## ۲. ماژول «قیمت‌گذاری پروژه وب/وردپرس»

### 2.1 قیمت پایه از روی تخمین ساعت

$$P_{base} = H_{estimate} \times Rate$$

که `Rate` یا `MAR` ماژول ۱ است یا نرخ بازار دستی.

### 2.2 قیمت تعدیل‌شده (هسته‌ی این ماژول)

$$P_{adjusted} = P_{base} \times CM \times (1 + RB)$$

```ts
export function adjustedPrice(input: {
  base: Toman;     // P_base
  cm: Multiplier;  // ضریب پیچیدگی 1.0..2.5
  rb: Ratio;       // بافر ریسک 0..1
}): Toman;
```

### 2.3 جدول مرجع ضریب پیچیدگی `CM` (داده‌ی برنامه)

```ts
export const CM_LEVELS = [
  { id: 'simple',       label: 'ساده',         min: 1.0, max: 1.0, example: 'لندینگ با قالب آماده' },
  { id: 'medium',       label: 'متوسط',        min: 1.3, max: 1.5, example: 'سایت چندصفحه‌ای با فرم سفارشی' },
  { id: 'complex',      label: 'پیچیده',       min: 1.6, max: 2.0, example: 'ووکامرس با اتوماسیون مالیات' },
  { id: 'very_complex', label: 'بسیار پیچیده', min: 2.1, max: 2.5, example: 'مارکت‌پلیس چندفروشندگی / ERP' },
] as const;
```

### 2.4 جدول مرجع بافر ریسک `RB` (جمع‌شونده)

```ts
export const RB_FACTORS = [
  { id: 'vague_brief',    label: 'Brief مبهم/ناقص',                  value: 0.15 },
  { id: 'unknown_api',    label: 'وابستگی به API ناشناخته‌ی شخص ثالث', value: 0.10 },
  { id: 'slow_client',    label: 'تیم مشتری کند در تصمیم‌گیری',        value: 0.10 },
  { id: 'first_of_kind',  label: 'اولین پروژه از این نوع برای شما',    value: 0.20 },
  { id: 'tight_deadline', label: 'Deadline فشرده و غیرقابل‌مذاکره',   value: 0.15 },
] as const;
// RB نهایی = مجموع مقادیر انتخاب‌شده (سقف منطقی 1.0)
```

### 2.5 ضریب معماری Page Builder

```ts
export const BUILDER_MULTIPLIER = [
  { id: 'standard',     label: 'Page Builder استاندارد',       factor: 1.0 },
  { id: 'custom_style', label: 'Builder + CSS/JS سفارشی',      factor: 1.3 },
  { id: 'custom_theme', label: 'تم سفارشی کامل (Custom Theme)', min: 1.8, max: 2.2 },
] as const;
```

### 2.6 افزونه‌ی آماده در برابر کد سفارشی

$$\Delta Cost = (H_{custom} \times Rate_{dev}) - (Cost_{plugin} + H_{config} \times Rate_{dev})$$

```ts
// خروجی مثبت ⇒ افزونه ارزان‌تر است
export function pluginVsCustom(input: {
  customHours: Hours; configHours: Hours;
  devRate: Toman; pluginCost: Toman;
}): { delta: Toman; recommendation: 'plugin' | 'custom' | 'neutral' };
```

### 2.7 افزودنی‌های پیشنهادی (بند جداگانه‌ی پروپوزال)

- **نگهداری سالانه (Maintenance Retainer):** ۱۵٪–۲۰٪ از هزینه‌ی ساخت کد سفارشی.
- **بهینه‌سازی عملکرد/Core Web Vitals:** ۱۰٪–۱۵٪ از کل بودجه (وقتی Page Builder استفاده شده).
- **هر زبان اضافه (چندزبانه):** +۲۰٪ به ساعت پایه‌ی همان بخش.

```ts
export function maintenanceRetainer(buildCost: Toman, pct = 0.175): MoneyRange;
export function performanceBudget(projectBudget: Toman): MoneyRange; // 10%..15%
```

### 2.8 جدول طلایی ویژگی‌ها (Cheat Sheet — `src/data/featureCheatSheet.ts`)

| ویژگی | ساعت | CM |
|:---|:---:|:---:|
| نصب و پیکربندی اولیه وردپرس | 2–4 | 1.0 |
| لندینگ‌پیج (قالب آماده) | 8–15 | 1.0 |
| لندینگ با UI/UX سفارشی | 20–40 | 1.3–1.5 |
| سایت شرکتی ۵–۱۰ صفحه | 30–60 | 1.2 |
| فروشگاه ووکامرس استاندارد | 40–80 | 1.4 |
| اسکریپت مالیات منطقه‌ای سفارشی | 15–30 | 2.0 |
| اتوماسیون حمل‌ونقل سفارشی | 20–40 | 1.8–2.2 |
| پلتفرم چندفروشندگی | 120–300+ | 2.3–2.5 |
| توسعه پلاگین سفارشی از صفر | 30–100+ | 1.8–2.2 |
| راه‌اندازی چندزبانه | 10–25 | 1.3 |
| سخت‌سازی امنیتی | 8–15 | 1.2 |
| بهینه‌سازی سرعت/CWV | 10–20 | 1.4 |
| مهاجرت سایت | 5–12 | 1.3 |
| یکپارچه‌سازی API شخص ثالث | 20–60 | 1.9–2.2 |
| نگهداری ماهانه استاندارد | 4–8/ماه | 1.0 |

### 2.9 ساختار سه‌سطحی (Price Anchoring)

```ts
export interface PricingTier { id:'essential'|'professional'|'enterprise'; name:string; price:Toman; features:string[]; }
// قاعده‌ی نمایش: سطح وسط (professional) به‌عنوان «پیشنهادی» هایلایت شود.
```

### ✅ Test Vectors — ماژول ۲

```
adjustedPrice({base:150_000_000, cm:1.8, rb:0.25}) === 337_500_000
pluginVsCustom({customHours:30, configHours:4, devRate:500_000, pluginCost:5_000_000}).delta === 8_000_000
// (30*500k) - (5,000,000 + 4*500k) = 15,000,000 - 7,000,000 = 8,000,000 ⇒ recommendation:'plugin'
maintenanceRetainer(50_000_000) === {min:7_500_000, max:10_000_000}
```

---

## ۳. ماژول «قیمت‌گذاری و ROI سئو»

### 3.1 Retainer ماهانه

$$Retainer_{monthly} = (H_{content} \times Rate_{writer}) + (H_{technical} \times Rate_{seo}) + (H_{outreach} \times Rate_{seo}) + C_{tools}$$

```ts
export function seoRetainer(input: {
  contentHours: Hours; writerRate: Toman;
  technicalHours: Hours; outreachHours: Hours; seoRate: Toman;
  toolsCost: Toman; // C_tools سهم این مشتری
}): Toman;
```

### 3.2 مدل عملکردمحور (Hybrid)

$$Payment_{monthly} = Base_{retainer} + (N_{milestones} \times Bonus_{per\_milestone})$$

```ts
export function performancePayment(input: {
  baseRetainer: Toman; milestones: number; bonusPerMilestone: Toman;
}): Toman;
```

**قاعده‌ی ایمنی:** در مدل عملکردمحور، `RB ≥ 0.4` و `Base_retainer` باید حداقل ۷۰٪ هزینه‌ی واقعی را پوشش دهد. UI اگر `baseRetainer < 0.7 * estimatedCost` بود هشدار بدهد.

### 3.3 ROI مشتری (سلاح مذاکره)

$$V_{visitor} = CR \times AOV$$
$$V_{monthly} = \Delta Traffic \times V_{visitor}$$
$$ROI_{client} = \frac{V_{monthly} - Retainer_{monthly}}{Retainer_{monthly}} \times 100\%$$

```ts
export function visitorValue(cr: Ratio, aov: Toman): Toman;
export function monthlyTrafficValue(deltaTraffic: number, vVisitor: Toman): Toman;
export function clientRoi(vMonthly: Toman, retainerMonthly: Toman): number; // درصد
```

### 3.4 اجزای حسابرسی (داده‌ی برنامه)

```ts
export const AUDIT_COMPONENTS = [
  { id:'tech',       label:'حسابرسی فنی',                  min:8, max:15 },
  { id:'keyword',    label:'تحلیل کلمات کلیدی/Content Gap', min:6, max:10 },
  { id:'competitor', label:'تحلیل رقبا',                   min:4, max:8 },
  { id:'backlink',   label:'تحلیل پروفایل بک‌لینک',         min:3, max:6 },
  { id:'roadmap',    label:'نقشه راه و گزارش نهایی',        min:5, max:8 },
] as const;
// قیمت حسابرسی جامع: 15M..50M تومان (بسته به اندازه‌ی سایت) — هرگز رایگان.
```

### ✅ Test Vectors — ماژول ۳

```
visitorValue(0.02, 1_500_000) === 30_000
monthlyTrafficValue(2000, 30_000) === 60_000_000
clientRoi(60_000_000, 25_000_000) === 140   // ۱۴۰٪
seoRetainer({contentHours:10, writerRate:300_000, technicalHours:5, outreachHours:5, seoRate:500_000, toolsCost:2_000_000}) === 10_000_000
// 3,000,000 + 2,500,000 + 2,500,000 + 2,000,000 = 10,000,000
```

---

## ۴. ماژول «مقیاس‌پذیری آژانس»

### 4.1 ضریب مقیاس‌پذیری

$$ASF = 1 + \frac{C_{indirect\_labor}}{C_{direct\_labor}}$$

```ts
export function agencyScalingFactor(indirect: Toman, direct: Toman): Multiplier;
```

### 4.2 نرخ ساعتی سطح آژانس

$$Rate_{agency} = MAR_{individual} \times ASF \times CM$$

```ts
export function agencyRate(input:{ mar: Toman; asf: Multiplier; cm: Multiplier }): Toman;
```

### 4.3 نرخ ترکیبی (Blended Rate)

$$Rate_{blended} = \frac{\sum_{i=1}^{n}(H_i \times Rate_i)}{\sum_{i=1}^{n} H_i}$$

```ts
export interface RoleLine { role: string; hours: Hours; rate: Toman; }
export function blendedRate(lines: RoleLine[]): Toman;
```

### 4.4 حاشیه سود نهایی (راستی‌آزمایی)

$$Margin_{\%} = \frac{P_{final} - C_{actual}}{P_{final}} \times 100\%$$

```ts
export function profitMargin(pFinal: Toman, cActual: Toman): number; // درصد
```

**محک:** هدف ۲۵٪–۴۵٪ (Gross). زیر ۱۵٪ = هشدار قرمز.

### 4.5 سهم ابزار به‌ازای هر پروژه

$$C_{tools\_per\_project} = \frac{C_{tools\_monthly}}{N_{active\_projects}}$$

### 4.6 جدول مراحل رشد و ASF (داده‌ی برنامه)

```ts
export const SCALE_STAGES = [
  { id:'freelancer', label:'فریلنسر تک‌نفره',     asfMin:1.0, asfMax:1.0 },
  { id:'small_team', label:'تیم کوچک (۲–۵)',      asfMin:1.1, asfMax:1.2 },
  { id:'boutique',   label:'آژانس بوتیک (۶–۲۰)',  asfMin:1.3, asfMax:1.6 },
  { id:'midsize',    label:'میان‌مقیاس (۲۱–۱۰۰)', asfMin:1.7, asfMax:2.2 },
  { id:'large',      label:'آژانس بزرگ (۱۰۰+)',   asfMin:2.3, asfMax:3.0 },
] as const;
```

### ✅ Test Vectors — ماژول ۴

```
agencyScalingFactor(120_000_000, 100_000_000) === 2.2
blendedRate([
  {role:'senior',   hours:80, rate:800_000},
  {role:'designer', hours:40, rate:600_000},
  {role:'pm',       hours:20, rate:500_000},
]) === 700_000   // 98,000,000 / 140
profitMargin(100_000_000, 70_000_000) === 30
```

---

## ۵. خط لوله‌ی کامل قیمت‌گذاری (Orchestration)

```
C_total ──▶ ÷ H_billable ──▶ MAR
   │                            │
   └─▶ P_base = H_estimate × (MAR یا نرخ بازار)
                                │
   P_base ──▶ × CM ──▶ × (1+RB) ──▶ × ASF ──▶ P_final
                                              │
                          راستی‌آزمایی: Margin% با C_actual
```

```ts
export function buildProposalPrice(input: FullProposalInput): ProposalResult;
// ProposalResult: { base, afterCM, afterRB, afterASF, final, breakdown[] } برای نمودار آبشاری
```

`breakdown[]` باید برای نمودار **Waterfall (Chart.js)** مناسب باشد تا کاربر سهم هر ضریب را ببیند.

---

## ۶. الزامات تست (Vitest)

- برای **هر** تابع موتور: یک تست «مقدار درست از روی Test Vector» + یک تست «ورودی نامعتبر رد می‌شود».
- یک فایل `engine.golden.test.ts` که **تمام** Test Vectorهای این سند را یکجا اجرا کند.
- پوشش موتور `src/lib/pricing/**` باید **۱۰۰٪ خطوط** باشد.
- مقایسه‌ها با `toBeCloseTo` و tolerance `1e-3`.

> ⛔️ هیچ ماژول UI نباید فرمول را بازنویسی کند. UI فقط توابع این موتور را صدا می‌زند.
