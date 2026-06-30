import { Info } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { labels } from '@/content/fa';
import { useCoarsePointer } from './use-coarse-pointer';

export interface InfoTooltipProps {
  /** متن توضیح (از content/fa). */
  content: string;
  /** برچسب دسترس‌پذیری دکمه (پیش‌فرض «توضیح این فیلد»). */
  label?: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

/**
 * آیکن «!» راهنما — دسکتاپ: Tooltip روی hover/focus؛ موبایل (اشاره‌گر درشت): Popover روی tap.
 * دسترس‌پذیر: دکمه‌ی قابل‌فوکوس با aria-label، بستن با Esc (رفتار پیش‌فرض Radix).
 */
export function InfoTooltip({
  content,
  label = labels['a11y.fieldHelp'],
  side = 'top',
  className,
}: InfoTooltipProps) {
  const coarse = useCoarsePointer();

  const trigger = (
    <button
      type="button"
      aria-label={label}
      className={cn(
        'text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex size-5 shrink-0 items-center justify-center rounded-full outline-none focus-visible:ring-2',
        className,
      )}
    >
      <Info aria-hidden className="size-3.5" />
    </button>
  );

  if (coarse) {
    return (
      <Popover>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent side={side} className="max-w-xs text-sm leading-6">
          {content}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent side={side} className="max-w-xs text-sm leading-6">
        {content}
      </TooltipContent>
    </Tooltip>
  );
}
