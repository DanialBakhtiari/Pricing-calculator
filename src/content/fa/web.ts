// محتوای سه‌سطحی ماژول وب/وردپرس — نام و ویژگی‌های هر سطح (Price Anchoring §2.9). دوزبانه (fa/en).
import type { Locale } from '@/lib/i18n/locale';

const fa = [
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

export type WebTierContentId = (typeof fa)[number]['id'];

export interface WebTierContent {
  id: WebTierContentId;
  name: string;
  features: readonly string[];
  recommended?: boolean;
}

const en: readonly WebTierContent[] = [
  {
    id: 'essential',
    name: 'Essential',
    features: ['Core project scope delivered', 'No full risk buffer', 'Basic support'],
  },
  {
    id: 'professional',
    name: 'Professional',
    features: ['Full scope + risk buffer', 'Defensible price', 'Standard support'],
    recommended: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    features: [
      'Everything in Professional',
      'Annual maintenance',
      'Performance / CWV optimization',
    ],
  },
];

export const WEB_TIERS: Record<Locale, readonly WebTierContent[]> = { fa, en };
