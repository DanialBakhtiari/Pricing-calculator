import { z } from 'zod';
import { adjustedPrice } from './web';
import {
  zASF,
  zCM,
  zHoursNonNeg,
  zMoneyPos,
  zRB,
  type Hours,
  type Multiplier,
  type Ratio,
  type Toman,
} from './types';

// ===== خط لوله‌ی کامل قیمت‌گذاری — docs/03 §5 =====
// P_base = H_estimate × Rate ──▶ × CM ──▶ × (1+RB) ──▶ × ASF ──▶ P_final

export interface FullProposalInput {
  hEstimate: Hours;
  rate: Toman;
  cm: Multiplier;
  rb: Ratio;
  asf?: Multiplier; // پیش‌فرض ۱ (فریلنسر، بدون سربار آژانس)
}

export type BreakdownKey = 'base' | 'cm' | 'rb' | 'asf';

export interface BreakdownStep {
  key: BreakdownKey;
  amount: Toman; // سهم این مرحله (افزایش نسبت به مرحله‌ی قبل)
  cumulative: Toman; // مقدار تجمعی پس از این مرحله
}

export interface ProposalResult {
  base: Toman;
  afterCM: Toman;
  afterRB: Toman;
  afterASF: Toman;
  final: Toman;
  breakdown: BreakdownStep[]; // مناسب نمودار Waterfall (Chart.js)
}

const proposalSchema = z.object({
  hEstimate: zHoursNonNeg,
  rate: zMoneyPos,
  cm: zCM,
  rb: zRB,
  asf: zASF.default(1),
});

export function buildProposalPrice(input: FullProposalInput): ProposalResult {
  const { hEstimate, rate, cm, rb, asf } = proposalSchema.parse(input);

  const base = hEstimate * rate;
  const afterCM = base * cm;
  const afterRB = adjustedPrice({ base, cm, rb }); // base × CM × (1+RB) — هسته‌ی §2.2
  const afterASF = afterRB * asf;

  const breakdown: BreakdownStep[] = [
    { key: 'base', amount: base, cumulative: base },
    { key: 'cm', amount: afterCM - base, cumulative: afterCM },
    { key: 'rb', amount: afterRB - afterCM, cumulative: afterRB },
    { key: 'asf', amount: afterASF - afterRB, cumulative: afterASF },
  ];

  return { base, afterCM, afterRB, afterASF, final: afterASF, breakdown };
}
