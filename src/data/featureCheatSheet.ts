// جدول طلایی ویژگی‌ها (Cheat Sheet) — docs/03 §2.8
// hoursMax برای ردیف‌های «+۳۰۰» و «+۱۰۰» سقف پایه است؛ openEnded یعنی می‌تواند بیشتر شود.
export interface FeatureRow {
  id: string;
  label: string;
  hoursMin: number;
  hoursMax: number;
  cmMin: number;
  cmMax: number;
  openEnded?: boolean;
  perMonth?: boolean;
}

export const FEATURE_CHEAT_SHEET = [
  {
    id: 'wp-setup',
    label: 'نصب و پیکربندی اولیه وردپرس',
    hoursMin: 2,
    hoursMax: 4,
    cmMin: 1.0,
    cmMax: 1.0,
  },
  {
    id: 'landing-template',
    label: 'لندینگ‌پیج (قالب آماده)',
    hoursMin: 8,
    hoursMax: 15,
    cmMin: 1.0,
    cmMax: 1.0,
  },
  {
    id: 'landing-custom',
    label: 'لندینگ با UI/UX سفارشی',
    hoursMin: 20,
    hoursMax: 40,
    cmMin: 1.3,
    cmMax: 1.5,
  },
  {
    id: 'corporate-site',
    label: 'سایت شرکتی ۵–۱۰ صفحه',
    hoursMin: 30,
    hoursMax: 60,
    cmMin: 1.2,
    cmMax: 1.2,
  },
  {
    id: 'woocommerce-standard',
    label: 'فروشگاه ووکامرس استاندارد',
    hoursMin: 40,
    hoursMax: 80,
    cmMin: 1.4,
    cmMax: 1.4,
  },
  {
    id: 'tax-script',
    label: 'اسکریپت مالیات منطقه‌ای سفارشی',
    hoursMin: 15,
    hoursMax: 30,
    cmMin: 2.0,
    cmMax: 2.0,
  },
  {
    id: 'shipping-automation',
    label: 'اتوماسیون حمل‌ونقل سفارشی',
    hoursMin: 20,
    hoursMax: 40,
    cmMin: 1.8,
    cmMax: 2.2,
  },
  {
    id: 'multivendor-platform',
    label: 'پلتفرم چندفروشندگی',
    hoursMin: 120,
    hoursMax: 300,
    cmMin: 2.3,
    cmMax: 2.5,
    openEnded: true,
  },
  {
    id: 'custom-plugin',
    label: 'توسعه پلاگین سفارشی از صفر',
    hoursMin: 30,
    hoursMax: 100,
    cmMin: 1.8,
    cmMax: 2.2,
    openEnded: true,
  },
  {
    id: 'multilang-setup',
    label: 'راه‌اندازی چندزبانه',
    hoursMin: 10,
    hoursMax: 25,
    cmMin: 1.3,
    cmMax: 1.3,
  },
  {
    id: 'security-hardening',
    label: 'سخت‌سازی امنیتی',
    hoursMin: 8,
    hoursMax: 15,
    cmMin: 1.2,
    cmMax: 1.2,
  },
  {
    id: 'speed-cwv',
    label: 'بهینه‌سازی سرعت/CWV',
    hoursMin: 10,
    hoursMax: 20,
    cmMin: 1.4,
    cmMax: 1.4,
  },
  { id: 'site-migration', label: 'مهاجرت سایت', hoursMin: 5, hoursMax: 12, cmMin: 1.3, cmMax: 1.3 },
  {
    id: 'api-integration',
    label: 'یکپارچه‌سازی API شخص ثالث',
    hoursMin: 20,
    hoursMax: 60,
    cmMin: 1.9,
    cmMax: 2.2,
  },
  {
    id: 'monthly-maintenance',
    label: 'نگهداری ماهانه استاندارد',
    hoursMin: 4,
    hoursMax: 8,
    cmMin: 1.0,
    cmMax: 1.0,
    perMonth: true,
  },
] as const satisfies readonly FeatureRow[];

export type FeatureId = (typeof FEATURE_CHEAT_SHEET)[number]['id'];
