# 04 — سیستم طراحی (Design System)

> نقش نویسنده: **طراح محصول / UI**. هدف: ظاهر حرفه‌ای، آرام، داده‌محور، کاملاً فارسی و RTL.

## ۱. زبان بصری

- لحن: «ابزار مالی قابل‌اعتماد» — تمیز، فضای سفید زیاد، تأکید بر عدد و نمودار.
- شعاع گوشه: `--radius: 0.75rem`. سایه‌های نرم و کم. بدون شلوغی.
- هر «نتیجه‌ی مهم» در یک **ResultCard** برجسته با عدد بزرگ + برچسب + tooltip.

## ۲. توکن‌های رنگ (Tailwind v4 — `@theme` در `styles/globals.css`، OKLCH)

ساختار shadcn (روشن/تیره) را نگه دار و رنگ برند را تنظیم کن. نمونه:

```css
@import "tailwindcss";

@theme {
  --font-sans: "Vazirmatn", ui-sans-serif, system-ui, sans-serif;
  --radius: 0.75rem;
}

:root {
  --background: oklch(0.99 0 0);
  --foreground: oklch(0.20 0.02 260);
  --primary:    oklch(0.55 0.18 264);   /* بنفش-آبی برند (قابل‌تغییر) */
  --primary-foreground: oklch(0.99 0 0);
  --success:    oklch(0.65 0.17 150);   /* سبز سود/سلامت */
  --warning:    oklch(0.80 0.16 85);    /* زرد هشدار */
  --destructive:oklch(0.62 0.22 25);    /* قرمز ریسک */
  --muted:      oklch(0.96 0.005 260);
  --border:     oklch(0.90 0.01 260);
  /* chart palette */
  --chart-1: var(--primary);
  --chart-2: oklch(0.70 0.15 200);
  --chart-3: var(--success);
  --chart-4: var(--warning);
  --chart-5: oklch(0.65 0.20 320);
}
.dark {
  --background: oklch(0.18 0.02 260);
  --foreground: oklch(0.96 0.01 260);
  --primary:    oklch(0.68 0.17 264);
  --muted:      oklch(0.26 0.02 260);
  --border:     oklch(0.34 0.02 260);
  /* ... معادل تیره بقیه */
}
```

**معنای رنگ در محک‌ها (مهم):** سبز=سالم/سودده، زرد=احتیاط، قرمز=خطر. این کدگذاری در همه‌ی ماژول‌ها یکسان باشد (Overhead Ratio، Margin، هشدار Performance).

## ۳. تایپوگرافی

- فونت: **Vazirmatn** (self-host، subset فارسی+لاتین+ارقام). `font-display: swap`.
- مقیاس: `text-xs/sm/base/lg/xl/2xl/3xl`. اعداد نتیجه: `text-3xl font-bold tabular-nums`.
- همه‌ی اعداد با `tabular-nums` تا در جدول/کارت تراز بمانند. ارقام فارسی در نمایش.

## ۴. قواعد RTL (الزامی)

- `dir="rtl"` روی ریشه. هرگز `left/right` فیزیکیِ شکننده؛ از `start/end` منطقی.
- آیکن‌های جهت‌دار (پیکان «بعدی/قبلی»، فلش رشد) با `rtl:-scale-x-100` آینه شوند.
- نمودارها: محور و لجند راست‌چین؛ ترتیب داده‌ها از راست به چپ منطقی باشد.
- اعداد و واحد: «۱۲٬۰۰۰٬۰۰۰ تومان» — عدد و واحد کنار هم، با فاصله‌ی باریک.

## ۵. اینونتوری کامپوننت (shadcn/ui مورد نیاز)

`button, input, label, card, tabs, accordion, select, slider, checkbox, switch, tooltip, popover, dialog, sheet, badge, separator, sonner (toast), table, skeleton, scroll-area, alert`.

