// جدول مرجع ضریب پیچیدگی CM — docs/03 §2.3
export const CM_LEVELS = [
  {
    id: 'simple',
    label: 'ساده',
    labelEn: 'Simple',
    min: 1.0,
    max: 1.0,
    example: 'لندینگ با قالب آماده',
    exampleEn: 'Landing page with a prebuilt template',
  },
  {
    id: 'medium',
    label: 'متوسط',
    labelEn: 'Medium',
    min: 1.3,
    max: 1.5,
    example: 'سایت چندصفحه‌ای با فرم سفارشی',
    exampleEn: 'Multi-page site with a custom form',
  },
  {
    id: 'complex',
    label: 'پیچیده',
    labelEn: 'Complex',
    min: 1.6,
    max: 2.0,
    example: 'ووکامرس با اتوماسیون مالیات',
    exampleEn: 'WooCommerce with tax automation',
  },
  {
    id: 'very_complex',
    label: 'بسیار پیچیده',
    labelEn: 'Very complex',
    min: 2.1,
    max: 2.5,
    example: 'مارکت‌پلیس چندفروشندگی / ERP',
    exampleEn: 'Multi-vendor marketplace / ERP',
  },
] as const;

export type CmLevelId = (typeof CM_LEVELS)[number]['id'];
