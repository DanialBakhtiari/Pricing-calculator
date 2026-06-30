import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InfoTooltip } from '@/components/common/InfoTooltip';

function setCoarsePointer(coarse: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: coarse,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

describe('InfoTooltip', () => {
  it('renders an accessible help button with the given label', () => {
    setCoarsePointer(true);
    render(<InfoTooltip content="متن راهنما" label="توضیح نرخ" />);
    expect(screen.getByRole('button', { name: 'توضیح نرخ' })).toBeInTheDocument();
  });

  it('opens content on tap when the pointer is coarse (mobile)', async () => {
    setCoarsePointer(true);
    const user = userEvent.setup();
    render(<InfoTooltip content="توضیح فیلد بهره‌وری" label="توضیح" />);

    await user.click(screen.getByRole('button', { name: 'توضیح' }));
    expect(await screen.findByText('توضیح فیلد بهره‌وری')).toBeInTheDocument();
  });
});
