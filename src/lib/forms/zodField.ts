import { z } from 'zod';
import { message } from '@/content/fa';

export interface NumberFieldRule {
  min?: number;
  max?: number;
  /** اجازه‌ی مقدار منفی (پیش‌فرض: خیر — کف صفر). */
  allowNegative?: boolean;
}

/**
 * اسکیمای zod برای یک فیلد عددی فرم.
 * ورودی `number | null` است؛ null/NaN ⇒ پیام «عدد معتبر»، خارج از بازه ⇒ پیام مربوط.
 * پیام‌ها از content/fa (i18n-ready).
 */
export function numberFieldSchema(rule: NumberFieldRule = {}) {
  let schema = z.number({ error: () => message('invalidNumber') });

  const lowerBound = rule.min ?? (rule.allowNegative ? undefined : 0);
  if (lowerBound !== undefined) {
    const msgKey = rule.min === undefined ? 'negativeInput' : 'outOfRange';
    schema = schema.min(lowerBound, { error: () => message(msgKey) });
  }
  if (rule.max !== undefined) {
    schema = schema.max(rule.max, { error: () => message('outOfRange') });
  }

  return z.preprocess((v) => v ?? NaN, schema);
}
