// ضریب معماری Page Builder — docs/03 §2.5
export const BUILDER_MULTIPLIER = [
  { id: 'standard', label: 'Page Builder استاندارد', factor: 1.0 },
  { id: 'custom_style', label: 'Builder + CSS/JS سفارشی', factor: 1.3 },
  { id: 'custom_theme', label: 'تم سفارشی کامل (Custom Theme)', min: 1.8, max: 2.2 },
] as const;

export type BuilderId = (typeof BUILDER_MULTIPLIER)[number]['id'];
