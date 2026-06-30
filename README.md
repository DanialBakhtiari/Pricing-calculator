# 🧮 ماشین‌حساب قیمت‌گذاری وب، وردپرس و سئو

ابزار تحت وبِ **کلاینت‌ساید، فارسی (RTL) و آفلاین‌کار (PWA)** برای محاسبه‌ی قیمت قابل‌دفاع پروژه‌های وب، وردپرس و سئو. در کمتر از چند دقیقه، با چند ورودی ساده، یک **قیمت دقیق + نمودار + پروپوزال قابل‌چاپ** می‌سازد. هیچ بک‌اندی ندارد؛ همه‌چیز در مرورگر اجرا و در `localStorage` ذخیره می‌شود.

> واحد پول **تومان**، ارقام **فارسی**. منطق محاسباتی دقیقاً از `docs/03-PRICING-ENGINE-SPEC.md` (منبع حقیقت).

---

## ✨ چهار ماژول

| ماژول | چه می‌کند |
|:---|:---|
| **موتور هزینه و MAR** | کف نرخ ساعتی قابل‌دفاع (MAR) از روی هزینه‌ها و ظرفیت کاری + نمودار ترکیب هزینه |
| **قیمت‌گذاری وب/وردپرس** | `قیمت پایه × CM × (۱+RB)`، نمودار آبشاری، افزودنی‌ها، و **سه سطح Essential/Pro/Enterprise** |
| **سئو و ROI** | Retainer ماهانه · مدل عملکردمحور (با هشدار ایمنی) · حسابرسی · محاسبه‌گر ROI مشتری + جمله‌ی مذاکره |
| **مقیاس‌پذیری آژانس** | ضریب مقیاس (ASF) · نرخ ترکیبی (ردیف نقش‌ها) · راستی‌آزمایی حاشیه‌ی سود با محک |

**قابلیت‌های مشترک:** نرخ MAR به‌صورت خودکار به ماژول‌های بعد تزریق می‌شود · tooltip روی هر فیلد · تور آموزشی driver.js · ذخیره/بازیابی سناریو · خروجی PDF پروپوزال · دانلود PNG نمودار · تم روشن/تیره · کاملاً RTL و ریسپانسیو · نصب‌شدنی و آفلاین (PWA).

---

## 🛠 اجرا و توسعه

پیش‌نیاز: **Node ≥ 22** و **pnpm ≥ 9**.

```bash
pnpm install        # نصب وابستگی‌ها
pnpm dev            # سرور توسعه → http://localhost:5173
pnpm build          # بیلد production در dist/
pnpm preview        # پیش‌نمایش بیلد
```

### کیفیت و تست

```bash
pnpm typecheck      # tsc strict
pnpm lint           # ESLint flat
pnpm format         # Prettier
pnpm test           # Vitest (واحد + کامپوننت + a11y با axe)
pnpm test:cov       # پوشش (موتور قیمت‌گذاری ۱۰۰٪)
pnpm e2e            # Playwright e2e روی بیلد preview
```

> آیکن‌های PWA با `node scripts/gen-icons.mjs` ساخته می‌شوند (بدون وابستگی بومی).

---

## 🌐 جاسازی در سایت (Embed)

ابزار از `?embed=1` پشتیبانی می‌کند: هدر اپ مخفی و ارتفاع iframe خودکار تنظیم می‌شود (via `postMessage`). برای جاسازی در وردپرس یا هر HTML:

```html
<iframe
  id="pricing-tool"
  src="https://YOUR-DOMAIN/?embed=1"
  title="ماشین‌حساب قیمت‌گذاری"
  loading="lazy"
  style="width:100%;border:0;min-height:600px"
></iframe>
<script>
  window.addEventListener('message', function (e) {
    if (e.data && e.data.type === 'wp-seo-pricing:height') {
      var f = document.getElementById('pricing-tool');
      if (f) f.style.height = e.data.height + 'px';
    }
  });
</script>
```

از **hash router** استفاده می‌شود؛ بنابراین زیر هر مسیر/ساب‌دامین بدون پیکربندی سرور کار می‌کند (مثلاً `tools.example.com/#/web`). فقط در صورت میزبانی سفت‌وسخت، `frame-ancestors` در CSP را برای دامنه‌ی سایت میزبان تنظیم کنید.

---

## 🚢 انتشار (Deploy)

خروجی `pnpm build` یک سایت **استاتیک** در `dist/` است؛ روی هر CDN/هاست استاتیک (Netlify, Vercel, GitHub Pages, Cloudflare Pages, یا یک پوشه‌ی ساده) قابل میزبانی است. چون مسیریابی hash است، نیازی به rewrite سمت سرور نیست. Service worker با `registerType: autoUpdate` نسخه‌ی جدید را خودکار به‌روزرسانی می‌کند.

---

## 🧱 استک

Vite 8 (Rolldown) · React 19 · TypeScript strict · Tailwind CSS v4 (CSS-first, OKLCH) · shadcn/ui · react-hook-form + zod · chart.js + react-chartjs-2 · driver.js · vite-plugin-pwa (Workbox) · zustand + persist · react-to-print · Vitest + Testing Library + vitest-axe + Playwright · pnpm.

## 🏗 معماری

**هسته‌ی خالص + پوسته‌ی نازک.** کل منطق محاسباتی در `src/lib/pricing/` است — توابع خالصِ zod-validated، بدون هیچ وابستگی به React، با پوشش تست ۱۰۰٪. UI فقط این توابع را صدا می‌زند و **هیچ فرمولی را تکرار نمی‌کند**.

```
src/
├── app/            # router (hash)، layout، تم، embed
├── components/
│   ├── ui/         # shadcn primitives (owned)
│   ├── common/     # InfoTooltip, MoneyField, ResultCard, TierCards, SummaryRow, ProposalSheet …
│   └── charts/     # ChartBase, CostDoughnut, WaterfallChart, RoiChart (همه lazy)
├── features/       # mar · web · seo · agency · dashboard · playground
├── lib/
│   ├── pricing/    # ⭐ موتور خالص (types, mar, web, seo, agency, orchestrate)
│   ├── format/     # formatToman, toPersianDigits, parsePersianNumber, formatPercent
│   ├── storage/    # zustand appStore (persist)
│   ├── forms/      # zodField + پل‌های فرم
│   └── onboarding/ # تور driver.js
└── content/fa/     # تمام متن‌ها و tooltipها (i18n-ready)
```

اسناد مرجع پروژه در `docs/` و قواعد در `.claude/`.

---

## سازنده

**دانیال بختیاری** — طراحی و توسعه

- وب‌سایت: <https://danialbakhtiari.com>
- گیت‌هاب: <https://github.com/danialbakhtiari>

ساخته‌شده با حلقه‌ی خوداصلاحی و راستی‌آزمایی مستقل در هر فاز. 💪
