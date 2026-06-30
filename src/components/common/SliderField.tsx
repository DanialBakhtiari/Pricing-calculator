import { useId } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { toPersianDigits } from '@/lib/format';
import { labels } from '@/content/fa';
import { InfoTooltip } from './InfoTooltip';

export interface SliderFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  tooltip?: string;
  min: number;
  max: number;
  step: number;
  /** نمایش مقدار کنار برچسب (مثلاً «۰٫۶۵» یا «۱٫۸×»). */
  formatValue?: (value: number) => string;
  'data-tour'?: string;
}

/** ورودی اسلایدری برای نسبت‌ها/ضرایب (U_rate، CM، RB). RTL-aware. */
export function SliderField({
  label,
  value,
  onChange,
  tooltip,
  min,
  max,
  step,
  formatValue,
  ...rest
}: SliderFieldProps) {
  const labelId = useId();
  return (
    <div className="space-y-2" data-tour={rest['data-tour']}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Label id={labelId}>{label}</Label>
          {tooltip ? (
            <InfoTooltip content={tooltip} label={`${labels['a11y.explain']} ${label}`} />
          ) : null}
        </div>
        <span className="text-sm font-medium tabular-nums">
          {formatValue ? formatValue(value) : toPersianDigits(value)}
        </span>
      </div>
      <Slider
        dir="rtl"
        aria-labelledby={labelId}
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => onChange(v[0] ?? value)}
      />
    </div>
  );
}
