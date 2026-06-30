// لایه‌ی محتوا — تنها منبع متن‌ها (دوزبانه fa/en). UI فقط از این accessorها بخواند.
// accessorها زبانِ فعال را از lib/i18n/locale می‌خوانند؛ با تغییر زبان، AppLayout
// دوباره رندر می‌شود و کل درختِ زیرین این توابع را با زبان جدید صدا می‌زند.
import { getLocale } from '@/lib/i18n/locale';
import { tooltips, type TooltipKey } from './tooltips';
import { messages, type MessageKey } from './messages';
import { labels, MODULE_TEXT, type LabelKey, type ModuleId, type ModuleText } from './labels';
import { guides, type GuideKey, type Guide } from './guides';
import { tours, type TourKey, type TourStep } from './tours';
import { WEB_TIERS, type WebTierContent } from './web';

export { tooltips, messages, labels, MODULE_TEXT };
export { MODULES } from './labels';
export type { TooltipKey } from './tooltips';
export type { MessageKey } from './messages';
export type { LabelKey, ModuleId, ModuleText } from './labels';
export { tours };
export type { TourKey, TourStep } from './tours';
export { WEB_TIERS };
export type { WebTierContentId, WebTierContent } from './web';
export { BRAND } from './brand';
export { guides };
export type { GuideKey, Guide } from './guides';

/** متن tooltip یک فیلد (زبان فعال). */
export const tooltip = (key: TooltipKey): string => tooltips[getLocale()][key];

/** پیام سیستمی/اعتبارسنجی (زبان فعال). */
export const message = (key: MessageKey): string => messages[getLocale()][key];

/** برچسب UI (زبان فعال). */
export const label = (key: LabelKey): string => labels[getLocale()][key];

/** نام و توضیح بومیِ یک ماژول (زبان فعال). */
export const moduleText = (id: ModuleId): ModuleText => MODULE_TEXT[getLocale()][id];

/** محتوای مدال آموزشِ یک صفحه (زبان فعال). */
export const guide = (key: GuideKey): Guide => guides[getLocale()][key];

/** گام‌های تور آموزشِ یک کلید (زبان فعال). */
export const tour = (key: TourKey): readonly TourStep[] => tours[getLocale()][key];

/** سه سطح پیشنهادیِ ماژول وب (زبان فعال). */
export const webTiers = (): readonly WebTierContent[] => WEB_TIERS[getLocale()];
