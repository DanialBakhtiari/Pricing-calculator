import { z } from 'zod';
import {
  RANGES,
  buildProposalPrice,
  maintenanceRetainer,
  performanceBudget,
  multilangHours,
  type MoneyRange,
  type ProposalResult,
  type Toman,
} from '@/lib/pricing';
import { BUILDER_MULTIPLIER, RB_FACTORS } from '@/data';
import { numberFieldSchema } from '@/lib/forms/zodField';

export type RateSource = 'mar' | 'market';

export interface WebFormValues {
  featureId: string | null;
  hours: number | null;
  rateSource: RateSource;
  marketRate: number | null;
  cm: number;
  rbFactors: string[];
  builderId: string;
  addMaintenance: boolean;
  addCwv: boolean;
  multilangCount: number | null;
}

export const webSchema = z.object({
  featureId: z.string().nullable(),
  hours: numberFieldSchema(),
  rateSource: z.enum(['mar', 'market']),
  marketRate: numberFieldSchema().nullable(),
  cm: numberFieldSchema({ min: RANGES.cm.min, max: RANGES.cm.max }),
  rbFactors: z.array(z.string()),
  builderId: z.string(),
  addMaintenance: z.boolean(),
  addCwv: z.boolean(),
  multilangCount: numberFieldSchema({ min: 0, max: 10 }).nullable(),
});

export const WEB_DEFAULTS: WebFormValues = {
  featureId: null,
  hours: 300,
  rateSource: 'market',
  marketRate: 500_000,
  cm: 1.8,
  rbFactors: ['vague_brief', 'first_of_kind'],
  builderId: 'standard',
  addMaintenance: true,
  addCwv: false,
  multilangCount: 0,
};

/** ضریب معماری Builder از جدول §2.5 (برای بازه، میانه‌ی بازه). */
export function builderFactor(id: string): number {
  const entry = BUILDER_MULTIPLIER.find((b) => b.id === id);
  if (!entry) return 1;
  return 'factor' in entry ? entry.factor : (entry.min + entry.max) / 2;
}

/** RB نهایی = مجموع فاکتورهای انتخاب‌شده (سقف منطقی ۱.۰، §2.4). */
export function rbTotal(ids: string[]): number {
  const sum = RB_FACTORS.filter((f) => ids.includes(f.id)).reduce((acc, f) => acc + f.value, 0);
  return Math.min(sum, RANGES.rb.max);
}

export type WebTierId = 'essential' | 'professional' | 'enterprise';

export interface WebTier {
  id: WebTierId;
  price: Toman;
  recommended: boolean;
}

export interface WebResult {
  rate: Toman;
  rb: number;
  proposal: ProposalResult;
  maintenance: MoneyRange | null;
  performance: MoneyRange | null;
  multilangExtraHours: number | null;
  tiers: WebTier[];
}

/**
 * سه سطح قیمت (Price Anchoring §2.9):
 *  - پایه = afterCM (بدون بافر ریسک)
 *  - حرفه‌ای = قیمت تعدیل‌شده‌ی نهایی (پیشنهادی)
 *  - سازمانی = نهایی + نگهداری + بهینه‌سازی عملکرد (بسته‌ی کامل)
 * همه از خروجی موتور؛ هیچ ضریب ابداعی.
 */
function buildTiers(proposal: ProposalResult): WebTier[] {
  const enterpriseExtras =
    maintenanceRetainer(proposal.final).max + performanceBudget(proposal.final).max;
  return [
    { id: 'essential', price: proposal.afterCM, recommended: false },
    { id: 'professional', price: proposal.final, recommended: true },
    { id: 'enterprise', price: proposal.final + enterpriseExtras, recommended: false },
  ];
}

/** نتیجه را از موتور خالص می‌گیرد. ورودی ناقص/نامعتبر یا نبودِ نرخ فعال ⇒ null. */
export function computeWebResult(
  v: Partial<WebFormValues>,
  activeRate: number | null,
): WebResult | null {
  const rateSource = v.rateSource ?? 'market';
  const rate = rateSource === 'mar' ? activeRate : (v.marketRate ?? null);
  const cm = v.cm;
  if (v.hours == null || rate == null || cm == null) return null;

  const factor = builderFactor(v.builderId ?? 'standard');
  const rb = rbTotal(v.rbFactors ?? []);

  try {
    // §2.7 — هر زبان اضافه +۲۰٪ به ساعت پایه ⇒ روی قیمت اثر می‌گذارد (نه فقط نمایشی).
    const baseHours =
      v.multilangCount && v.multilangCount > 0
        ? multilangHours(v.hours, v.multilangCount)
        : v.hours;
    const multilangExtraHours = baseHours > v.hours ? baseHours - v.hours : null;

    const proposal = buildProposalPrice({ hEstimate: baseHours * factor, rate, cm, rb });
    const maintenance = v.addMaintenance ? maintenanceRetainer(proposal.final) : null;
    const performance = v.addCwv ? performanceBudget(proposal.final) : null;

    return {
      rate,
      rb,
      proposal,
      maintenance,
      performance,
      multilangExtraHours,
      tiers: buildTiers(proposal),
    };
  } catch {
    return null;
  }
}
