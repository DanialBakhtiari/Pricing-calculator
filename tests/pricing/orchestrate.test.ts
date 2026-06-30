import { describe, it, expect } from 'vitest';
import { buildProposalPrice } from '@/lib/pricing/orchestrate';

describe('orchestrate — buildProposalPrice (§5 pipeline)', () => {
  it('walks base → ×CM → ×(1+RB) → ×ASF and reports each step', () => {
    const r = buildProposalPrice({ hEstimate: 10, rate: 1_000_000, cm: 1.8, rb: 0.25, asf: 2.2 });

    expect(r.base).toBe(10_000_000);
    expect(r.afterCM).toBe(18_000_000);
    expect(r.afterRB).toBe(22_500_000);
    expect(r.afterASF).toBeCloseTo(49_500_000, 3);
    expect(r.final).toBeCloseTo(49_500_000, 3);

    expect(r.breakdown.map((s) => s.key)).toEqual(['base', 'cm', 'rb', 'asf']);
    expect(r.breakdown[0]).toEqual({ key: 'base', amount: 10_000_000, cumulative: 10_000_000 });
    expect(r.breakdown[1]).toEqual({ key: 'cm', amount: 8_000_000, cumulative: 18_000_000 });
    expect(r.breakdown[2]).toEqual({ key: 'rb', amount: 4_500_000, cumulative: 22_500_000 });
    expect(r.breakdown[3]?.key).toBe('asf');
    expect(r.breakdown[3]?.amount).toBeCloseTo(27_000_000, 3);
  });

  it('defaults ASF to 1.0 when omitted (freelancer, no agency overhead)', () => {
    const r = buildProposalPrice({ hEstimate: 10, rate: 1_000_000, cm: 1.8, rb: 0.25 });
    expect(r.afterASF).toBe(22_500_000);
    expect(r.final).toBe(22_500_000);
    expect(r.breakdown[3]).toEqual({ key: 'asf', amount: 0, cumulative: 22_500_000 });
  });

  it('rejects a non-positive rate', () => {
    expect(() => buildProposalPrice({ hEstimate: 10, rate: 0, cm: 1, rb: 0 })).toThrow();
  });
});
