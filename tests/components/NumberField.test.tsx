import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NumberField } from '@/components/common/NumberField';

describe('NumberField', () => {
  it('emits a raw number when the user types Persian digits', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<NumberField label="ساعت" value={null} onChange={onChange} />);

    await user.type(screen.getByLabelText('ساعت'), '۴۸');
    expect(onChange).toHaveBeenLastCalledWith(48);
  });

  it('steps the value with the increment button', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<NumberField label="ساعت" value={10} onChange={onChange} step={5} />);

    await user.click(screen.getByRole('button', { name: 'افزایش ساعت' }));
    expect(onChange).toHaveBeenCalledWith(15);
  });

  it('reports null when the field is cleared', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<NumberField label="ساعت" value={12} onChange={onChange} />);

    await user.clear(screen.getByLabelText('ساعت'));
    expect(onChange).toHaveBeenLastCalledWith(null);
  });

  it('shows the error message linked via aria-describedby', () => {
    render(
      <NumberField label="ساعت" value={null} onChange={vi.fn()} error="یک عدد معتبر وارد کنید." />,
    );
    const input = screen.getByLabelText('ساعت');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('یک عدد معتبر وارد کنید.');
  });
});
