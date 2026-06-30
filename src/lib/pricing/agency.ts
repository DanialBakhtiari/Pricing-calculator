import { z } from 'zod';
import {
  zASF,
  zCM,
  zCountPos,
  zHoursNonNeg,
  zMoneyNonNeg,
  zMoneyPos,
  type Hours,
  type Multiplier,
  type Toman,
} from './types';

// ===== ماژول «مقیاس‌پذیری آژانس» — docs/03 §4 =====

// §4.1 — ASF = 1 + (C_indirect_labor / C_direct_labor)
const asfSchema = z.object({ indirect: zMoneyNonNeg, direct: zMoneyPos });

export function agencyScalingFactor(indirect: Toman, direct: Toman): Multiplier {
  const v = asfSchema.parse({ indirect, direct });
  return 1 + v.indirect / v.direct;
}

// §4.2 — Rate_agency = MAR_individual × ASF × CM
const agencyRateSchema = z.object({ mar: zMoneyPos, asf: zASF, cm: zCM });

export function agencyRate(input: { mar: Toman; asf: Multiplier; cm: Multiplier }): Toman {
  const { mar, asf, cm } = agencyRateSchema.parse(input);
  return mar * asf * cm;
}

// §4.3 — Rate_blended = Σ(H_i × Rate_i) / Σ H_i
export interface RoleLine {
  role: string;
  hours: Hours;
  rate: Toman;
}

const roleLineSchema = z.object({
  role: z.string().min(1),
  hours: zHoursNonNeg,
  rate: zMoneyNonNeg,
});
const blendedRateSchema = z
  .array(roleLineSchema)
  .min(1)
  .refine((lines) => lines.reduce((sum, l) => sum + l.hours, 0) > 0, {
    message: 'مجموع ساعت‌ها باید بزرگ‌تر از صفر باشد',
  });

export function blendedRate(lines: RoleLine[]): Toman {
  const parsed = blendedRateSchema.parse(lines);
  const totalWeighted = parsed.reduce((sum, l) => sum + l.hours * l.rate, 0);
  const totalHours = parsed.reduce((sum, l) => sum + l.hours, 0);
  return totalWeighted / totalHours;
}

// §4.4 — Margin% = (P_final − C_actual) / P_final × 100%
const profitMarginSchema = z.object({ pFinal: zMoneyPos, cActual: zMoneyNonNeg });

export function profitMargin(pFinal: Toman, cActual: Toman): number {
  const v = profitMarginSchema.parse({ pFinal, cActual });
  return ((v.pFinal - v.cActual) / v.pFinal) * 100;
}

// §4.5 — C_tools_per_project = C_tools_monthly / N_active_projects
const toolsPerProjectSchema = z.object({
  toolsMonthly: zMoneyNonNeg,
  activeProjects: zCountPos,
});

export function toolsPerProject(toolsMonthly: Toman, activeProjects: number): Toman {
  const v = toolsPerProjectSchema.parse({ toolsMonthly, activeProjects });
  return v.toolsMonthly / v.activeProjects;
}
