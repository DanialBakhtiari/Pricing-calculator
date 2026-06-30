import { toPersianDigits } from '@/lib/format';
import { labels } from '@/content/fa';
import { NumberField, type NumberFieldProps } from './NumberField';

export type PercentFieldProps = Omit<NumberFieldProps, 'formatDisplay'>;

/** ورودی درصد (مقدار در واحد درصد، مثلاً 50 برای ۵۰٪). */
export function PercentField({ unit = labels['unit.percent'], ...props }: PercentFieldProps) {
  return <NumberField {...props} unit={unit} formatDisplay={(v) => toPersianDigits(v)} />;
}
