import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '@/app/App';

describe('App shell (phase 0)', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark');
    localStorage.clear();
  });

  it('renders the Persian welcome heading', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'ماشین‌حساب قیمت‌گذاری' }),
    ).toBeInTheDocument();
  });

  it('toggles the dark theme class on <html> and persists it', async () => {
    const user = userEvent.setup();
    render(<App />);

    const toggle = screen.getByRole('button', { name: 'تیره کردن تم' });
    await user.click(toggle);

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('pricing:theme')).toBe('dark');
  });
});
