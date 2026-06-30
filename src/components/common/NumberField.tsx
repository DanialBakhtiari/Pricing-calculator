import { useId, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { parsePersianNumber, toPersianDigits } from '@/lib/format';
import { labels } from '@/content/fa';
import { InfoTooltip } from './InfoTooltip';

export interface NumberFieldProps {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  /** متن tooltip (از content/fa). */
  tooltip?: string;
  /** پسوند واحد (مثلاً «تومان»، «ساعت»، «٪»). */
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  error?: string;
  placeholder?: string;
  /** نمایش مقدار وقتی در حال ویرایش نیست (مثلاً گروه‌بندی هزارگان برای پول). */
  formatDisplay?: (value: number) => string;
  /** نشان‌گذاری برای تور آموزشی. */
  'data-tour'?: string;
}

function clamp(value: number, min?: number, max?: number): number {
  let v = value;
  if (min !== undefined && v < min) v = min;
  if (max !== undefined && v > max) v = max;
  return v;
}

export function NumberField({
  label,
  value,
  onChange,
  tooltip,
  unit,
  min,
  max,
  step = 1,
  error,
  placeholder,
  formatDisplay,
  ...rest
}: NumberFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');

  const display = editing
    ? draft
    : value === null
      ? ''
      : (formatDisplay?.(value) ?? toPersianDigits(value));

  const commit = (raw: string) => {
    const parsed = parsePersianNumber(raw);
    onChange(raw.trim() === '' || Number.isNaN(parsed) ? null : parsed);
  };

  const step10 = (dir: 1 | -1) => {
    const next = clamp((value ?? 0) + dir * step, min, max);
    onChange(next);
  };

  return (
    <div className="space-y-1.5" data-tour={rest['data-tour']}>
      <div className="flex items-center gap-1.5">
        <Label htmlFor={id}>{label}</Label>
        {tooltip ? (
          <InfoTooltip content={tooltip} label={`${labels['a11y.explain']} ${label}`} />
        ) : null}
      </div>

      <div className="flex items-stretch gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-11 shrink-0"
          aria-label={`${labels['a11y.decrease']} ${label}`}
          onClick={() => step10(-1)}
        >
          <Minus aria-hidden />
        </Button>

        <div className="relative flex-1">
          <Input
            id={id}
            inputMode="decimal"
            dir="ltr"
            className={cn('h-11 text-center tabular-nums', unit && 'pe-14')}
            value={display}
            placeholder={placeholder}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            onFocus={() => {
              setEditing(true);
              setDraft(value === null ? '' : toPersianDigits(value));
            }}
            onChange={(e) => {
              setDraft(e.target.value);
              commit(e.target.value);
            }}
            onBlur={() => setEditing(false)}
          />
          {unit ? (
            <span className="text-muted-foreground pointer-events-none absolute inset-y-0 end-3 flex items-center text-xs">
              {unit}
            </span>
          ) : null}
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-11 shrink-0"
          aria-label={`${labels['a11y.increase']} ${label}`}
          onClick={() => step10(1)}
        >
          <Plus aria-hidden />
        </Button>
      </div>

      {error ? (
        <p id={errorId} className="text-destructive text-xs" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
