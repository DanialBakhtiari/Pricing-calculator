import { useEffect } from 'react';
import { useAppStore } from '@/lib/storage/appStore';
import { dirOf, setActiveLocale } from '@/lib/i18n/locale';

/**
 * زبانِ فعال را با appStore همگام می‌کند:
 *  - singletonِ محتوا/فرمت را همزمان در رندر ست می‌کند تا فرزندانِ AppLayout با زبان
 *    جدید رندر شوند (تغییر زبان ⇒ رندر دوباره‌ی AppLayout ⇒ کل درختِ زیرین).
 *  - `<html>` را با `lang`/`dir` درست به‌روزرسانی می‌کند (افکت، پس از کامیت).
 * این هوک در AppLayout صدا زده می‌شود.
 */
export function useApplyLocale(): void {
  const locale = useAppStore((s) => s.locale);
  // همزمان در رندر: مقدار درست قبل از رندرِ فرزندان در دسترس باشد (idempotent).
  setActiveLocale(locale);
  useEffect(() => {
    const el = document.documentElement;
    el.lang = locale;
    el.dir = dirOf(locale);
  }, [locale]);
}
