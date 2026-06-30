import { describe, it, expect } from 'vitest';
import { toPersianDigits, parsePersianNumber, formatToman, formatPercent } from '@/lib/format';

describe('format — toPersianDigits', () => {
  it('converts latin digits to Persian', () => {
    expect(toPersianDigits('123')).toBe('۱۲۳');
    expect(toPersianDigits(2026)).toBe('۲۰۲۶');
  });

  it('leaves non-digit characters untouched', () => {
    expect(toPersianDigits('A1٪')).toBe('A۱٪');
  });
});

describe('format — parsePersianNumber', () => {
  it('parses Persian digits with a thousands separator', () => {
    expect(parsePersianNumber('۱۲٬۰۰۰')).toBe(12_000);
  });

  it('parses a Persian decimal separator', () => {
    expect(parsePersianNumber('۱۲٫۵')).toBe(12.5);
  });

  it('parses Arabic-Indic digits', () => {
    expect(parsePersianNumber('٠٫٥')).toBe(0.5);
  });

  it('parses a latin number with comma grouping and decimals', () => {
    expect(parsePersianNumber('1,234.56')).toBe(1234.56);
  });

  it('parses negative numbers', () => {
    expect(parsePersianNumber('-۵۰')).toBe(-50);
  });

  it('strips surrounding non-numeric noise', () => {
    expect(parsePersianNumber('۴۸ هفته')).toBe(48);
  });

  it('passes a number input through unchanged', () => {
    expect(parsePersianNumber(1500)).toBe(1500);
  });

  it('returns NaN for non-numeric input', () => {
    expect(parsePersianNumber('سلام')).toBeNaN();
    expect(parsePersianNumber('')).toBeNaN();
    expect(parsePersianNumber('-')).toBeNaN();
  });
});

describe('format — formatToman', () => {
  it('formats with Persian digits, grouping and the تومان unit', () => {
    expect(formatToman(12_000_000)).toBe('۱۲٬۰۰۰٬۰۰۰ تومان');
  });

  it('omits the unit when asked', () => {
    expect(formatToman(1000, { withUnit: false })).toBe('۱٬۰۰۰');
  });

  it('rounds at the display layer (engine never rounds)', () => {
    // 384_615.38 → ۳۸۴٬۶۱۵
    expect(parsePersianNumber(formatToman(384_615.38, { withUnit: false }))).toBe(384_615);
  });

  it('round-trips an integer through format → parse', () => {
    expect(parsePersianNumber(formatToman(12_345_678, { withUnit: false }))).toBe(12_345_678);
  });
});

describe('format — formatPercent', () => {
  it('formats an integer percent with the ٪ sign', () => {
    expect(formatPercent(140)).toBe('۱۴۰٪');
  });

  it('honors a fraction-digits option', () => {
    expect(formatPercent(33.33, { maximumFractionDigits: 1 })).toBe('۳۳٫۳٪');
  });
});
