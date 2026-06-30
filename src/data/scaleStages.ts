// جدول مراحل رشد و ASF — docs/03 §4.6
export const SCALE_STAGES = [
  { id: 'freelancer', label: 'فریلنسر تک‌نفره', asfMin: 1.0, asfMax: 1.0 },
  { id: 'small_team', label: 'تیم کوچک (۲–۵)', asfMin: 1.1, asfMax: 1.2 },
  { id: 'boutique', label: 'آژانس بوتیک (۶–۲۰)', asfMin: 1.3, asfMax: 1.6 },
  { id: 'midsize', label: 'میان‌مقیاس (۲۱–۱۰۰)', asfMin: 1.7, asfMax: 2.2 },
  { id: 'large', label: 'آژانس بزرگ (۱۰۰+)', asfMin: 2.3, asfMax: 3.0 },
] as const;

export type ScaleStageId = (typeof SCALE_STAGES)[number]['id'];
