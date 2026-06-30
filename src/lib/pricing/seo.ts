import { z } from 'zod';
import {
  zCountNonNeg,
  zHoursNonNeg,
  zMoneyNonNeg,
  zMoneyPos,
  zNonNeg,
  zRB,
  zRatio01,
  type Ratio,
  type Toman,
} from './types';

// ===== ماژول «قیمت‌گذاری و ROI سئو» — docs/03 §3 =====

// §3.1 — Retainer_monthly = (H_content × Rate_writer) + (H_tech × Rate_seo)
//                          + (H_outreach × Rate_seo) + C_tools
const seoRetainerSchema = z.object({
  contentHours: zHoursNonNeg,
  writerRate: zMoneyPos,
  technicalHours: zHoursNonNeg,
  outreachHours: zHoursNonNeg,
  seoRate: zMoneyPos,
  toolsCost: zMoneyNonNeg,
});

export function seoRetainer(input: {
  contentHours: number;
  writerRate: Toman;
  technicalHours: number;
  outreachHours: number;
  seoRate: Toman;
  toolsCost: Toman;
}): Toman {
  const v = seoRetainerSchema.parse(input);
  return (
    v.contentHours * v.writerRate +
    v.technicalHours * v.seoRate +
    v.outreachHours * v.seoRate +
    v.toolsCost
  );
}

// §3.2 — Payment_monthly = Base_retainer + (N_milestones × Bonus_per_milestone)
const performancePaymentSchema = z.object({
  baseRetainer: zMoneyNonNeg,
  milestones: zCountNonNeg,
  bonusPerMilestone: zMoneyNonNeg,
});

export function performancePayment(input: {
  baseRetainer: Toman;
  milestones: number;
  bonusPerMilestone: Toman;
}): Toman {
  const { baseRetainer, milestones, bonusPerMilestone } = performancePaymentSchema.parse(input);
  return baseRetainer + milestones * bonusPerMilestone;
}

// §3.2 — قاعده‌ی ایمنی دو شرطی:
//   (الف) Base_retainer ≥ ۷۰٪ هزینه‌ی واقعی، و (ب) RB ≥ ۰٫۴.
export const PERFORMANCE_BASE_MIN_COVERAGE = 0.7;
export const PERFORMANCE_MIN_RB = 0.4;

const performanceSafetySchema = z.object({
  baseRetainer: zMoneyNonNeg,
  estimatedCost: zMoneyPos,
});

/** شرط (الف) به‌تنهایی — برای هشدار اختصاصی «پوشش پایه» در UI. */
export function isPerformanceBaseSafe(baseRetainer: Toman, estimatedCost: Toman): boolean {
  const v = performanceSafetySchema.parse({ baseRetainer, estimatedCost });
  return v.baseRetainer >= PERFORMANCE_BASE_MIN_COVERAGE * v.estimatedCost;
}

const performanceModelSchema = z.object({
  baseRetainer: zMoneyNonNeg,
  estimatedCost: zMoneyPos,
  rb: zRB,
});

/** قاعده‌ی کامل §3.2: هر دو شرط (پوشش پایه ≥ ۷۰٪) و (RB ≥ ۰٫۴) باید برقرار باشند. */
export function isPerformanceModelSafe(input: {
  baseRetainer: Toman;
  estimatedCost: Toman;
  rb: Ratio;
}): boolean {
  const v = performanceModelSchema.parse(input);
  return isPerformanceBaseSafe(v.baseRetainer, v.estimatedCost) && v.rb >= PERFORMANCE_MIN_RB;
}

// §3.3 — ROI مشتری
const visitorValueSchema = z.object({ cr: zRatio01, aov: zMoneyNonNeg });

export function visitorValue(cr: Ratio, aov: Toman): Toman {
  const v = visitorValueSchema.parse({ cr, aov });
  return v.cr * v.aov;
}

const monthlyTrafficValueSchema = z.object({ deltaTraffic: zNonNeg, vVisitor: zMoneyNonNeg });

export function monthlyTrafficValue(deltaTraffic: number, vVisitor: Toman): Toman {
  const v = monthlyTrafficValueSchema.parse({ deltaTraffic, vVisitor });
  return v.deltaTraffic * v.vVisitor;
}

const clientRoiSchema = z.object({ vMonthly: zMoneyNonNeg, retainerMonthly: zMoneyPos });

export function clientRoi(vMonthly: Toman, retainerMonthly: Toman): number {
  const v = clientRoiSchema.parse({ vMonthly, retainerMonthly });
  return ((v.vMonthly - v.retainerMonthly) / v.retainerMonthly) * 100;
}
