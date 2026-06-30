---
name: pricing-formulas
description: >
  پیاده‌سازی و راستی‌آزمایی موتور قیمت‌گذاری. هر زمان روی توابع محاسباتی
  (MAR, CM, RB, ASF, Blended Rate, ROI سئو, Margin) یا تست‌های آن‌ها کار می‌کنی این را دنبال کن.
  منبع حقیقت: docs/03-PRICING-ENGINE-SPEC.md.
---

# Skill — موتور قیمت‌گذاری

## کِی
هر کار روی `src/lib/pricing/**` یا تست‌های موتور.

## قواعد آهنین
1. **هرگز فرمول را از حافظه ننویس.** فقط از `docs/03-PRICING-ENGINE-SPEC.md` کپی/پیاده کن.
2. هر تابع **خالص** است: ورودی → خروجی، بدون React/DOM/I/O.
3. واحد پول `number` خام (تومان). بدون گرد‌کردن داخل موتور.
4. ورودی را با zod اعتبارسنجی کن؛ منفی/NaN/صفرِ نامجاز رد شود.

## رویه‌ی پیاده‌سازی
1. تابع را با امضای دقیقِ Spec بساز (types.ts اول).
2. بلافاصله تستِ Test Vector همان بخش را بنویس.
3. یک تست «ورودی نامعتبر» اضافه کن.
4. `pnpm test` تا سبز شود.
5. در پایان، `engine.golden.test.ts` همه‌ی Test Vectorها را یکجا اجرا کند.

## Test Vectors کلیدی (باید پاس شوند)
```
billableHours(48,40,0.65) = 1248
MAR(480_000_000, 1248) ≈ 384_615.38
adjustedPrice(150_000_000, 1.8, 0.25) = 337_500_000
visitorValue(0.02,1_500_000)=30_000 ; monthlyTrafficValue(2000,30_000)=60_000_000 ; clientRoi(60M,25M)=140
blendedRate([(80,800k),(40,600k),(20,500k)]) = 700_000
agencyScalingFactor(120M,100M)=2.2 ; profitMargin(100M,70M)=30
seoRetainer(10,300k / 5 / 5 ,500k / tools 2M)=10_000_000
```

## خروجی موفق
- پوشش `lib/pricing` = ۱۰۰٪ خطوط.
- همه‌ی Test Vectorها سبز.
- هیچ فرمولی در UI تکرار نشده.
