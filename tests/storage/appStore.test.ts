import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '@/lib/storage/appStore';

describe('appStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useAppStore.setState({
      theme: 'light',
      activeRate: null,
      welcomeTourDone: false,
      scenarios: [],
    });
  });

  it('cycles theme system → light → dark, and setTheme sets directly', () => {
    useAppStore.setState({ theme: 'system' });
    useAppStore.getState().toggleTheme();
    expect(useAppStore.getState().theme).toBe('light');
    useAppStore.getState().toggleTheme();
    expect(useAppStore.getState().theme).toBe('dark');
    useAppStore.getState().toggleTheme();
    expect(useAppStore.getState().theme).toBe('system');
    useAppStore.getState().setTheme('dark');
    expect(useAppStore.getState().theme).toBe('dark');
  });

  it('stores the shared active rate', () => {
    useAppStore.getState().setActiveRate(384_615);
    expect(useAppStore.getState().activeRate).toBe(384_615);
    useAppStore.getState().setActiveRate(null);
    expect(useAppStore.getState().activeRate).toBeNull();
  });

  it('marks the welcome tour as done', () => {
    expect(useAppStore.getState().welcomeTourDone).toBe(false);
    useAppStore.getState().markWelcomeTourDone();
    expect(useAppStore.getState().welcomeTourDone).toBe(true);
  });

  it('adds newest-first, removes, and clears scenarios', () => {
    const s1 = useAppStore
      .getState()
      .addScenario({ module: 'mar', title: 'الف', inputs: { x: 1 } });
    const s2 = useAppStore.getState().addScenario({ module: 'web', title: 'ب', inputs: {} });

    expect(useAppStore.getState().scenarios).toHaveLength(2);
    expect(useAppStore.getState().scenarios[0]?.id).toBe(s2.id); // newest first
    expect(s1.id).not.toBe(s2.id);

    useAppStore.getState().removeScenario(s1.id);
    expect(useAppStore.getState().scenarios).toHaveLength(1);

    useAppStore.getState().clearScenarios();
    expect(useAppStore.getState().scenarios).toHaveLength(0);
  });

  it('falls back to a non-crypto id when randomUUID is unavailable', () => {
    const holder = crypto as { randomUUID?: unknown };
    const original = holder.randomUUID;
    holder.randomUUID = undefined;
    try {
      const s = useAppStore.getState().addScenario({ module: 'mar', title: 'x', inputs: {} });
      expect(s.id).toMatch(/^s_/);
    } finally {
      holder.randomUUID = original;
    }
  });
});
