// مدل‌های تعامل سئو — docs/03 §3 (Audit / Retainer / Performance Hybrid)
// مقادیر عددی فقط از Spec: قاعده‌ی ایمنی §3.2 (RB ≥ 0.4، پوشش پایه ≥ 70٪).
export const SEO_PACKAGES = [
  { id: 'audit', label: 'حسابرسی (یک‌باره)', kind: 'one-time' },
  { id: 'retainer', label: 'Retainer ماهانه', kind: 'monthly' },
  {
    id: 'performance',
    label: 'عملکردمحور (Hybrid)',
    kind: 'monthly',
    rbMin: 0.4,
    baseCoverageMin: 0.7,
  },
] as const;

export type SeoPackageId = (typeof SEO_PACKAGES)[number]['id'];
