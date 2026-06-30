import { describe, it, expect } from 'vitest';
import {
  seoRetainer,
  performancePayment,
  isPerformanceBaseSafe,
  isPerformanceModelSafe,
  visitorValue,
  monthlyTrafficValue,
  clientRoi,
} from '@/lib/pricing/seo';

describe('seo — seoRetainer (§3.1)', () => {
  it('matches the test vector = 10,000,000', () => {
    expect(
      seoRetainer({
        contentHours: 10,
        writerRate: 300_000,
        technicalHours: 5,
        outreachHours: 5,
        seoRate: 500_000,
        toolsCost: 2_000_000,
      }),
    ).toBe(10_000_000);
  });

  it('rejects a non-positive writer rate', () => {
    expect(() =>
      seoRetainer({
        contentHours: 1,
        writerRate: 0,
        technicalHours: 1,
        outreachHours: 1,
        seoRate: 1,
        toolsCost: 0,
      }),
    ).toThrow();
  });
});

describe('seo — performancePayment (§3.2)', () => {
  it('adds milestone bonuses to the base retainer', () => {
    expect(
      performancePayment({ baseRetainer: 5_000_000, milestones: 3, bonusPerMilestone: 1_000_000 }),
    ).toBe(8_000_000);
  });

  it('rejects a fractional milestone count', () => {
    expect(() =>
      performancePayment({ baseRetainer: 1, milestones: 2.5, bonusPerMilestone: 1 }),
    ).toThrow();
  });
});

describe('seo — isPerformanceBaseSafe (§3.2 safety rule)', () => {
  it('is safe when the base covers at least 70% of real cost', () => {
    expect(isPerformanceBaseSafe(70, 100)).toBe(true);
  });

  it('is unsafe when the base covers less than 70%', () => {
    expect(isPerformanceBaseSafe(69, 100)).toBe(false);
  });

  it('rejects a non-positive estimated cost', () => {
    expect(() => isPerformanceBaseSafe(10, 0)).toThrow();
  });
});

describe('seo — isPerformanceModelSafe (§3.2 both clauses)', () => {
  it('is safe only when base ≥ 70% AND rb ≥ 0.4', () => {
    expect(isPerformanceModelSafe({ baseRetainer: 70, estimatedCost: 100, rb: 0.4 })).toBe(true);
  });

  it('is unsafe when rb is below 0.4 even if base coverage is fine', () => {
    expect(isPerformanceModelSafe({ baseRetainer: 70, estimatedCost: 100, rb: 0.39 })).toBe(false);
  });

  it('is unsafe when base coverage is below 70% even if rb is high', () => {
    expect(isPerformanceModelSafe({ baseRetainer: 69, estimatedCost: 100, rb: 0.5 })).toBe(false);
  });

  it('rejects an rb outside the [0,1] domain', () => {
    expect(() =>
      isPerformanceModelSafe({ baseRetainer: 70, estimatedCost: 100, rb: 1.5 }),
    ).toThrow();
  });
});

describe('seo — ROI chain (§3.3)', () => {
  it('visitorValue = CR × AOV', () => {
    expect(visitorValue(0.02, 1_500_000)).toBe(30_000);
  });

  it('monthlyTrafficValue = ΔTraffic × V_visitor', () => {
    expect(monthlyTrafficValue(2000, 30_000)).toBe(60_000_000);
  });

  it('clientRoi returns 140% for the vector', () => {
    expect(clientRoi(60_000_000, 25_000_000)).toBe(140);
  });

  it('rejects a conversion rate above 1', () => {
    expect(() => visitorValue(1.5, 1)).toThrow();
  });

  it('rejects a zero retainer (division by zero)', () => {
    expect(() => clientRoi(1, 0)).toThrow();
  });

  it('rejects negative traffic', () => {
    expect(() => monthlyTrafficValue(-1, 1)).toThrow();
  });
});
