import { z } from 'zod';
import {
  zHoursPos,
  zMoneyNonNeg,
  zMoneyPos,
  zUtilization,
  zWeeks,
  zHoursPerWeek,
  type Hours,
  type Toman,
} from './types';

// ===== ماژول «موتور هزینه و MAR» — docs/03 §1 =====

// §1.1 — H_billable = (W_weeks × H_week) × U_rate
const billableHoursSchema = z.object({
  weeks: zWeeks,
  hoursPerWeek: zHoursPerWeek,
  utilization: zUtilization,
});

export function billableHours(input: {
  weeks: number;
  hoursPerWeek: number;
  utilization: number;
}): Hours {
  const { weeks, hoursPerWeek, utilization } = billableHoursSchema.parse(input);
  return weeks * hoursPerWeek * utilization;
}

// §1.2 — C_total = C_direct + C_overhead + C_profit_target
const totalAnnualCostSchema = z.object({
  direct: zMoneyNonNeg,
  overhead: zMoneyNonNeg,
  profitTarget: zMoneyNonNeg,
});

export function totalAnnualCost(input: {
  direct: Toman;
  overhead: Toman;
  profitTarget: Toman;
}): Toman {
  const { direct, overhead, profitTarget } = totalAnnualCostSchema.parse(input);
  return direct + overhead + profitTarget;
}

// §1.3 — R_overhead = (C_overhead / C_direct) × 100%
const overheadRatioSchema = z.object({ overhead: zMoneyNonNeg, direct: zMoneyPos });

export function overheadRatio(overhead: Toman, direct: Toman): number {
  const parsed = overheadRatioSchema.parse({ overhead, direct });
  return (parsed.overhead / parsed.direct) * 100;
}

// §1.4 — MAR = C_total / H_billable
const marSchema = z.object({ totalCost: zMoneyNonNeg, billable: zHoursPos });

export function minimumAcceptableRate(totalCost: Toman, billable: Hours): Toman {
  const parsed = marSchema.parse({ totalCost, billable });
  return parsed.totalCost / parsed.billable;
}
