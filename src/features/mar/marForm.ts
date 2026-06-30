import { z } from 'zod';
import {
  RANGES,
  billableHours,
  totalAnnualCost,
  minimumAcceptableRate,
  overheadRatio,
  type Toman,
} from '@/lib/pricing';
import { numberFieldSchema } from '@/lib/forms/zodField';

export interface MarFormValues {
  direct: number | null;
  overhead: number | null;
  profitTarget: number | null;
  weeks: number | null;
  hoursPerWeek: number | null;
  utilization: number | null;
}

export const marSchema = z.object({
  direct: numberFieldSchema(),
  overhead: numberFieldSchema(),
  profitTarget: numberFieldSchema(),
  weeks: numberFieldSchema({ min: RANGES.weeks.min, max: RANGES.weeks.max }),
  hoursPerWeek: numberFieldSchema({ min: RANGES.hoursPerWeek.min, max: RANGES.hoursPerWeek.max }),
  utilization: numberFieldSchema({ min: RANGES.utilization.min, max: RANGES.utilization.max }),
});

/** مقادیر مثال پیش‌فرض — تا حالت empty بلافاصله یک نتیجه‌ی واقعی نشان دهد (design §7). */
export const MAR_DEFAULTS: MarFormValues = {
  direct: 300_000_000,
  overhead: 120_000_000,
  profitTarget: 60_000_000,
  weeks: RANGES.weeks.default,
  hoursPerWeek: RANGES.hoursPerWeek.default,
  utilization: RANGES.utilization.default,
};

export interface MarResult {
  billable: number;
  total: Toman;
  mar: Toman;
  /** null اگر هزینه‌ی مستقیم صفر باشد (نسبت سربار تعریف‌نشده). */
  overheadRatio: number | null;
}

/**
 * نتیجه را از موتور خالص می‌گیرد (هیچ فرمولی این‌جا تکرار نمی‌شود).
 * ورودی ناقص یا نامعتبر ⇒ null.
 */
export function computeMarResult(v: Partial<MarFormValues>): MarResult | null {
  const { direct, overhead, profitTarget, weeks, hoursPerWeek, utilization } = v;
  if (
    direct == null ||
    overhead == null ||
    profitTarget == null ||
    weeks == null ||
    hoursPerWeek == null ||
    utilization == null
  ) {
    return null;
  }

  try {
    const billable = billableHours({ weeks, hoursPerWeek, utilization });
    const total = totalAnnualCost({ direct, overhead, profitTarget });
    const mar = minimumAcceptableRate(total, billable);
    const oRatio = direct > 0 ? overheadRatio(overhead, direct) : null;
    return { billable, total, mar, overheadRatio: oRatio };
  } catch {
    return null;
  }
}

/**
 * بازه‌های محک نسبت سربار — spec §1.3: ۴۰–۸۰٪ «سالم»، ۸۰–۱۰۰٪ احتیاط، >۱۰۰٪ خطر.
 * سند فقط سربارِ بالا را ریسک می‌داند («ساختار بیش از حد سنگین»)؛ برای <۴۰٪ رنگی تعریف نکرده.
 * سربار کم = ساختار سبک و سالم ⇒ آن را هم سبز می‌گیریم (نه ابداع وضعیت/رنگ جدید).
 */
export const OVERHEAD_BENCHMARK = {
  min: 0,
  max: 150,
  segments: [
    { from: 0, to: 80, status: 'healthy' as const },
    { from: 80, to: 100, status: 'warning' as const },
    { from: 100, to: 1000, status: 'danger' as const },
  ],
};
