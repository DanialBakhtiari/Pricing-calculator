import { lazy, Suspense, useEffect } from 'react';
import { Controller, useForm, useWatch, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BENCHMARK_STATUS_LABELS,
  BenchmarkBar,
  InfoTooltip,
  ModuleHeader,
  MoneyField,
  NumberField,
  ResultCard,
  ScenarioBar,
  SliderField,
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

  // نرخ فعال مشترک = MAR (تزریق به ماژول ۲/۴).
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* فرم ورودی */}
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <Card data-tour="mar-costs">
            <CardHeader>
              <CardTitle>{label('mar.costsGroup')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <Controller
                name="direct"
                control={control}
                render={({ field, fieldState }) => (
                  <MoneyField
                    label={label('mar.direct')}
                    tooltip={tooltip('mar.direct')}
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                name="overhead"
                control={control}
                render={({ field, fieldState }) => (
                  <MoneyField
                    label={label('mar.overhead')}
                    tooltip={tooltip('mar.overhead')}
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                name="profitTarget"
                control={control}
                render={({ field, fieldState }) => (
                  <MoneyField
                    label={label('mar.profit')}
                    tooltip={tooltip('mar.profit')}
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error?.message}
                  />
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{label('mar.capacityGroup')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <Controller
                name="weeks"
                control={control}
                render={({ field, fieldState }) => (
                  <NumberField
                    label={label('mar.weeks')}
                    tooltip={tooltip('mar.weeks')}
                    unit={label('unit.week')}
                    value={field.value}
                    onChange={field.onChange}
                    min={RANGES.weeks.min}
                    max={RANGES.weeks.max}
                    error={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                name="hoursPerWeek"
                control={control}
                render={({ field, fieldState }) => (
                  <NumberField
                    label={label('mar.hoursPerWeek')}
                    tooltip={tooltip('mar.hoursPerWeek')}
                    unit={label('unit.hours')}
                    value={field.value}
                    onChange={field.onChange}
                    min={RANGES.hoursPerWeek.min}
                    max={RANGES.hoursPerWeek.max}
                    error={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                name="utilization"
                control={control}
                render={({ field }) => (
                  <SliderField
                    data-tour="mar-utilization"
                    label={label('mar.utilization')}
                    tooltip={tooltip('mar.utilization')}
                    value={field.value ?? RANGES.utilization.default}
                    onChange={field.onChange}
                    min={RANGES.utilization.min}
                    max={RANGES.utilization.max}
                    step={0.01}
                    formatValue={(v) => toPersianDigits(v.toFixed(2))}
                  />
                )}
              />
            </CardContent>
          </Card>
        </form>

        {/* نتایج */}
        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          {result ? (
            <>
              <ResultCard
                data-tour="mar-result"
                label={label('mar.result')}
                value={formatToman(result.mar)}
                tooltip={tooltip('mar.result')}
                hint={label('mar.resultHint')}
                status="healthy"
              />

              <div className="grid grid-cols-2 gap-4">
                <ResultCard
                  label={label('mar.billable')}
                  value={`${toPersianDigits(Math.round(result.billable))} ${label('unit.hoursPerYear')}`}
                />
                <ResultCard label={label('mar.total')} value={formatToman(result.total)} />
              </div>

              <Card>
                <CardContent className="space-y-2">
                  <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
                    <span>{label('mar.overheadRatio')}</span>
                    <InfoTooltip
                      content={tooltip('mar.overheadRatio')}
                      label={`${label('a11y.explain')} ${label('mar.overheadRatio')}`}
                    />
                  </div>
                  {result.overheadRatio !== null ? (
                    <>
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
                    </>
                  ) : (
                    <p className="text-muted-foreground text-xs">{label('mar.overheadNA')}</p>
                  )}
                </CardContent>
              </Card>

              <div data-tour="mar-chart">
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
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="text-muted-foreground py-10 text-center">
                {label('state.invalid')}
              </CardContent>
            </Card>
          )}

          <ScenarioBar module="mar" inputs={values} onRestore={(inputs) => reset(inputs)} />
        </div>
      </div>
    </div>
  );
}
