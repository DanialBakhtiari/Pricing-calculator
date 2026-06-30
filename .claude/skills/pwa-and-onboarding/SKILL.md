---
name: pwa-and-onboarding
description: >
  پیکربندی PWA (vite-plugin-pwa/Workbox) و تور آموزشی کاربر (driver.js) به‌صورت RTL فارسی.
  هر زمان روی نصب‌پذیری/آفلاین/سرویس‌ورکر یا تورهای راهنما کار می‌کنی این را دنبال کن.
---

# Skill — PWA و آموزش کاربر

## PWA (vite-plugin-pwa)
- `registerType: 'autoUpdate'`، استراتژی `generateSW` (Workbox). چون اپ کلاینت‌ساید است، همه‌ی دارایی‌ها precache شوند → آفلاین کامل.
- `manifest`: نام فارسی، `lang:"fa"`, `dir:"rtl"`, `display:"standalone"`, `theme_color`/`background_color`، آیکن ۱۹۲ و ۵۱۲ + یک maskable، چند screenshot.
- UI سفارشی برای دو رویداد:
  - «نصب اپ» (beforeinstallprompt) با متن از content/fa.
  - «نسخه‌ی جدید آماده است؛ بارگذاری مجدد؟» (onNeedRefresh).
- بعد از بیلد، نصب‌پذیری را در Lighthouse/Playwright smoke چک کن.

## آموزش کاربر (driver.js)
- `src/lib/onboarding/tours.ts`: برای هر ماژول آرایه‌ی steps با `element: '[data-tour="..."]'` و متن فارسی از `content/fa/tours`.
- عناصر هدف را با `data-tour="..."` علامت بزن (تور به ساختار DOM گره نخورد).
- تور «خوش‌آمد» فقط یک‌بار (فلگ در appStore/localStorage). دکمه‌ی «؟ راهنما» در هر ModuleHeader تور همان صفحه را دوباره اجرا کند.
- تم RTL: override CSS پاپ‌اوور driver.js (فونت Vazirmatn، راست‌چین، دکمه‌های فارسی، رنگ برند، گوشه‌ی گرد هماهنگ).
- احترام به `prefers-reduced-motion` (انیمیشن هایلایت ملایم).

## خروجی موفق
- اپ نصب‌شدنی و آفلاین‌کار. تور هر ماژول روان و راست‌چین. متن‌ها از content/fa.
