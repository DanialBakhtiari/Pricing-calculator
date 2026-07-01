import { useEffect } from 'react';
import { useAppStore } from '@/lib/storage/appStore';

/**
 * کلاس `.dark` روی <html> را با تمِ فعال همگام می‌کند.
 * حالتِ «system» از تنظیماتِ دستگاه (`prefers-color-scheme`) پیروی می‌کند و به
 * تغییرِ زنده‌ی آن هم واکنش می‌دهد (روی PC/iOS/Android). «light»/«dark» صریح‌اند.
 */
export function useApplyTheme(): void {
  const theme = useAppStore((s) => s.theme);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && mq.matches);
      document.documentElement.classList.toggle('dark', dark);
    };
    apply();
    if (theme !== 'system') return;
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [theme]);
}
