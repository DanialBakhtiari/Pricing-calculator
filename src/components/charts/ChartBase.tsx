import { type ReactNode, useId } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { label } from '@/content/fa';

export interface ChartDataRow {
  label: string;
  value: string;
}

export interface ChartBaseProps {
  /** خلاصه‌ی عددی نمودار برای screen-reader. */
  ariaLabel: string;
  /** جدول داده‌ی متنیِ هم‌ارز (visually-hidden). */
  dataTable: ChartDataRow[];
  onDownload?: () => void;
  children: ReactNode;
  className?: string;
}

/** قاب مشترک نمودارها: role=img + جدول متنی پنهان + دکمه‌ی دانلود PNG (دسترس‌پذیری §نمودار). */
export function ChartBase({
  ariaLabel,
  dataTable,
  onDownload,
  children,
  className,
}: ChartBaseProps) {
  const tableId = useId();
  return (
    <div className="space-y-2">
      <div
        role="img"
        aria-label={ariaLabel}
        aria-describedby={tableId}
        className={cn('relative mx-auto w-full', className)}
      >
        {children}
      </div>

      <table id={tableId} className="sr-only">
        <thead>
          <tr>
            <th scope="col">{label('table.item')}</th>
            <th scope="col">{label('table.value')}</th>
          </tr>
        </thead>
        <tbody>
          {dataTable.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {onDownload ? (
        <div className="text-center">
          <Button type="button" variant="ghost" size="sm" onClick={onDownload}>
            <Download aria-hidden />
            {label('action.downloadImage')}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
