// پیام‌های سیستمی و اعتبارسنجی — docs/05. دوزبانه (fa/en).
import type { Locale } from '@/lib/i18n/locale';

const fa = {
  negativeInput: 'این مقدار نمی‌تواند منفی باشد.',
  utilizationTooHigh: 'نرخ بهره‌وری نزدیک به ۱ غیرواقعی است؛ معمولاً ۰٫۵۵ تا ۰٫۷۰ درست‌تر است.',
  performanceUnsafe: 'هزینه‌ی پایه کمتر از ۷۰٪ هزینه‌ی واقعی است؛ ریسک شما خیلی بالاست.',
  marginTooLow: 'حاشیه سود زیر ۱۵٪ است؛ قیمت یا فرآیند را بازنگری کنید.',
  scenarioSaved: 'سناریو ذخیره شد.',
  scenarioDeleted: 'سناریو حذف شد.',
  pwaInstall: 'این ابزار را روی دستگاهتان نصب کنید تا آفلاین هم کار کند.',
  pwaUpdate: 'نسخه‌ی جدید آماده است. بارگذاری مجدد؟',
  // اعتبارسنجی عمومی فرم‌ها
  required: 'این فیلد الزامی است.',
  invalidNumber: 'یک عدد معتبر وارد کنید.',
  outOfRange: 'مقدار خارج از بازه‌ی مجاز است.',
} as const;

export type MessageKey = keyof typeof fa;

const en: Record<MessageKey, string> = {
  negativeInput: 'This value cannot be negative.',
  utilizationTooHigh:
    'A utilization rate near 1 is unrealistic; 0.55 to 0.70 is usually more accurate.',
  performanceUnsafe: 'The base fee covers less than 70% of actual cost; your risk is too high.',
  marginTooLow: 'Profit margin is below 15%; revisit your price or your process.',
  scenarioSaved: 'Scenario saved.',
  scenarioDeleted: 'Scenario deleted.',
  pwaInstall: 'Install this tool on your device to use it offline.',
  pwaUpdate: 'A new version is ready. Reload?',
  required: 'This field is required.',
  invalidNumber: 'Enter a valid number.',
  outOfRange: 'The value is out of the allowed range.',
};

export const messages: Record<Locale, Record<MessageKey, string>> = { fa, en };
