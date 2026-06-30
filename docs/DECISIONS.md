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

### تصمیمات باز (طبق architecture §۱۳ — در فاز مربوطه قطعی می‌شوند)
- روش PDF: شروع با چاپ مرورگر (`react-to-print`)، ارتقا به `html2canvas+jsPDF` در صورت نیاز (تصمیم نهایی: فاز ۶).
- Waterfall: پیاده‌سازی دستی روی Bar چارت بدون پلاگین اضافه (حفظ سبکی باندل).
