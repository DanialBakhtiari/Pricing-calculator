import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  builderFactor,
  computeWebResult,
  rbTotal,
  WEB_DEFAULTS,
  type WebFormValues,
} from '@/features/web/webForm';

vi.mock('@/components/charts/WaterfallChart', () => ({
  default: () => <div data-testid="waterfall" />,
}));

import { WebPage } from '@/features/web/WebPage';

const VECTOR: WebFormValues = {
  featureId: null,
  hours: 300,
  rateSource: 'market',
  marketRate: 500_000,
  cm: 1.8,
  rbFactors: ['vague_brief', 'unknown_api'], // 0.15 + 0.10 = 0.25
  builderId: 'standard',
  addMaintenance: false,
  addCwv: false,
  multilangCount: 0,
};

describe('webForm helpers', () => {
  it('rbTotal sums selected factors and caps at 1.0', () => {
    expect(rbTotal(['vague_brief', 'unknown_api'])).toBeCloseTo(0.25, 5);
    expect(
      rbTotal(['vague_brief', 'unknown_api', 'slow_client', 'first_of_kind', 'tight_deadline']),
    ).toBeCloseTo(0.7, 5);
  });

  it('builderFactor returns table factor or range midpoint', () => {
    expect(builderFactor('standard')).toBe(1);
    expect(builderFactor('custom_style')).toBe(1.3);
    expect(builderFactor('custom_theme')).toBeCloseTo(2.0, 5); // (1.8 + 2.2) / 2
    expect(builderFactor('unknown')).toBe(1);
  });
});

describe('computeWebResult (§2 vector)', () => {
  it('matches adjustedPrice(150M, 1.8, 0.25) = 337,500,000', () => {
    const r = computeWebResult(VECTOR, null);
    expect(r?.proposal.base).toBe(150_000_000); // 300 × 500,000 × builder(1)
    expect(r?.proposal.final).toBe(337_500_000);
  });

  it('builds three anchored tiers with professional recommended', () => {
    const r = computeWebResult(VECTOR, null);
    const tiers = r?.tiers ?? [];
    expect(tiers.find((t) => t.id === 'essential')?.price).toBe(270_000_000); // afterCM
    const pro = tiers.find((t) => t.id === 'professional');
    expect(pro?.price).toBe(337_500_000);
    expect(pro?.recommended).toBe(true);
    const ent = tiers.find((t) => t.id === 'enterprise');
    expect(ent?.price ?? 0).toBeGreaterThan(337_500_000); // + maintenance + performance
  });

  it('returns null when MAR is the rate source but no active rate exists', () => {
    expect(computeWebResult({ ...VECTOR, rateSource: 'mar', marketRate: null }, null)).toBeNull();
  });

  it('grand total includes add-ons only when their toggles are on', () => {
    const off = computeWebResult({ ...VECTOR, addMaintenance: false, addCwv: false }, null);
    const on = computeWebResult({ ...VECTOR, addMaintenance: true, addCwv: false }, null);
    // toggles off → grand total equals the project price (no add-ons)
    expect(off?.grandTotal.min).toBe(337_500_000);
    expect(off?.grandTotal.max).toBe(337_500_000);
    // maintenance on → grand total grows by the maintenance band
    expect(on?.grandTotal.max).toBeGreaterThan(337_500_000);
  });

  it('applies the multilang surcharge to base hours and the price (§2.7)', () => {
    const r = computeWebResult({ ...VECTOR, multilangCount: 2 }, null);
    expect(r?.multilangExtraHours).toBeCloseTo(120, 5); // 300 × 0.2 × 2
    expect(r?.proposal.base).toBe(210_000_000); // 420 hours × 500,000
    expect(r?.proposal.final).toBe(472_500_000); // 210M × 1.8 × 1.25
  });
});

describe('WebPage', () => {
  it('renders the computed final price and the three-tier section for defaults', async () => {
    render(
      <MemoryRouter>
        <WebPage />
      </MemoryRouter>,
    );
    // WEB_DEFAULTS: 150M base × 1.8 × (1 + 0.35) = 364,500,000
    expect((await screen.findAllByText('۳۶۴٬۵۰۰٬۰۰۰ تومان')).length).toBeGreaterThan(0);
    expect(screen.getByText('سه سطح پیشنهادی')).toBeInTheDocument();
    expect(screen.getByText('پیشنهادی')).toBeInTheDocument();
  });

  it('default scope matches the expected base hours', () => {
    expect(WEB_DEFAULTS.hours).toBe(300);
  });
});
