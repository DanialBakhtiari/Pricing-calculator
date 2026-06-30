import { lazy, Suspense, useEffect } from 'react';
import { useForm, useWatch, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BENCHMARK_STATUS_LABELS,
  BenchmarkBar,
  FormMoney,
  FormNumber,
  FormSlider,
  InfoTooltip,
  ModuleHeader,
  ScenarioBar,
  SummaryRow,
} from '@/components/common';
import { RANGES } from '@/lib/pricing';
import { formatPercent, formatToman, toPersianDigits } from '@/lib/format';
import { useAppStore } from '@/lib/storage/appStore';
import { startModuleTour } from '@/lib/onboarding/runTour';
import { MODULES, label, tooltip } from '@/content/fa';
import {
  MAR_DEFAULTS,
  OVERHEAD_BENCHMARK,
  computeMarResult,
  marSchema,
  type MarFormValues,
} from './marForm';

const CostDoughnut = lazy(() => import('@/components/charts/CostDoughnut'));

const META = MODULES.find((m) => m.id === 'mar');

export function MarPage() {
  const setActiveRate = useAppStore((s) => s.setActiveRate);
  const { control, reset } = useForm<MarFormValues>({
    resolver: zodResolver(marSchema) as Resolver<MarFormValues>,
    defaultValues: MAR_DEFAULTS,
    mode: 'onChange',
  });

  const values = useWatch({ control });
  const result = computeMarResult(values);
  const mar = result?.mar ?? null;

  useEffect(() => {
    if (mar !== null) setActiveRate(mar);
  }, [mar, setActiveRate]);

  return (
    <div className="space-y-6">
      <ModuleHeader
        title={META?.name ?? ''}
        description={META?.description}
        onHelp={() => void startModuleTour('mar')}
      />

      <div className="grid gap-6 lg:grid-cols-5">
        {/* ───── فرم (۳/۵) ───── */}
        <form className="space-y-6 lg:col-span-3" onSubmit={(e) => e.preventDefault()}>
          <Card data-tour="mar-costs">
            <CardHeader>
              <CardTitle>{label('mar.costsGroup')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <FormMoney
                control={control}
                name="direct"
                label={label('mar.direct')}
                tooltip={tooltip('mar.direct')}
              />
              <FormMoney
                control={control}
                name="overhead"
                label={label('mar.overhead')}
                tooltip={tooltip('mar.overhead')}
              />
              <FormMoney
                control={control}
                name="profitTarget"
                label={label('mar.profit')}
                tooltip={tooltip('mar.profit')}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{label('mar.capacityGroup')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <FormNumber
                control={control}
                name="weeks"
                label={label('mar.weeks')}
                tooltip={tooltip('mar.weeks')}
                unit={label('unit.week')}
                min={RANGES.weeks.min}
                max={RANGES.weeks.max}
              />
              <FormNumber
                control={control}
                name="hoursPerWeek"
                label={label('mar.hoursPerWeek')}
                tooltip={tooltip('mar.hoursPerWeek')}
                unit={label('unit.hours')}
                min={RANGES.hoursPerWeek.min}
                max={RANGES.hoursPerWeek.max}
              />
              <div data-tour="mar-utilization">
                <FormSlider
                  control={control}
                  name="utilization"
                  label={label('mar.utilization')}
                  tooltip={tooltip('mar.utilization')}
                  min={RANGES.utilization.min}
                  max={RANGES.utilization.max}
                  step={0.01}
                  fallback={RANGES.utilization.default}
                  formatValue={(v) => toPersianDigits(v.toFixed(2))}
                />
              </div>
            </CardContent>
          </Card>
        </form>

        {/* ───── خلاصه‌ی زنده (۲/۵) ───── */}
        <div className="lg:col-span-2">
          {result ? (
            <Card className="lg:sticky lg:top-20" data-tour="mar-result">
              <CardHeader>
                <CardTitle className="text-muted-foreground flex items-center gap-1.5 text-sm font-normal">
                  {label('mar.result')}
                  <InfoTooltip content={tooltip('mar.result')} />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-success text-3xl font-bold break-words tabular-nums">
                    {formatToman(result.mar)}
                  </p>
                  <p className="text-muted-foreground text-xs">{label('mar.resultHint')}</p>
                </div>

                <div className="space-y-1 border-t pt-3 text-sm">
                  <SummaryRow
                    label={label('mar.billable')}
                    value={`${toPersianDigits(Math.round(result.billable))} ${label('unit.hoursPerYear')}`}
                  />
                  <SummaryRow label={label('mar.total')} value={formatToman(result.total)} />
                </div>

                <div className="border-t pt-3">
                  <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
                    <span>{label('mar.overheadRatio')}</span>
                    <InfoTooltip content={tooltip('mar.overheadRatio')} />
                  </div>
                  {result.overheadRatio !== null ? (
                    <div className="mt-1 space-y-1">
                      <p className="text-2xl font-bold tabular-nums">
                        {formatPercent(result.overheadRatio)}
                      </p>
                      <BenchmarkBar
                        value={result.overheadRatio}
                        min={OVERHEAD_BENCHMARK.min}
                        max={OVERHEAD_BENCHMARK.max}
                        segments={OVERHEAD_BENCHMARK.segments}
                        statusLabel={BENCHMARK_STATUS_LABELS}
                        formatValue={(v) => formatPercent(v)}
                      />
                    </div>
                  ) : (
                    <p className="text-muted-foreground mt-1 text-xs">{label('mar.overheadNA')}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-muted-foreground py-12 text-center">
                {label('state.invalid')}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* ───── نمودار ترکیب هزینه (تمام‌عرض) ───── */}
      {result ? (
        <Card data-tour="mar-chart">
          <CardHeader>
            <CardTitle className="text-base">{label('mar.chartTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="mx-auto h-64 w-64 rounded-full" />}>
              <CostDoughnut
                ariaLabel={`${label('mar.chartTitle')}: ${label('mar.direct')} ${formatToman(values.direct ?? 0)}، ${label('mar.overhead')} ${formatToman(values.overhead ?? 0)}، ${label('mar.profit')} ${formatToman(values.profitTarget ?? 0)}`}
                segments={[
                  { label: label('mar.direct'), value: values.direct ?? 0 },
                  { label: label('mar.overhead'), value: values.overhead ?? 0 },
                  { label: label('mar.profit'), value: values.profitTarget ?? 0 },
                ]}
              />
            </Suspense>
          </CardContent>
        </Card>
      ) : null}

      <ScenarioBar module="mar" inputs={values} onRestore={(inputs) => reset(inputs)} />
    </div>
  );
}
