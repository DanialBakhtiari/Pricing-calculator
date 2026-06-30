import { useEffect } from 'react';
import { useAppStore } from '@/lib/storage/appStore';

/** کلاس `.dark` روی <html> را با تم فعالِ appStore همگام نگه می‌دارد. */
export function useApplyTheme(): void {
  const theme = useAppStore((s) => s.theme);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
}
