// محتوای سه‌سطحی ماژول وب/وردپرس — نام و ویژگی‌های هر سطح (Price Anchoring §2.9).
export const WEB_TIERS = [
  {
    id: 'essential',
    name: 'پایه',
    features: ['اجرای دامنه‌ی اصلی پروژه', 'بدون بافر ریسک کامل', 'پشتیبانی پایه'],
  },
  {
    id: 'professional',
    name: 'حرفه‌ای',
    features: ['دامنه‌ی کامل + بافر ریسک', 'قیمت قابل‌دفاع', 'پشتیبانی استاندارد'],
    recommended: true,
  },
  {
    id: 'enterprise',
    name: 'سازمانی',
    features: ['همه‌ی موارد حرفه‌ای', 'نگهداری سالانه', 'بهینه‌سازی عملکرد/CWV'],
  },
] as const;

export type WebTierContentId = (typeof WEB_TIERS)[number]['id'];
