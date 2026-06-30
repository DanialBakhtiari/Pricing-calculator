// لایه‌ی فرمت و RTL — architecture §4. بدون وابستگی به UI. locale-aware (fa/en).

import { getLocale, type Locale } from '@/lib/i18n/locale';

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

/**
 * ارقام را برای نمایش بر اساس زبان فرمت می‌کند:
 * `fa` ⇒ ارقام فارسی + اعشار «٫»؛ `en` ⇒ ارقام لاتین بدون تغییر.
 * (نام تاریخی حفظ شده تا ~۱۸ محل صدا‌زدن دست‌نخورده بماند.)
 */
export function toPersianDigits(input: string | number, locale: Locale = getLocale()): string {
  if (locale === 'en') return String(input);
  // charAt همیشه string برمی‌گرداند (برای رقم معتبر، رقم فارسی متناظر) — بدون شاخه‌ی اضافی.
  return String(input)
    .replace(/[0-9]/g, (d) => PERSIAN_DIGITS.charAt(Number(d)))
    .replace(/\./g, '٫');
}

/** ارقام فارسی و عربی را به لاتین برمی‌گرداند (برای parse داخلی). */
function toLatinDigits(input: string): string {
  return input
    .replace(/[۰-۹]/g, (d) => String(PERSIAN_DIGITS.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(ARABIC_DIGITS.indexOf(d)));
}

/**
 * هر ورودی کاربر (فارسی/عربی/لاتین، با جداکننده‌ی هزارگان یا اعشار فارسی) را
 * به `number` خام نرمال‌سازی می‌کند. ورودی نامعتبر ⇒ `NaN`.
 */
export function parsePersianNumber(input: string | number): number {
  if (typeof input === 'number') return input;

  let s = toLatinDigits(input.trim());
  // اعشار فارسی (٫) و عربی به نقطه
  s = s.replace(/٫/g, '.');
  // جداکننده‌های هزارگان و فاصله‌ها: ، (،) ٬ (٬) , فاصله‌های \s و نیم‌فاصله ‌
  s = s.replace(/[،٬,\s‌]/g, '');
  // هر چیز غیر از رقم/نقطه/علامت منفی حذف شود
  s = s.replace(/[^0-9.-]/g, '');

  if (s === '' || s === '-' || s === '.' || s === '-.') return NaN;
  return Number(s);
}

export interface FormatTomanOptions {
  /** افزودن واحد «تومان»/«Toman» (پیش‌فرض true). */
  withUnit?: boolean;
  locale?: Locale;
}

const intlLocale = (locale: Locale): string => (locale === 'en' ? 'en-US' : 'fa-IR');

/**
 * عدد را به رشته‌ی پولِ بومی با جداکننده‌ی هزارگان فرمت می‌کند (تومان/Toman).
 * گرد‌کردن فقط همین‌جا (لایه‌ی نمایش) رخ می‌دهد — موتور هرگز گرد نمی‌کند.
 */
export function formatToman(value: number, opts?: FormatTomanOptions): string {
  const withUnit = opts?.withUnit ?? true;
  const locale = opts?.locale ?? getLocale();
  const formatted = new Intl.NumberFormat(intlLocale(locale), {
    maximumFractionDigits: 0,
  }).format(value);
  if (!withUnit) return formatted;
  return locale === 'en' ? `${formatted} Toman` : `${formatted} تومان`;
}

export interface FormatPercentOptions {
  maximumFractionDigits?: number;
  locale?: Locale;
}

/** درصد را با ارقام بومی و نشانه‌ی «٪»/«%» فرمت می‌کند (ورودی در واحد درصد، مثلاً 140). */
export function formatPercent(value: number, opts?: FormatPercentOptions): string {
  const locale = opts?.locale ?? getLocale();
  const formatted = new Intl.NumberFormat(intlLocale(locale), {
    maximumFractionDigits: opts?.maximumFractionDigits ?? 0,
  }).format(value);
  return locale === 'en' ? `${formatted}%` : `${formatted}٪`;
}
