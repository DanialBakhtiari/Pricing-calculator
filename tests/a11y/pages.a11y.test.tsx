import { describe, it, expect, beforeEach, vi } from 'vitest';
import { type ReactElement } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { axe } from 'vitest-axe';
import { useAppStore } from '@/lib/storage/appStore';

// نمودارها به canvas نیاز دارند؛ در axe stub می‌شوند.
vi.mock('@/components/charts/CostDoughnut', () => ({ default: () => <div /> }));
vi.mock('@/components/charts/WaterfallChart', () => ({ default: () => <div /> }));
vi.mock('@/components/charts/RoiChart', () => ({ default: () => <div /> }));

import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { MarPage } from '@/features/mar/MarPage';
import { WebPage } from '@/features/web/WebPage';
import { SeoPage } from '@/features/seo/SeoPage';
import { AgencyPage } from '@/features/agency/AgencyPage';

// رنگ‌سنجی (color-contrast) در jsdom قابل‌محاسبه نیست؛ در فاز Lighthouse بررسی می‌شود.
const AXE_OPTS = { rules: { 'color-contrast': { enabled: false } } };

async function expectNoViolations(ui: ReactElement) {
  const { container } = render(<MemoryRouter>{ui}</MemoryRouter>);
  const results = await axe(container, AXE_OPTS);
  expect(results).toHaveNoViolations();
}

describe('accessibility — axe (no serious violations)', () => {
  beforeEach(() => {
    useAppStore.setState({ welcomeTourDone: true, activeRate: 500_000 });
  });

  it('dashboard', async () => {
    await expectNoViolations(<DashboardPage />);
  });

  it('MAR module', async () => {
    await expectNoViolations(<MarPage />);
  });

  it('web/wordpress module', async () => {
    await expectNoViolations(<WebPage />);
  });

  it('SEO module', async () => {
    await expectNoViolations(<SeoPage />);
  });

  it('agency module', async () => {
    await expectNoViolations(<AgencyPage />);
  });
});
