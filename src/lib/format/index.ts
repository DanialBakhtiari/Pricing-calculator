// لایه‌ی فرمت و RTL فارسی — architecture §4. بدون وابستگی به UI.

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

/** ارقام لاتین (۰–۹) را به فارسی و نقطه‌ی اعشار را به «٫» تبدیل می‌کند. */
export function toPersianDigits(input: string | number): string {
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
  /** افزودن واحد «تومان» (پیش‌فرض true). */
  withUnit?: boolean;
}

/**
 * عدد را به رشته‌ی تومانِ فارسی با جداکننده‌ی هزارگان فرمت می‌کند.
 * گرد‌کردن فقط همین‌جا (لایه‌ی نمایش) رخ می‌دهد — موتور هرگز گرد نمی‌کند.
 */
export function formatToman(value: number, opts?: FormatTomanOptions): string {
  const withUnit = opts?.withUnit ?? true;
  const formatted = new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 0 }).format(value);
  return withUnit ? `${formatted} تومان` : formatted;
}

export interface FormatPercentOptions {
  maximumFractionDigits?: number;
}

/** درصد را با ارقام فارسی و نشانه‌ی «٪» فرمت می‌کند (ورودی در واحد درصد، مثلاً 140). */
export function formatPercent(value: number, opts?: FormatPercentOptions): string {
  const formatted = new Intl.NumberFormat('fa-IR', {
    maximumFractionDigits: opts?.maximumFractionDigits ?? 0,
  }).format(value);
  return `${formatted}٪`;
}
