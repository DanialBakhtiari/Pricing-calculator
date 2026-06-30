import { cn } from '@/lib/utils';
import { toPersianDigits } from '@/lib/format';
import { label } from '@/content/fa';
import {
  classify,
  STATUS_BG,
  STATUS_TEXT,
  type BenchmarkSegment,
  type BenchmarkStatus,
} from './benchmark';

export interface BenchmarkBarProps {
  value: number;
  min: number;
  max: number;
  segments: BenchmarkSegment[];
  /** متن وضعیت‌ها (از content/fa): سالم/احتیاط/خطر. */
  statusLabel: Record<BenchmarkStatus, string>;
  formatValue?: (value: number) => string;
}

function pct(value: number, min: number, max: number): number {
  if (max <= min) return 0;
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
}

/** نوار محک: بازه‌های رنگیِ سالم/احتیاط/خطر + نشانگر مقدار + متن وضعیت (نه فقط رنگ). */
export function BenchmarkBar({
  value,
  min,
  max,
  segments,
  statusLabel,
  formatValue,
}: BenchmarkBarProps) {
  const status = classify(value, segments);
  const markerPct = pct(value, min, max);
  const valueText = formatValue ? formatValue(value) : toPersianDigits(value);

  return (
    <div className="space-y-1.5">
      <div
        className="relative h-2 w-full overflow-hidden rounded-full"
        role="img"
        aria-label={`${valueText} — ${label('a11y.status')}: ${statusLabel[status]}`}
      >
        <div className="absolute inset-0 flex">
          {segments.map((s) => (
            <div
              key={`${s.from}-${s.to}-${s.status}`}
              className={cn('h-full', STATUS_BG[s.status])}
              style={{ width: `${pct(s.to, min, max) - pct(s.from, min, max)}%` }}
            />
          ))}
        </div>
        <div
          className="border-background bg-foreground absolute top-1/2 size-3 -translate-y-1/2 rounded-full border-2"
          style={{ insetInlineStart: `calc(${markerPct}% - 0.375rem)` }}
        />
      </div>
      <div className="flex items-center gap-1.5 text-xs">
        <span className={cn('size-2 rounded-full', STATUS_BG[status])} aria-hidden />
        <span className={cn('font-medium', STATUS_TEXT[status])}>{statusLabel[status]}</span>
      </div>
    </div>
  );
}
