import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { labels } from '@/content/fa';
import { InfoTooltip } from './InfoTooltip';
import { STATUS_TEXT, type BenchmarkStatus } from './benchmark';

export interface ResultCardProps {
  label: string;
  /** مقدارِ از پیش فرمت‌شده (مثلاً خروجی formatToman). */
  value: string;
  tooltip?: string;
  status?: BenchmarkStatus;
  /** توضیح کوتاه زیر عدد. */
  hint?: string;
  'data-tour'?: string;
}

/** کارت نتیجه: عدد بزرگِ تراز + برچسب + tooltip + رنگ محک. */
export function ResultCard({ label, value, tooltip, status, hint, ...rest }: ResultCardProps) {
  return (
    <Card data-tour={rest['data-tour']}>
      <CardContent className="space-y-1">
        <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
          <span>{label}</span>
          {tooltip ? (
            <InfoTooltip content={tooltip} label={`${labels['a11y.explain']} ${label}`} />
          ) : null}
        </div>
        <p
          className={cn(
            'text-2xl font-bold break-words tabular-nums sm:text-3xl',
            status ? STATUS_TEXT[status] : 'text-foreground',
          )}
        >
          {value}
        </p>
        {hint ? <p className="text-muted-foreground text-xs">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}
