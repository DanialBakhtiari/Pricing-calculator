import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  SEO_DEFAULTS,
  computeAudit,
  computePerformance,
  computeRetainer,
  computeRoi,
} from '@/features/seo/seoForm';

vi.mock('@/components/charts/RoiChart', () => ({ default: () => <div data-testid="roi-chart" /> }));

import { SeoPage } from '@/features/seo/SeoPage';

describe('seoForm compute (§3 vectors)', () => {
  it('computeRetainer matches the vector = 10,000,000', () => {
    expect(computeRetainer(SEO_DEFAULTS)).toBe(10_000_000);
  });

  it('computeRoi matches the vector (value 60M, ROI 140%)', () => {
    const r = computeRoi(SEO_DEFAULTS);
    expect(r?.vMonthly).toBe(60_000_000);
    expect(r?.roi).toBeCloseTo(140, 5);
  });

  it('computePerformance pays base + milestones and is safe at the floor', () => {
    const r = computePerformance(SEO_DEFAULTS);
    expect(r?.payment).toBe(14_000_000); // 8M + 3 × 2M
    expect(r?.safe).toBe(true); // base 8M ≥ 70% of 10M, rb 0.4 ≥ 0.4
  });

  it('computePerformance flags unsafe when the base is below 70%', () => {
    expect(computePerformance({ ...SEO_DEFAULTS, baseRetainer: 5_000_000 })?.safe).toBe(false);
  });

  it('computeAudit sums selected component midpoints × seo rate', () => {
    // tech 11.5 + keyword 8 + roadmap 6.5 = 26 h × 500,000
    const r = computeAudit(SEO_DEFAULTS);
    expect(r?.hours).toBeCloseTo(26, 5);
    expect(r?.price).toBe(13_000_000);
  });

  it('computeRoi returns null on a zero retainer (division by zero)', () => {
    expect(computeRoi({ ...SEO_DEFAULTS, monthlyRetainer: 0 })).toBeNull();
  });
});

describe('SeoPage', () => {
  it('renders the retainer and the ROI pitch for defaults', async () => {
    render(
      <MemoryRouter>
        <SeoPage />
      </MemoryRouter>,
    );
    expect((await screen.findAllByText('۱۰٬۰۰۰٬۰۰۰ تومان')).length).toBeGreaterThan(0); // retainer
    expect(screen.getAllByText('۱۴۰٪').length).toBeGreaterThan(0); // ROI
  });
});
