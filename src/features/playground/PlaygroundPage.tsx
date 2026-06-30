import { useState } from 'react';
import { adjustedPrice, RANGES } from '@/lib/pricing';
import { formatToman, toPersianDigits } from '@/lib/format';
import { Card, CardContent } from '@/components/ui/card';
import {
  BENCHMARK_STATUS_LABELS,
  BenchmarkBar,
  ModuleHeader,
  MoneyField,
  PercentField,
  ResultCard,
  SliderField,
  type BenchmarkSegment,
} from '@/components/common';
import { label, tooltip } from '@/content/fa';

const CM_SEGMENTS: BenchmarkSegment[] = [
  { from: 1.0, to: 1.5, status: 'healthy' },
  { from: 1.5, to: 2.0, status: 'warning' },
  { from: 2.0, to: 2.5001, status: 'danger' },
];

/** صفحه‌ی نمونه — اثبات کارکرد کامپوننت‌های مشترک با موتور قیمت‌گذاری. */
export function PlaygroundPage() {
  const [base, setBase] = useState<number | null>(150_000_000);
  const [cm, setCm] = useState(1.8);
  const [rbPct, setRbPct] = useState<number | null>(25);

  let result: number | null = null;
  let invalid = false;
  if (base !== null && rbPct !== null) {
    try {
      result = adjustedPrice({ base, cm, rb: rbPct / 100 });
    } catch {
      invalid = true;
    }
  }

  const hint = invalid
    ? label('state.invalid')
    : base === null || rbPct === null
      ? label('state.empty')
      : undefined;

  return (
    <div className="space-y-6">
      <ModuleHeader
        title={label('playground.title')}
        description={label('playground.description')}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-5">
          <MoneyField
            label={label('breakdown.base')}
            value={base}
            onChange={setBase}
            tooltip={tooltip('web.rateSource')}
          />
          <SliderField
            label={label('breakdown.cm')}
            value={cm}
            onChange={setCm}
            tooltip={tooltip('web.cm')}
            min={RANGES.cm.min}
            max={RANGES.cm.max}
            step={0.1}
            formatValue={(v) => `${toPersianDigits(v.toFixed(1))}×`}
          />
          <PercentField
            label={label('breakdown.rb')}
            value={rbPct}
            onChange={setRbPct}
            tooltip={tooltip('web.rb')}
            min={0}
            max={100}
            step={5}
          />
        </div>

        <div className="space-y-5">
          <ResultCard
            label={label('playground.result')}
            value={result !== null ? formatToman(result) : '—'}
            tooltip={tooltip('web.waterfall')}
            hint={hint}
          />
          <Card>
            <CardContent className="space-y-2">
              <p className="text-muted-foreground text-sm">{label('playground.complexity')}</p>
              <BenchmarkBar
                value={cm}
                min={RANGES.cm.min}
                max={RANGES.cm.max}
                segments={CM_SEGMENTS}
                statusLabel={BENCHMARK_STATUS_LABELS}
                formatValue={(v) => `${toPersianDigits(v.toFixed(1))}×`}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
