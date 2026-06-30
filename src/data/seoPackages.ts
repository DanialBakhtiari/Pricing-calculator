// مدل‌های تعامل سئو — docs/03 §3 (Audit / Retainer / Performance Hybrid)
// مقادیر عددی فقط از Spec: قاعده‌ی ایمنی §3.2 (RB ≥ 0.4، پوشش پایه ≥ 70٪).
export const SEO_PACKAGES = [
  { id: 'audit', label: 'حسابرسی (یک‌باره)', labelEn: 'Audit (one-time)', kind: 'one-time' },
  { id: 'retainer', label: 'Retainer ماهانه', labelEn: 'Monthly Retainer', kind: 'monthly' },
  {
    id: 'performance',
    label: 'عملکردمحور (Hybrid)',
    labelEn: 'Performance-based (Hybrid)',
    kind: 'monthly',
    rbMin: 0.4,
    baseCoverageMin: 0.7,
  },
] as const;

export type SeoPackageId = (typeof SEO_PACKAGES)[number]['id'];
