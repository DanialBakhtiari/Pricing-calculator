import { z } from 'zod';
import {
  RANGES,
  agencyScalingFactor,
  agencyRate,
  blendedRate,
  profitMargin,
  type RoleLine,
  type Toman,
} from '@/lib/pricing';
import { numberFieldSchema } from '@/lib/forms/zodField';
import {
  classify,
  type BenchmarkSegment,
  type BenchmarkStatus,
} from '@/components/common/benchmark';

export interface RoleLineInput {
  role: string;
  hours: number | null;
  rate: number | null;
}

export interface AgencyFormValues {
  directLabor: number | null;
  indirectLabor: number | null;
  mar: number | null;
  cm: number;
  roleLines: RoleLineInput[];
  pFinal: number | null;
  cActual: number | null;
}

const roleLineSchema = z.object({
  role: z.string(),
  hours: numberFieldSchema().nullable(),
  rate: numberFieldSchema().nullable(),
});

export const agencySchema = z.object({
  directLabor: numberFieldSchema(),
  indirectLabor: numberFieldSchema(),
  mar: numberFieldSchema(),
  cm: numberFieldSchema({ min: RANGES.cm.min, max: RANGES.cm.max }),
  roleLines: z.array(roleLineSchema),
  pFinal: numberFieldSchema(),
  cActual: numberFieldSchema(),
});

export const AGENCY_DEFAULTS: AgencyFormValues = {
  directLabor: 100_000_000,
  indirectLabor: 120_000_000,
  mar: 384_615,
  cm: 1.0,
  roleLines: [
    { role: 'سنیور', hours: 80, rate: 800_000 },
    { role: 'طراح', hours: 40, rate: 600_000 },
    { role: 'مدیر پروژه', hours: 20, rate: 500_000 },
  ],
  pFinal: 100_000_000,
  cActual: 70_000_000,
};

/** §4.4 محک حاشیه: زیر ۱۵٪ قرمز، ۱۵–۲۵٪ زرد، ۲۵٪+ سبز (هدف ۲۵–۴۵٪). */
export const MARGIN_BENCHMARK = {
  min: 0,
  max: 60,
  segments: [
    { from: 0, to: 15, status: 'danger' },
    { from: 15, to: 25, status: 'warning' },
    { from: 25, to: 1000, status: 'healthy' },
  ] as BenchmarkSegment[],
};

export function computeAsf(v: Partial<AgencyFormValues>): number | null {
  const { directLabor, indirectLabor } = v;
  if (directLabor == null || indirectLabor == null) return null;
  try {
    return agencyScalingFactor(indirectLabor, directLabor);
  } catch {
    return null;
  }
}

export function computeAgencyRate(v: Partial<AgencyFormValues>): Toman | null {
  const asf = computeAsf(v);
  const mar = v.mar;
  const cm = v.cm;
  if (asf == null || mar == null || cm == null) return null;
  try {
    return agencyRate({ mar, asf, cm });
  } catch {
    return null;
  }
}

export function validRoleLines(lines: RoleLineInput[]): RoleLine[] {
  return lines
    .filter((l) => l.role.trim() !== '' && l.hours != null && l.hours > 0 && l.rate != null)
    .map((l) => ({ role: l.role, hours: l.hours!, rate: l.rate! }));
}

export function computeBlended(v: Partial<AgencyFormValues>): Toman | null {
  const lines = validRoleLines(v.roleLines ?? []);
  if (lines.length === 0) return null;
  try {
    return blendedRate(lines);
  } catch {
    return null;
  }
}

export interface MarginResult {
  margin: number;
  status: BenchmarkStatus;
}

export function computeMargin(v: Partial<AgencyFormValues>): MarginResult | null {
  const { pFinal, cActual } = v;
  if (pFinal == null || cActual == null) return null;
  try {
    const margin = profitMargin(pFinal, cActual);
    return { margin, status: classify(margin, MARGIN_BENCHMARK.segments) };
  } catch {
    return null;
  }
}
