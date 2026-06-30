import { describe, it, expect } from 'vitest';
import {
  adjustedPrice,
  pluginVsCustom,
  maintenanceRetainer,
  performanceBudget,
  multilangHours,
} from '@/lib/pricing/web';

describe('web — adjustedPrice (§2.2)', () => {
  it('matches the test vector: 150M × 1.8 × 1.25 = 337.5M', () => {
    expect(adjustedPrice({ base: 150_000_000, cm: 1.8, rb: 0.25 })).toBe(337_500_000);
  });

  it('rejects a complexity multiplier above 2.5', () => {
    expect(() => adjustedPrice({ base: 1, cm: 3, rb: 0 })).toThrow();
  });
});

describe('web — pluginVsCustom (§2.6)', () => {
  it('recommends the plugin when it is cheaper (vector: delta = 8M)', () => {
    expect(
      pluginVsCustom({ customHours: 30, configHours: 4, devRate: 500_000, pluginCost: 5_000_000 }),
    ).toEqual({
      delta: 8_000_000,
      recommendation: 'plugin',
    });
  });

  it('recommends custom code when the plugin path is pricier', () => {
    const r = pluginVsCustom({
      customHours: 1,
      configHours: 0,
      devRate: 100,
      pluginCost: 1_000_000,
    });
    expect(r.delta).toBeLessThan(0);
    expect(r.recommendation).toBe('custom');
  });

  it('is neutral when the two paths cost the same', () => {
    const r = pluginVsCustom({ customHours: 10, configHours: 10, devRate: 100, pluginCost: 0 });
    expect(r).toEqual({ delta: 0, recommendation: 'neutral' });
  });

  it('rejects a non-positive dev rate', () => {
    expect(() =>
      pluginVsCustom({ customHours: 1, configHours: 1, devRate: 0, pluginCost: 0 }),
    ).toThrow();
  });
});

describe('web — maintenanceRetainer (§2.7)', () => {
  it('returns the 15%–20% band of the build cost', () => {
    expect(maintenanceRetainer(50_000_000)).toEqual({ min: 7_500_000, max: 10_000_000 });
  });

  it('honors a custom midpoint pct', () => {
    const r = maintenanceRetainer(100_000_000, 0.1);
    expect(r.min).toBeCloseTo(7_500_000, 3);
    expect(r.max).toBeCloseTo(12_500_000, 3);
  });

  it('rejects a pct whose band would leave [0,1]', () => {
    expect(() => maintenanceRetainer(1, 0)).toThrow();
  });
});

describe('web — performanceBudget (§2.7)', () => {
  it('returns the 10%–15% band of the project budget', () => {
    expect(performanceBudget(200_000_000)).toEqual({ min: 20_000_000, max: 30_000_000 });
  });

  it('rejects a negative budget', () => {
    expect(() => performanceBudget(-1)).toThrow();
  });
});

describe('web — multilangHours (§2.7)', () => {
  it('adds 20% of base hours per extra language', () => {
    expect(multilangHours(20, 2)).toBeCloseTo(28, 3); // 20 × (1 + 0.2×2)
  });

  it('returns base hours when there are no extra languages', () => {
    expect(multilangHours(20, 0)).toBe(20);
  });

  it('rejects a fractional language count', () => {
    expect(() => multilangHours(20, 1.5)).toThrow();
  });
});
