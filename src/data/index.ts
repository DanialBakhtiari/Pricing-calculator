// جدول‌های داده‌ی مرجع (برای UI: dropdown، چک‌باکس، Cheat Sheet). docs/03 منبع حقیقت.
import { getLocale } from '@/lib/i18n/locale';

export * from './cmLevels';
export * from './rbFactors';
export * from './builderMultiplier';
export * from './featureCheatSheet';
export * from './auditComponents';
export * from './scaleStages';
export * from './seoPackages';

/** برچسب بومیِ یک ردیفِ داده، به زبان فعال. */
export const pickLabel = (item: { label: string; labelEn: string }): string =>
  getLocale() === 'en' ? item.labelEn : item.label;

/** مثال بومیِ یک ردیفِ داده (مثلاً در CM_LEVELS)، به زبان فعال. */
export const pickExample = (item: { example: string; exampleEn: string }): string =>
  getLocale() === 'en' ? item.exampleEn : item.example;
