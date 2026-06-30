// اجزای حسابرسی سئو — docs/03 §3.4
// قیمت حسابرسی جامع: 15M..50M تومان (بسته به اندازه‌ی سایت) — هرگز رایگان.
export const AUDIT_COMPONENTS = [
  { id: 'tech', label: 'حسابرسی فنی', labelEn: 'Technical audit', min: 8, max: 15 },
  {
    id: 'keyword',
    label: 'تحلیل کلمات کلیدی/Content Gap',
    labelEn: 'Keyword / content-gap analysis',
    min: 6,
    max: 10,
  },
  { id: 'competitor', label: 'تحلیل رقبا', labelEn: 'Competitor analysis', min: 4, max: 8 },
  {
    id: 'backlink',
    label: 'تحلیل پروفایل بک‌لینک',
    labelEn: 'Backlink profile analysis',
    min: 3,
    max: 6,
  },
  {
    id: 'roadmap',
    label: 'نقشه راه و گزارش نهایی',
    labelEn: 'Roadmap & final report',
    min: 5,
    max: 8,
  },
] as const;

export type AuditComponentId = (typeof AUDIT_COMPONENTS)[number]['id'];

// بازه‌ی قیمت حسابرسی جامع (تومان) — §3.4
export const AUDIT_PRICE_RANGE = { min: 15_000_000, max: 50_000_000 } as const;
