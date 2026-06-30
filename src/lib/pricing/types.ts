import { z } from 'zod';

// ---- Shared scalar aliases (docs/03 §0) ----
export type Toman = number; // واحد پول، همیشه عدد خام
export type Hours = number;
export type Ratio = number; // نسبت اعشاری: 0.65 یعنی ۶۵٪
export type Multiplier = number; // ضریب: 1.8

export interface MoneyRange {
  min: Toman;
  max: Toman;
}

/**
 * دامنه‌های مجاز ورودی — docs/03 §0.
 * هم برای اعتبارسنجی zod و هم به‌عنوان راهنمای UI (min/max/default اسلایدرها).
 */
export const RANGES = {
  utilization: { min: 0.4, max: 0.85, default: 0.65 },
  weeks: { min: 40, max: 52, default: 48 },
  hoursPerWeek: { min: 10, max: 60, default: 40 },
  cm: { min: 1.0, max: 2.5, default: 1.0 },
  rb: { min: 0.0, max: 1.0, default: 0.0 },
  asf: { min: 1.0, max: 3.0, default: 1.0 },
} as const;

// ---- Reusable zod primitives ----
// نکته: در zod 4، خود z.number() مقادیر NaN و ±Infinity را رد می‌کند.
export const zMoneyNonNeg = z.number().nonnegative();
export const zMoneyPos = z.number().positive();
export const zHoursNonNeg = z.number().nonnegative();
export const zHoursPos = z.number().positive();
export const zCountPos = z.number().int().positive();
export const zCountNonNeg = z.number().int().nonnegative();
export const zRatio01 = z.number().min(0).max(1);
export const zNonNeg = z.number().nonnegative(); // کمیت نامنفی عمومی (مثلاً تعداد بازدیدکننده)

export const zUtilization = z.number().min(RANGES.utilization.min).max(RANGES.utilization.max);
export const zWeeks = z.number().min(RANGES.weeks.min).max(RANGES.weeks.max);
export const zHoursPerWeek = z.number().min(RANGES.hoursPerWeek.min).max(RANGES.hoursPerWeek.max);
export const zCM = z.number().min(RANGES.cm.min).max(RANGES.cm.max);
export const zRB = z.number().min(RANGES.rb.min).max(RANGES.rb.max);
export const zASF = z.number().min(RANGES.asf.min).max(RANGES.asf.max);
