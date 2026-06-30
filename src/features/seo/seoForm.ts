import { z } from 'zod';
import {
  seoRetainer,
  performancePayment,
  isPerformanceModelSafe,
  visitorValue,
  monthlyTrafficValue,
  clientRoi,
  type Toman,
} from '@/lib/pricing';
import { AUDIT_COMPONENTS } from '@/data';
import { numberFieldSchema } from '@/lib/forms/zodField';

export type SeoMode = 'retainer' | 'performance' | 'audit';

export interface SeoFormValues {
  // Retainer
  contentHours: number | null;
  writerRate: number | null;
  technicalHours: number | null;
  outreachHours: number | null;
  seoRate: number | null;
  toolsCost: number | null;
  // Performance hybrid
  baseRetainer: number | null;
  milestones: number | null;
  bonusPerMilestone: number | null;
  estimatedCost: number | null;
  performanceRb: number | null;
  // Audit
  auditComponentIds: string[];
  // ROI
  cr: number | null;
  aov: number | null;
  deltaTraffic: number | null;
  monthlyRetainer: number | null;
}

export const seoSchema = z.object({
  contentHours: numberFieldSchema(),
  writerRate: numberFieldSchema(),
  technicalHours: numberFieldSchema(),
  outreachHours: numberFieldSchema(),
  seoRate: numberFieldSchema(),
  toolsCost: numberFieldSchema(),
  baseRetainer: numberFieldSchema(),
  milestones: numberFieldSchema({ min: 0, max: 100 }),
  bonusPerMilestone: numberFieldSchema(),
  estimatedCost: numberFieldSchema(),
  performanceRb: numberFieldSchema({ min: 0, max: 1 }),
  auditComponentIds: z.array(z.string()),
  cr: numberFieldSchema({ min: 0, max: 1 }),
  aov: numberFieldSchema(),
  deltaTraffic: numberFieldSchema(),
  monthlyRetainer: numberFieldSchema(),
});

export const SEO_DEFAULTS: SeoFormValues = {
  contentHours: 10,
  writerRate: 300_000,
  technicalHours: 5,
  outreachHours: 5,
  seoRate: 500_000,
  toolsCost: 2_000_000,
  baseRetainer: 8_000_000,
  milestones: 3,
  bonusPerMilestone: 2_000_000,
  estimatedCost: 10_000_000,
  performanceRb: 0.4,
  auditComponentIds: ['tech', 'keyword', 'roadmap'],
  cr: 0.02,
  aov: 1_500_000,
  deltaTraffic: 2000,
  monthlyRetainer: 25_000_000,
};

export function computeRetainer(v: Partial<SeoFormValues>): Toman | null {
  const { contentHours, writerRate, technicalHours, outreachHours, seoRate, toolsCost } = v;
  if (
    contentHours == null ||
    writerRate == null ||
    technicalHours == null ||
    outreachHours == null ||
    seoRate == null ||
    toolsCost == null
  ) {
    return null;
  }
  try {
    return seoRetainer({
      contentHours,
      writerRate,
      technicalHours,
      outreachHours,
      seoRate,
      toolsCost,
    });
  } catch {
    return null;
  }
}

export interface PerformanceResult {
  payment: Toman;
  safe: boolean;
}

export function computePerformance(v: Partial<SeoFormValues>): PerformanceResult | null {
  const { baseRetainer, milestones, bonusPerMilestone, estimatedCost, performanceRb } = v;
  if (
    baseRetainer == null ||
    milestones == null ||
    bonusPerMilestone == null ||
    estimatedCost == null ||
    performanceRb == null
  ) {
    return null;
  }
  try {
    const payment = performancePayment({ baseRetainer, milestones, bonusPerMilestone });
    const safe = isPerformanceModelSafe({ baseRetainer, estimatedCost, rb: performanceRb });
    return { payment, safe };
  } catch {
    return null;
  }
}

export interface AuditResult {
  hours: number;
  price: Toman;
}

/** برآورد حسابرسی = ساعتِ میانه‌ی اجزای انتخاب‌شده × نرخ سئو (§3.4؛ بازه‌ی مرجع ۱۵–۵۰M). */
export function computeAudit(v: Partial<SeoFormValues>): AuditResult | null {
  const ids = v.auditComponentIds ?? [];
  const seoRate = v.seoRate;
  if (seoRate == null || ids.length === 0) return null;
  const hours = AUDIT_COMPONENTS.filter((c) => ids.includes(c.id)).reduce(
    (sum, c) => sum + (c.min + c.max) / 2,
    0,
  );
  return { hours, price: hours * seoRate };
}

export interface RoiResult {
  vVisitor: Toman;
  vMonthly: Toman;
  roi: number;
}

export function computeRoi(v: Partial<SeoFormValues>): RoiResult | null {
  const { cr, aov, deltaTraffic, monthlyRetainer } = v;
  if (cr == null || aov == null || deltaTraffic == null || monthlyRetainer == null) return null;
  try {
    const vVisitor = visitorValue(cr, aov);
    const vMonthly = monthlyTrafficValue(deltaTraffic, vVisitor);
    const roi = clientRoi(vMonthly, monthlyRetainer);
    return { vVisitor, vMonthly, roi };
  } catch {
    return null;
  }
}
