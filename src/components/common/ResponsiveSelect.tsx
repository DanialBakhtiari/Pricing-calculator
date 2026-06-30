import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCoarsePointer } from './use-coarse-pointer';

export interface SelectOption {
  value: string;
  label: string;
}

export interface ResponsiveSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: readonly SelectOption[];
  placeholder?: string;
  ariaLabel?: string;
}

/**
 * روی موبایل (اشاره‌گر درشت) از `<select>` بومی استفاده می‌کند تا picker سیستم‌عامل
 * (چرخ/شیت بومی) باز شود — قابل‌اعتمادتر و آشناتر برای کاربر گوشی؛ روی دسکتاپ Select شیک shadcn.
 */
export function ResponsiveSelect({
  value,
  onValueChange,
  options,
  placeholder,
  ariaLabel,
}: ResponsiveSelectProps) {
  const coarse = useCoarsePointer();

  if (coarse) {
    return (
      <select
        value={value}
        aria-label={ariaLabel}
        onChange={(e) => onValueChange(e.target.value)}
        className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-11 w-full rounded-md border px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="h-11 w-full" aria-label={ariaLabel}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
