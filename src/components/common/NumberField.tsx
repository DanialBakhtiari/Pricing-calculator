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

  const editDisplay = (v: number) => (formatDisplay ? formatDisplay(v) : toPersianDigits(v));

  // هنگام تایپ: گروه‌بندی هزارگانِ زنده برای فیلدهای پولی؛ ولی اگر کاربر در حال
  // تایپ اعشار باشد، خام نگه می‌داریم تا نقطه‌ی اعشار خورده نشود.
  const handleChange = (raw: string) => {
    const parsed = parsePersianNumber(raw);
    const isNum = raw.trim() !== '' && !Number.isNaN(parsed);
    const typingDecimal = /[.٫]/.test(raw);
    setDraft(formatDisplay && isNum && !typingDecimal ? formatDisplay(parsed) : raw);
    onChange(isNum ? parsed : null);
  };

  const step10 = (dir: 1 | -1) => {
    const next = clamp((value ?? 0) + dir * step, min, max);
    onChange(next);
  };

  return (
    <div className="space-y-1.5" data-tour={rest['data-tour']}>
      <div className="flex items-center gap-1.5">
        <Label htmlFor={id}>{label}</Label>
        {/* واحد کنار لیبل می‌آید (نه داخل اینپوت) تا هرگز روی عدد نیفتد. */}
        {unit ? <span className="text-muted-foreground text-xs">({unit})</span> : null}
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

        <Input
          id={id}
          inputMode="decimal"
          dir="ltr"
          className={cn(
            'h-11 flex-1 text-center text-sm tabular-nums',
            error && 'border-destructive',
          )}
          value={display}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onFocus={() => {
            setEditing(true);
            setDraft(value === null ? '' : editDisplay(value));
          }}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={() => setEditing(false)}
        />

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
