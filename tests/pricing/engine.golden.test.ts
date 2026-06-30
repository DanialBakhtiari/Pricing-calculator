import { describe, it, expect } from 'vitest';
import {
  billableHours,
  totalAnnualCost,
  minimumAcceptableRate,
  overheadRatio,
  adjustedPrice,
  pluginVsCustom,
  maintenanceRetainer,
  visitorValue,
  monthlyTrafficValue,
  clientRoi,
  seoRetainer,
  agencyScalingFactor,
  blendedRate,
  profitMargin,
} from '@/lib/pricing';

// همه‌ی Test Vectorهای docs/03 یکجا. مقایسه‌ها با tolerance 1e-3 (§6).
const TOL = 3;

describe('Golden test vectors — docs/03', () => {
  it('§1 — MAR module', () => {
    expect(billableHours({ weeks: 48, hoursPerWeek: 40, utilization: 0.65 })).toBeCloseTo(
      1248,
      TOL,
    );
    expect(totalAnnualCost({ direct: 0, overhead: 0, profitTarget: 480_000_000 })).toBeCloseTo(
      480_000_000,
      TOL,
    );
    expect(minimumAcceptableRate(480_000_000, 1248)).toBeCloseTo(384_615.3846, TOL);
    expect(overheadRatio(40_000_000, 80_000_000)).toBeCloseTo(50, TOL);
  });

  it('§2 — Web/WordPress module', () => {
    expect(adjustedPrice({ base: 150_000_000, cm: 1.8, rb: 0.25 })).toBeCloseTo(337_500_000, TOL);

    const pvc = pluginVsCustom({
      customHours: 30,
      configHours: 4,
      devRate: 500_000,
      pluginCost: 5_000_000,
    });
    expect(pvc.delta).toBeCloseTo(8_000_000, TOL);
    expect(pvc.recommendation).toBe('plugin');

    const m = maintenanceRetainer(50_000_000);
    expect(m.min).toBeCloseTo(7_500_000, TOL);
    expect(m.max).toBeCloseTo(10_000_000, TOL);
  });

  it('§3 — SEO/ROI module', () => {
    expect(visitorValue(0.02, 1_500_000)).toBeCloseTo(30_000, TOL);
    expect(monthlyTrafficValue(2000, 30_000)).toBeCloseTo(60_000_000, TOL);
    expect(clientRoi(60_000_000, 25_000_000)).toBeCloseTo(140, TOL);
    expect(
      seoRetainer({
        contentHours: 10,
        writerRate: 300_000,
        technicalHours: 5,
        outreachHours: 5,
        seoRate: 500_000,
        toolsCost: 2_000_000,
      }),
    ).toBeCloseTo(10_000_000, TOL);
  });

  it('§4 — Agency scaling module', () => {
    expect(agencyScalingFactor(120_000_000, 100_000_000)).toBeCloseTo(2.2, TOL);
    expect(
      blendedRate([
        { role: 'senior', hours: 80, rate: 800_000 },
        { role: 'designer', hours: 40, rate: 600_000 },
        { role: 'pm', hours: 20, rate: 500_000 },
      ]),
    ).toBeCloseTo(700_000, TOL);
    expect(profitMargin(100_000_000, 70_000_000)).toBeCloseTo(30, TOL);
  });
});
