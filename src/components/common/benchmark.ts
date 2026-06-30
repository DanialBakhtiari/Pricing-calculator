// محک سلامت — کدگذاری یکسان در همه‌ی ماژول‌ها: سبز=سالم، زرد=احتیاط، قرمز=خطر (design §2).
export type BenchmarkStatus = 'healthy' | 'warning' | 'danger';

export interface BenchmarkSegment {
  from: number;
  to: number;
  status: BenchmarkStatus;
}

/** وضعیت یک مقدار را بر اساس بازه‌های صعودی تعیین می‌کند. */
export function classify(value: number, segments: BenchmarkSegment[]): BenchmarkStatus {
  const seg = segments.find((s) => value >= s.from && value < s.to);
  return seg?.status ?? segments.at(-1)?.status ?? 'healthy';
}

export const STATUS_BG: Record<BenchmarkStatus, string> = {
  healthy: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-destructive',
};

export const STATUS_TEXT: Record<BenchmarkStatus, string> = {
  healthy: 'text-success',
  warning: 'text-warning',
  danger: 'text-destructive',
};
