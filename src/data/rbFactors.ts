// جدول مرجع بافر ریسک RB (جمع‌شونده) — docs/03 §2.4
// RB نهایی = مجموع مقادیر انتخاب‌شده (سقف منطقی 1.0)
export const RB_FACTORS = [
  { id: 'vague_brief', label: 'Brief مبهم/ناقص', value: 0.15 },
  { id: 'unknown_api', label: 'وابستگی به API ناشناخته‌ی شخص ثالث', value: 0.1 },
  { id: 'slow_client', label: 'تیم مشتری کند در تصمیم‌گیری', value: 0.1 },
  { id: 'first_of_kind', label: 'اولین پروژه از این نوع برای شما', value: 0.2 },
  { id: 'tight_deadline', label: 'Deadline فشرده و غیرقابل‌مذاکره', value: 0.15 },
] as const;

export type RbFactorId = (typeof RB_FACTORS)[number]['id'];
