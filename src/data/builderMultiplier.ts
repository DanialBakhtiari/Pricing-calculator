// ضریب معماری Page Builder — docs/03 §2.5
export const BUILDER_MULTIPLIER = [
  {
    id: 'standard',
    label: 'Page Builder استاندارد',
    labelEn: 'Standard Page Builder',
    factor: 1.0,
  },
  {
    id: 'custom_style',
    label: 'Builder + CSS/JS سفارشی',
    labelEn: 'Builder + custom CSS/JS',
    factor: 1.3,
  },
  {
    id: 'custom_theme',
    label: 'تم سفارشی کامل (Custom Theme)',
    labelEn: 'Full custom theme',
    min: 1.8,
    max: 2.2,
  },
] as const;

export type BuilderId = (typeof BUILDER_MULTIPLIER)[number]['id'];
