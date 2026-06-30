import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { computeMarResult, MAR_DEFAULTS } from '@/features/mar/marForm';
import { useAppStore } from '@/lib/storage/appStore';

// نمودار به canvas نیاز دارد؛ در تست stub می‌شود.
vi.mock('@/components/charts/CostDoughnut', () => ({
  default: () => <div data-testid="cost-doughnut" />,
}));

import { MarPage } from '@/features/mar/MarPage';

describe('computeMarResult (§1 vectors)', () => {
  it('matches the MAR test vector', () => {
    const r = computeMarResult({
      direct: 0,
      overhead: 0,
      profitTarget: 480_000_000,
      weeks: 48,
      hoursPerWeek: 40,
      utilization: 0.65,
    });
    expect(r).not.toBeNull();
    expect(r?.billable).toBeCloseTo(1248, 3);
    expect(r?.total).toBe(480_000_000);
    expect(r?.mar).toBeCloseTo(384_615.3846, 3);
    expect(r?.overheadRatio).toBeNull(); // هزینه‌ی مستقیم صفر
  });

  it('computes overhead ratio when direct > 0 (defaults = 40%)', () => {
    expect(computeMarResult(MAR_DEFAULTS)?.overheadRatio).toBeCloseTo(40, 3);
  });

  it('returns null on incomplete input', () => {
    expect(computeMarResult({ ...MAR_DEFAULTS, direct: null })).toBeNull();
  });

  it('returns null on out-of-range input (engine rejects)', () => {
    expect(computeMarResult({ ...MAR_DEFAULTS, utilization: 1 })).toBeNull();
  });
});

describe('MarPage', () => {
  beforeEach(() => {
    useAppStore.setState({ activeRate: null });
  });

  it('renders the MAR for the default example and sets the shared active rate', async () => {
    render(
      <MemoryRouter>
        <MarPage />
      </MemoryRouter>,
    );

    // 480,000,000 / 1248 ≈ 384,615 → فرمت تومان (گرد‌شده در نمایش)
    expect(await screen.findByText('۳۸۴٬۶۱۵ تومان')).toBeInTheDocument();
    expect(useAppStore.getState().activeRate).toBeCloseTo(384_615.3846, 3);
  });
});
