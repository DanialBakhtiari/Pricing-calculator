// پیام‌های سیستمی و اعتبارسنجی — docs/05.
export const messages = {
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

export type MessageKey = keyof typeof messages;
