import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MoneyField } from '@/components/common/MoneyField';

describe('MoneyField', () => {
  it('groups thousands live while typing and reports the raw number', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MoneyField label="نرخ" value={null} onChange={onChange} />);

    const input = screen.getByLabelText<HTMLInputElement>('نرخ');
    await user.type(input, '1500000');

    expect(onChange).toHaveBeenLastCalledWith(1_500_000);
    expect(input.value).toBe('۱٬۵۰۰٬۰۰۰'); // Persian thousands separator
  });

  it('shows the grouped value (not raw) for an existing amount', () => {
    render(<MoneyField label="نرخ" value={2_400_000} onChange={vi.fn()} />);
    expect(screen.getByLabelText<HTMLInputElement>('نرخ').value).toBe('۲٬۴۰۰٬۰۰۰');
  });
});