کامپوننت‌های سفارشی روی این پایه:
- **InfoTooltip** — آیکن «!»/«؟» با Tooltip(دسکتاپ)+Popover(موبایل).
- **NumberField / MoneyField** — ورودی عددی با نرمال‌سازی فارسی، پسوند واحد، دکمه‌ی +/−، اعتبارسنجی زنده.
- **PercentField / SliderField** — برای `U_rate`, `CM`, `RB`.
- **ResultCard** — عدد بزرگ + برچسب + tooltip + رنگ محک.
- **BenchmarkBar** — نوار رنگی که عدد را روی بازه‌ی سالم/هشدار/خطر نشان می‌دهد.
- **TierCards** — سه کارت Essential/Pro/Enterprise؛ Pro با badge «پیشنهادی» و حاشیه‌ی برند.
- **ScenarioBar** — ذخیره/بازیابی/حذف سناریوها.
- **ModuleHeader** — عنوان + دکمه‌ی «؟ راهنما» (driver.js) + دکمه‌ی خروجی.

## ۶. الگوی فرم

- چیدمان دو ستونی دسکتاپ، تک‌ستون موبایل. گروه‌بندی با `Accordion`/`Card`.
- هر فیلد: `Label` + `InfoTooltip` + `Field` + پیام خطای زیر فیلد (فارسی).
- نتیجه به‌صورت **زنده** کنار/زیر فرم (Sticky در دسکتاپ).
- دکمه‌های اصلی: «ذخیره سناریو»، «خروجی PDF»، «دانلود تصویر».

## ۷. حالت‌ها (States)

| حالت | رفتار |
|:---|:---|
| empty | راهنمای کوتاه + مثال پیش‌فرض «امتحان کن» |
| invalid | مرز قرمز فیلد + پیام؛ نتیجه «—» و دلیل |
| loading (lazy chart) | Skeleton هم‌اندازه‌ی نمودار |
| success | نتیجه + نمودار + امکان خروجی |
| benchmark warn | رنگ زرد/قرمز + متن توضیحی tooltip |

## ۸. نمودارها (استایل)

- پالت از `--chart-1..5`. خطوط شبکه کم‌رنگ. tooltip نمودار فارسی با `formatToman`.
- **Waterfall (ماژول ۲):** میله‌ها از `P_base` شروع و هر ضریب (CM، RB، ASF) را به‌صورت افزایشی نشان می‌دهد تا «چرا این قیمت» بصری شود.
- **ROI (ماژول ۳):** دو میله «ارزش ماهانه‌ی ترافیک» vs «Retainer» + برچسب درصد ROI بزرگ.
- **Doughnut هزینه (ماژول ۱):** سهم مستقیم/سربار/سود.
- **Donut نقش‌ها (ماژول ۴):** سهم ساعت×نرخ هر نقش.
- هر نمودار: `aria-label` + جدول متنی پنهان برای screen-reader + دکمه‌ی دانلود PNG.

## ۹. تم تور آموزشی (driver.js)

- پاپ‌اوور تور با رنگ برند، فونت Vazirmatn، دکمه‌های «بعدی/قبلی/پایان» فارسی و راست‌چین.
- overlay با کمی تیرگی؛ هایلایت عنصر با گوشه‌ی گرد هماهنگ `--radius`.
- CSS override برای راست‌چین‌سازی و فونت (driver.js تم‌پذیر است).

## ۱۰. ریسپانسیو و حرکت

- بریک‌پوینت‌ها: موبایل پیش‌فرض، `md` دو ستونی، `lg` نتیجه‌ی Sticky.
- تست اجباری در عرض **۳۶۰px**.
- حرکت‌ها ظریف (۱۵۰–۲۵۰ms)، با احترام به `prefers-reduced-motion`.
- لمسی: هدف لمس ≥ ۴۴px؛ tooltip موبایل با tap.

## ۱۱. دسترس‌پذیری (که در طراحی رعایت شود)
- کنتراست متن AA (≥ 4.5:1)، عناصر بزرگ ۳:۱.
- فوکوس همیشه دیده‌شود (ring برند).
- ناوبری کامل با کیبورد؛ tooltip/چارت با ARIA.
- رنگ هرگز تنها حامل معنا نباشد (محک‌ها متن/آیکن هم داشته باشند).
