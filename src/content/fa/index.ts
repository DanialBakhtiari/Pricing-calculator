// لایه‌ی محتوای فارسی — تنها منبع متن‌ها (i18n-ready). UI فقط از این accessorها بخواند.
import { tooltips, type TooltipKey } from './tooltips';
import { messages, type MessageKey } from './messages';
import { labels, type LabelKey } from './labels';

export { tooltips, messages, labels };
export { MODULES } from './labels';
export type { TooltipKey } from './tooltips';
export type { MessageKey } from './messages';
export type { LabelKey, ModuleId } from './labels';
export { tours } from './tours';
export type { TourKey, TourStep } from './tours';
export { WEB_TIERS } from './web';
export type { WebTierContentId } from './web';
export { BRAND } from './brand';
export { guides } from './guides';
export type { GuideKey, Guide } from './guides';

/** متن tooltip یک فیلد. */
export const tooltip = (key: TooltipKey): string => tooltips[key];

/** پیام سیستمی/اعتبارسنجی. */
export const message = (key: MessageKey): string => messages[key];

/** برچسب UI. */
export const label = (key: LabelKey): string => labels[key];
