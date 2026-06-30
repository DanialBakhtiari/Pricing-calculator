import { describe, it, expect, afterEach } from 'vitest';
import { detectPlatform, isStandalone } from '@/app/use-pwa-install';
import { useAppStore } from '@/lib/storage/appStore';
import { installGuide } from '@/content/fa';
import { setActiveLocale, DEFAULT_LOCALE } from '@/lib/i18n/locale';

afterEach(() => setActiveLocale(DEFAULT_LOCALE));

describe('pwa install', () => {
  it('detects a known platform', () => {
    expect(['ios', 'android', 'desktop']).toContain(detectPlatform());
  });

  it('is not standalone in a normal browser context', () => {
    expect(isStandalone()).toBe(false);
  });

  it('store remembers that the install hint was shown', () => {
    useAppStore.setState({ installHintSeen: false });
    useAppStore.getState().markInstallHintSeen();
    expect(useAppStore.getState().installHintSeen).toBe(true);
  });

  it('install guide covers all three platforms in both languages', () => {
    setActiveLocale('fa');
    const fa = installGuide();
    expect([...fa.map((p) => p.id)].sort()).toEqual(['android', 'desktop', 'ios']);
    fa.forEach((p) => expect(p.steps.length).toBeGreaterThan(0));

    setActiveLocale('en');
    const en = installGuide();
    expect([...en.map((p) => p.id)].sort()).toEqual(['android', 'desktop', 'ios']);
    en.forEach((p) => expect(p.steps.length).toBeGreaterThan(0));
  });
});
