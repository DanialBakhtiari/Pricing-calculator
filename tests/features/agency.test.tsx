import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  AGENCY_DEFAULTS,
  computeAgencyRate,
  computeAsf,
  computeBlended,
  computeMargin,
  validRoleLines,
} from '@/features/agency/agencyForm';

vi.mock('@/components/charts/CostDoughnut', () => ({ default: () => <div data-testid="donut" /> }));

import { AgencyPage } from '@/features/agency/AgencyPage';

describe('agencyForm compute (§4 vectors)', () => {
  it('computeAsf matches the vector = 2.2', () => {
    expect(computeAsf(AGENCY_DEFAULTS)).toBeCloseTo(2.2, 5);
  });

  it('computeBlended matches the vector = 700,000', () => {
    expect(computeBlended(AGENCY_DEFAULTS)).toBe(700_000);
  });

  it('computeAgencyRate = MAR × ASF × CM', () => {
    expect(computeAgencyRate(AGENCY_DEFAULTS)).toBeCloseTo(384_615 * 2.2 * 1.0, 2);
  });

  it('computeMargin matches the vector = 30% and is healthy', () => {
    const r = computeMargin(AGENCY_DEFAULTS);
    expect(r?.margin).toBeCloseTo(30, 5);
    expect(r?.status).toBe('healthy');
  });

  it('flags a margin below 15% as danger', () => {
    const r = computeMargin({ ...AGENCY_DEFAULTS, pFinal: 100_000_000, cActual: 90_000_000 });
    expect(r?.margin).toBeCloseTo(10, 5);
    expect(r?.status).toBe('danger');
  });

  it('validRoleLines drops empty/zero-hour lines', () => {
    const lines = validRoleLines([
      { role: 'a', hours: 10, rate: 100 },
      { role: '', hours: 5, rate: 100 },
      { role: 'b', hours: 0, rate: 100 },
      { role: 'c', hours: 5, rate: null },
    ]);
    expect(lines).toHaveLength(1);
    expect(lines[0]?.role).toBe('a');
  });
});

describe('AgencyPage', () => {
  it('renders ASF, blended rate, and margin for defaults', async () => {
    render(
      <MemoryRouter>
        <AgencyPage />
      </MemoryRouter>,
    );
    expect(await screen.findByText('۷۰۰٬۰۰۰ تومان')).toBeInTheDocument(); // blended
    expect(screen.getByText('۲٫۲۰')).toBeInTheDocument(); // ASF
    expect(screen.getByText('۳۰٪')).toBeInTheDocument(); // margin
  });
});
