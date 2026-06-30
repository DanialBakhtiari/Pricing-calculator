// تک‌منبعِ «زبان فعال» — هم لایه‌ی محتوا (content/fa) و هم لایه‌ی فرمت (lib/format)
// آن را می‌خوانند. ماژولِ برگ (بدون وابستگی) تا چرخه‌ی import نسازد.
// مقدارش را appStore از طریق useApplyLocale همگام می‌کند.

export type Locale = 'fa' | 'en';

export const LOCALES: readonly Locale[] = ['fa', 'en'] as const;

export const DEFAULT_LOCALE: Locale = 'fa';

let active: Locale = DEFAULT_LOCALE;

/** زبان فعالِ فعلی (برای accessorهای محتوا و توابع فرمت). */
export function getLocale(): Locale {
  return active;
}

/** زبان فعال را تنظیم می‌کند. فقط از useApplyLocale صدا زده شود. */
export function setActiveLocale(locale: Locale): void {
  active = locale;
}

/** جهت متن متناظر با زبان. */
export function dirOf(locale: Locale): 'rtl' | 'ltr' {
  return locale === 'fa' ? 'rtl' : 'ltr';
}
