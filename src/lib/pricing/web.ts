import { z } from 'zod';
import {
  zCM,
  zCountNonNeg,
  zHoursNonNeg,
  zMoneyNonNeg,
  zMoneyPos,
  zRB,
  type Hours,
  type MoneyRange,
  type Toman,
} from './types';

// ===== ماژول «قیمت‌گذاری پروژه وب/وردپرس» — docs/03 §2 =====

// §2.2 — P_adjusted = P_base × CM × (1 + RB)  ⭐ هسته‌ی این ماژول
const adjustedPriceSchema = z.object({ base: zMoneyNonNeg, cm: zCM, rb: zRB });

export function adjustedPrice(input: { base: Toman; cm: number; rb: number }): Toman {
  const { base, cm, rb } = adjustedPriceSchema.parse(input);
  return base * cm * (1 + rb);
}

// §2.6 — ΔCost = (H_custom × Rate) − (Cost_plugin + H_config × Rate)
// خروجی مثبت ⇒ افزونه‌ی آماده ارزان‌تر است.
const pluginVsCustomSchema = z.object({
  customHours: zHoursNonNeg,
  configHours: zHoursNonNeg,
  devRate: zMoneyPos,
  pluginCost: zMoneyNonNeg,
});

export function pluginVsCustom(input: {
  customHours: number;
  configHours: number;
  devRate: Toman;
  pluginCost: Toman;
}): { delta: Toman; recommendation: 'plugin' | 'custom' | 'neutral' } {
  const { customHours, configHours, devRate, pluginCost } = pluginVsCustomSchema.parse(input);
  const delta = customHours * devRate - (pluginCost + configHours * devRate);
  const recommendation = delta > 0 ? 'plugin' : delta < 0 ? 'custom' : 'neutral';
  return { delta, recommendation };
}

// §2.7 — نگهداری سالانه: ۱۵٪–۲۰٪ از هزینه‌ی ساخت.
// pct میانه‌ی باند است (پیش‌فرض ۱۷٫۵٪) و باند ±۲٫۵٪ ⇒ [۱۵٪، ۲۰٪].
export const MAINTENANCE_HALF_BAND = 0.025;
const maintenanceSchema = z.object({
  buildCost: zMoneyNonNeg,
  pct: z
    .number()
    .min(MAINTENANCE_HALF_BAND)
    .max(1 - MAINTENANCE_HALF_BAND),
});

export function maintenanceRetainer(buildCost: Toman, pct = 0.175): MoneyRange {
  const parsed = maintenanceSchema.parse({ buildCost, pct });
  return {
    min: parsed.buildCost * (parsed.pct - MAINTENANCE_HALF_BAND),
    max: parsed.buildCost * (parsed.pct + MAINTENANCE_HALF_BAND),
  };
}

// §2.7 — بهینه‌سازی عملکرد/CWV: ۱۰٪–۱۵٪ از کل بودجه.
export const PERFORMANCE_BUDGET_MIN_PCT = 0.1;
export const PERFORMANCE_BUDGET_MAX_PCT = 0.15;

export function performanceBudget(projectBudget: Toman): MoneyRange {
  const value = zMoneyNonNeg.parse(projectBudget);
  return {
    min: value * PERFORMANCE_BUDGET_MIN_PCT,
    max: value * PERFORMANCE_BUDGET_MAX_PCT,
  };
}

// §2.7 — هر زبان اضافه: +۲۰٪ به ساعت پایه‌ی همان بخش.
export const MULTILANG_SURCHARGE_PCT = 0.2;
const multilangSchema = z.object({ baseHours: zHoursNonNeg, extraLanguages: zCountNonNeg });

export function multilangHours(baseHours: number, extraLanguages: number): Hours {
  const { baseHours: hours, extraLanguages: langs } = multilangSchema.parse({
    baseHours,
    extraLanguages,
  });
  return hours * (1 + MULTILANG_SURCHARGE_PCT * langs);
}
