import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '@/app/App';
import { useAppStore } from '@/lib/storage/appStore';

describe('App shell (dashboard + theme)', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark');
    localStorage.clear();
    useAppStore.setState({
      theme: 'light',
      activeRate: null,
      welcomeTourDone: true, // skip the first-visit driver.js tour in tests
      scenarios: [],
    });
  });

  it('renders the dashboard heading', async () => {
    render(<App />);
    expect(
      await screen.findByRole('heading', { level: 1, name: 'ماشین‌حساب قیمت‌گذاری' }),
    ).toBeInTheDocument();
  });

  it('toggles the dark theme via the app store and applies the class', async () => {
    const user = userEvent.setup();
    render(<App />);

    // چرخه از «روشن» → «تیره»
    const toggle = await screen.findByRole('button', { name: /تغییر تم/ });
    await user.click(toggle);

    expect(useAppStore.getState().theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
