import { formatToman } from '@/lib/format';
import { labels } from '@/content/fa';
import { NumberField, type NumberFieldProps } from './NumberField';

export type MoneyFieldProps = Omit<NumberFieldProps, 'formatDisplay'>;

/** ورودی پول (تومان) با گروه‌بندی هزارگان فارسی هنگام نمایش. */
export function MoneyField({
  unit = labels['unit.toman'],
  step = 1_000_000,
  ...props
}: MoneyFieldProps) {
  return (
    <NumberField
      {...props}
      unit={unit}
      step={step}
      formatDisplay={(v) => formatToman(v, { withUnit: false })}
    />
  );
}
