import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GuideDialog } from '@/components/common/GuideDialog';

describe('GuideDialog', () => {
  it('opens the module guide with its title and example', async () => {
    const user = userEvent.setup();
    render(<GuideDialog guide="mar" trigger={<button type="button">باز کن</button>} />);

    await user.click(screen.getByRole('button', { name: 'باز کن' }));

    expect(await screen.findByText(/موتور هزینه و MAR/)).toBeInTheDocument();
    expect(screen.getByText(/یک مثال ساده/)).toBeInTheDocument();
    expect(screen.getByText(/۳۸۴٬۶۱۵/)).toBeInTheDocument(); // the worked example
  });
});
