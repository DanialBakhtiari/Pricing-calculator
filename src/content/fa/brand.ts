// اطلاعات سازنده — امضای پروژه. نام نویسنده دوزبانه؛ لینک‌ها مشترک.
import type { Locale } from '@/lib/i18n/locale';

export const BRAND = {
  author: { fa: 'دانیال بختیاری', en: 'Danial Bakhtiari' } as Record<Locale, string>,
  site: 'https://danialbakhtiari.com',
  github: 'https://github.com/danialbakhtiari',
} as const;
