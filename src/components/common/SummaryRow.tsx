export interface SummaryRowProps {
  label: string;
  value: string;
}

/** ردیف برچسب↔مقدار در کارت خلاصه؛ مقدار بلند wrap می‌شود نه سرریز. */
export function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="min-w-0 text-end break-words tabular-nums">{value}</span>
    </div>
  );
}
