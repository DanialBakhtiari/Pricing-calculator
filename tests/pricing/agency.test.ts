import { describe, it, expect } from 'vitest';
import {
  agencyScalingFactor,
  agencyRate,
  blendedRate,
  profitMargin,
  toolsPerProject,
} from '@/lib/pricing/agency';

describe('agency — agencyScalingFactor (§4.1)', () => {
  it('matches the test vector = 2.2', () => {
    expect(agencyScalingFactor(120_000_000, 100_000_000)).toBeCloseTo(2.2, 3);
  });

  it('rejects a zero direct labor cost', () => {
    expect(() => agencyScalingFactor(1, 0)).toThrow();
  });
});

describe('agency — agencyRate (§4.2)', () => {
  it('multiplies MAR × ASF × CM', () => {
    expect(agencyRate({ mar: 400_000, asf: 1.5, cm: 1.2 })).toBeCloseTo(720_000, 3);
  });

  it('rejects an ASF above the documented ceiling (3.0)', () => {
    expect(() => agencyRate({ mar: 1, asf: 3.5, cm: 1 })).toThrow();
  });
});

describe('agency — blendedRate (§4.3)', () => {
  it('matches the test vector = 700,000', () => {
    expect(
      blendedRate([
        { role: 'senior', hours: 80, rate: 800_000 },
        { role: 'designer', hours: 40, rate: 600_000 },
        { role: 'pm', hours: 20, rate: 500_000 },
      ]),
    ).toBe(700_000);
  });

  it('rejects an empty role list', () => {
    expect(() => blendedRate([])).toThrow();
  });

  it('rejects a line set whose total hours are zero', () => {
    expect(() => blendedRate([{ role: 'idle', hours: 0, rate: 100 }])).toThrow();
  });
});

describe('agency — profitMargin (§4.4)', () => {
  it('matches the test vector = 30', () => {
    expect(profitMargin(100_000_000, 70_000_000)).toBe(30);
  });

  it('rejects a zero final price', () => {
    expect(() => profitMargin(0, 0)).toThrow();
  });
});

describe('agency — toolsPerProject (§4.5)', () => {
  it('splits the monthly tools cost across active projects', () => {
    expect(toolsPerProject(6_000_000, 4)).toBe(1_500_000);
  });

  it('rejects a non-integer project count', () => {
    expect(() => toolsPerProject(1, 2.5)).toThrow();
  });
});
