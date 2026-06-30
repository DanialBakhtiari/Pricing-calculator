import { describe, it, expect, afterEach } from 'vitest';
import { setActiveLocale, getLocale, dirOf, DEFAULT_LOCALE, LOCALES } from '@/lib/i18n/locale';
import { label, tooltip, message, moduleText, guide, tour, webTiers } from '@/content/fa';
import { formatToman, formatPercent, toPersianDigits } from '@/lib/format';
import { useAppStore } from '@/lib/storage/appStore';

// هر تست را با زبان پیش‌فرض شروع کن تا نشت نکند.
afterEach(() => setActiveLocale(DEFAULT_LOCALE));

describe('locale singleton', () => {
  it('defaults to Persian (rtl)', () => {
    expect(DEFAULT_LOCALE).toBe('fa');
    expect(getLocale()).toBe('fa');
    expect(LOCALES).toEqual(['fa', 'en']);
    expect(dirOf('fa')).toBe('rtl');
    expect(dirOf('en')).toBe('ltr');
  });

  it('fa accessors return Persian content', () => {
    setActiveLocale('fa');
    expect(label('app.title')).toBe('ماشین‌حساب قیمت‌گذاری');
    expect(moduleText('mar').name).toBe('موتور هزینه و MAR');
    expect(tooltip('mar.direct')).toContain('مستقیم');
    expect(message('required')).toBe('این فیلد الزامی است.');
  });

  it('en accessors return English content with identical keys', () => {
    setActiveLocale('en');
    expect(label('app.title')).toBe('Pricing Calculator');
    expect(moduleText('mar').name).toBe('Cost Engine & MAR');
    expect(message('required')).toBe('This field is required.');
    expect(tooltip('mar.direct').length).toBeGreaterThan(0);
    expect(guide('welcome').sections.length).toBeGreaterThan(0);
    expect(tour('mar').length).toBeGreaterThan(0);
    expect(webTiers().some((t) => t.recommended)).toBe(true);
  });

  it('formatters follow the active locale', () => {
    setActiveLocale('fa');
    expect(formatToman(300000)).toBe('۳۰۰٬۰۰۰ تومان');
    expect(formatPercent(140)).toBe('۱۴۰٪');
    expect(toPersianDigits(5)).toBe('۵');

    setActiveLocale('en');
    expect(formatToman(300000)).toBe('300,000 Toman');
    expect(formatToman(1000, { withUnit: false })).toBe('1,000');
    expect(formatPercent(140)).toBe('140%');
    expect(toPersianDigits(5)).toBe('5');
  });

  it('explicit locale option overrides the active locale', () => {
    setActiveLocale('fa');
    expect(formatToman(1000, { locale: 'en' })).toBe('1,000 Toman');
    expect(toPersianDigits(7, 'en')).toBe('7');
  });
});

describe('appStore locale', () => {
  it('toggles between fa and en', () => {
    const { setLocale, toggleLocale } = useAppStore.getState();
    setLocale('fa');
    toggleLocale();
    expect(useAppStore.getState().locale).toBe('en');
    toggleLocale();
    expect(useAppStore.getState().locale).toBe('fa');
  });
});
