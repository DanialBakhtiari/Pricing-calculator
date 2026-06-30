// جدول مرجع ضریب پیچیدگی CM — docs/03 §2.3
export const CM_LEVELS = [
  { id: 'simple', label: 'ساده', min: 1.0, max: 1.0, example: 'لندینگ با قالب آماده' },
  { id: 'medium', label: 'متوسط', min: 1.3, max: 1.5, example: 'سایت چندصفحه‌ای با فرم سفارشی' },
  { id: 'complex', label: 'پیچیده', min: 1.6, max: 2.0, example: 'ووکامرس با اتوماسیون مالیات' },
  {
    id: 'very_complex',
    label: 'بسیار پیچیده',
    min: 2.1,
    max: 2.5,
    example: 'مارکت‌پلیس چندفروشندگی / ERP',
  },
] as const;

export type CmLevelId = (typeof CM_LEVELS)[number]['id'];
