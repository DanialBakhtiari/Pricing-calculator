/** خواندن مقدار یک CSS variable از ریشه — برای رنگ‌بندی Chart.js از توکن‌های OKLCH تم. */
export function cssVar(name: string, fallback = '#888888'): string {
  if (typeof document === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

export const CHART_FONT_FAMILY = 'Vazirmatn Variable';
