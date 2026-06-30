import { describe, it, expect } from 'vitest';
import {
  billableHours,
  totalAnnualCost,
  overheadRatio,
  minimumAcceptableRate,
} from '@/lib/pricing/mar';

describe('mar — billableHours (§1.1)', () => {
  it('matches the test vector: 48×40×0.65 = 1248', () => {
    expect(billableHours({ weeks: 48, hoursPerWeek: 40, utilization: 0.65 })).toBe(1248);
  });

  it('rejects utilization above the realistic ceiling (0.85)', () => {
    expect(() => billableHours({ weeks: 48, hoursPerWeek: 40, utilization: 1 })).toThrow();
  });
});

describe('mar — totalAnnualCost (§1.2)', () => {
  it('sums the three cost buckets', () => {
    expect(totalAnnualCost({ direct: 0, overhead: 0, profitTarget: 480_000_000 })).toBe(
      480_000_000,
    );
  });

  it('rejects a negative bucket', () => {
    expect(() => totalAnnualCost({ direct: -1, overhead: 0, profitTarget: 0 })).toThrow();
  });
});

describe('mar — overheadRatio (§1.3)', () => {
  it('returns the ratio as a percentage', () => {
    expect(overheadRatio(40_000_000, 80_000_000)).toBe(50);
  });

  it('rejects a zero direct cost (division by zero)', () => {
    expect(() => overheadRatio(10, 0)).toThrow();
  });
});

describe('mar — minimumAcceptableRate (§1.4)', () => {
  it('matches the test vector ≈ 384_615.38', () => {
    expect(minimumAcceptableRate(480_000_000, 1248)).toBeCloseTo(384_615.3846, 3);
  });

  it('rejects a non-positive billable hours value', () => {
    expect(() => minimumAcceptableRate(1, 0)).toThrow();
  });
});
