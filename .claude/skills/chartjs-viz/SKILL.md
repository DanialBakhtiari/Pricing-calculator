---
name: chartjs-viz
description: >
  ساخت نمودارهای دقیق، راست‌چین و دسترس‌پذیر با chart.js + react-chartjs-2.
  هر زمان نمودار می‌سازی یا تم نمودار را تنظیم می‌کنی این را دنبال کن.
---

# Skill — نمودار با Chart.js

## قواعد
- یک wrapper مشترک `components/charts/ChartBase.tsx`: رنگ از CSS variables، فونت Vazirmatn، tooltip فارسی با `formatToman`، لجند راست‌چین.
- چارت‌ها **lazy** (`React.lazy`) تا از باندل اولیه جدا بمانند. فقط کنترلرها/المان‌های لازم Chart.js را register کن (tree-shake).
- اعداد محور/لیبل با ارقام فارسی.
- هر چارت: `role="img"` + `aria-label` خلاصه + جدول متنیِ هم‌ارز پنهان + دکمه‌ی دانلود PNG (`toBase64Image`).

## نمودارهای پروژه
- **WaterfallChart** (ماژول ۲): از `P_base` شروع، سهم CM و RB و ASF را افزایشی نشان بده. با Bar و میله‌های شناور بساز (بدون پلاگین اضافه).
- **RoiChart** (ماژول ۳): دو میله ارزش ماهانه vs Retainer + برچسب درصد ROI.
- **CostDoughnut** (ماژول ۱): سهم مستقیم/سربار/سود.
- **BlendedDonut** (ماژول ۴): سهم ساعت×نرخ هر نقش.

## خروجی موفق
- داده‌ی نمودار از همان `ProposalResult`/selectorهای core می‌آید (نه محاسبه‌ی دوباره).
- رنگ تنها حامل معنا نیست. در موبایل خوانا و بدون سرریز.
