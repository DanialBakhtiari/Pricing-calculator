import { lazy, Suspense } from 'react';
import { Controller, useForm, useWatch, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  InfoTooltip,
  ModuleHeader,
  MoneyField,
  NumberField,
  ScenarioBar,
  SliderField,
  SummaryRow,
  TierCards,
} from '@/components/common';
import { RANGES, type MoneyRange } from '@/lib/pricing';
import { formatPercent, formatToman, toPersianDigits } from '@/lib/format';
import { useAppStore } from '@/lib/storage/appStore';
import { startModuleTour } from '@/lib/onboarding/runTour';
import { BUILDER_MULTIPLIER, FEATURE_CHEAT_SHEET, RB_FACTORS } from '@/data';
import { MODULES, WEB_TIERS, label, tooltip } from '@/content/fa';
import { WEB_DEFAULTS, computeWebResult, rbTotal, webSchema, type WebFormValues } from './webForm';

const WaterfallChart = lazy(() => import('@/components/charts/WaterfallChart'));

const META = MODULES.find((m) => m.id === 'web');

/** بازه‌ی پولی را تک‌مقدار یا «کف – سقف» نشان می‌دهد. */
function moneyRangeText(r: MoneyRange): string {
  if (r.min === r.max) return formatToman(r.min);
  return `${formatToman(r.min, { withUnit: false })} – ${formatToman(r.max)}`;
}

export function WebPage() {
  const activeRate = useAppStore((s) => s.activeRate);
  const { control, setValue, reset } = useForm<WebFormValues>({
    resolver: zodResolver(webSchema) as Resolver<WebFormValues>,
    defaultValues: WEB_DEFAULTS,
    mode: 'onChange',
  });

  const values = useWatch({ control });
  const result = computeWebResult(values, activeRate);
  const needsMar = values.rateSource === 'mar' && activeRate === null;

  const tierCards = WEB_TIERS.map((content) => {
    const priced = result?.tiers.find((t) => t.id === content.id);
    return {
      id: content.id,
      name: content.name,
      price: priced?.price ?? 0,
      features: content.features,
      recommended: priced?.recommended ?? false,
    };
  });

  return (
    <div className="space-y-6">
      <ModuleHeader
        title={META?.name ?? ''}
        description={META?.description}
        onHelp={() => void startModuleTour('web')}
      />

      <div className="grid gap-6 lg:grid-cols-5">
        {/* ───── فرم (۳/۵) ───── */}
        <form className="space-y-6 lg:col-span-3" onSubmit={(e) => e.preventDefault()}>
          <Card data-tour="web-feature">
            <CardHeader>
              <CardTitle>{label('web.featureGroup')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Label>{label('web.feature')}</Label>
                  <InfoTooltip content={tooltip('web.hours')} />
                </div>
                <Controller
                  name="featureId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ''}
                      onValueChange={(id) => {
                        field.onChange(id);
                        const f = FEATURE_CHEAT_SHEET.find((x) => x.id === id);
                        if (f) {
                          setValue('hours', Math.round((f.hoursMin + f.hoursMax) / 2));
                          setValue('cm', (f.cmMin + f.cmMax) / 2);
                        }
                      }}
                    >
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue placeholder={label('web.featurePlaceholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        {FEATURE_CHEAT_SHEET.map((f) => (
                          <SelectItem key={f.id} value={f.id}>
                            {f.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <Controller
                name="hours"
                control={control}
                render={({ field, fieldState }) => (
                  <NumberField
                    label={label('web.hours')}
                    tooltip={tooltip('web.hours')}
                    unit={label('unit.hours')}
                    value={field.value}
                    onChange={field.onChange}
                    min={1}
                    error={fieldState.error?.message}
                  />
                )}
              />
            </CardContent>
          </Card>

          <Card data-tour="web-cm-rb">
            <CardHeader>
              <CardTitle>{label('web.rateGroup')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Label>{label('web.rateSource')}</Label>
                  <InfoTooltip content={tooltip('web.rateSource')} />
                </div>
                <Controller
                  name="rateSource"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="market">{label('web.rateMarket')}</SelectItem>
                        <SelectItem value="mar">{label('web.rateMar')}</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {values.rateSource === 'market' ? (
                <Controller
                  name="marketRate"
                  control={control}
                  render={({ field, fieldState }) => (
                    <MoneyField
                      label={label('web.marketRate')}
                      value={field.value}
                      onChange={field.onChange}
                      step={50_000}
                      error={fieldState.error?.message}
                    />
                  )}
                />
              ) : needsMar ? (
                <Alert>
                  <AlertDescription>{label('web.noMar')}</AlertDescription>
                </Alert>
              ) : (
                <p className="text-muted-foreground text-sm">
                  {label('web.rateMar')}: {formatToman(activeRate ?? 0)}
                </p>
              )}

              <Controller
                name="cm"
                control={control}
                render={({ field }) => (
                  <SliderField
                    label={label('web.cm')}
                    tooltip={tooltip('web.cm')}
                    value={field.value}
                    onChange={field.onChange}
                    min={RANGES.cm.min}
                    max={RANGES.cm.max}
                    step={0.1}
                    formatValue={(v) => `${toPersianDigits(v.toFixed(1))}×`}
                  />
                )}
              />

              <Controller
                name="rbFactors"
                control={control}
                render={({ field }) => (
                  <fieldset className="space-y-2">
                    <legend className="mb-2 flex items-center gap-1.5 text-sm font-medium">
                      {label('web.rbGroup')}
                      <InfoTooltip content={tooltip('web.rb')} />
                    </legend>
                    {RB_FACTORS.map((f) => {
                      const checked = field.value.includes(f.id);
                      return (
                        <label
                          key={f.id}
                          className="flex cursor-pointer items-center gap-2 py-1 text-sm"
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(c) =>
                              field.onChange(
                                c ? [...field.value, f.id] : field.value.filter((x) => x !== f.id),
                              )
                            }
                          />
                          <span>
                            {f.label} (+{formatPercent(f.value * 100)})
                          </span>
                        </label>
                      );
                    })}
                    <p className="text-muted-foreground pt-1 text-xs">
                      {label('web.rbTotal')}: {formatPercent(rbTotal(field.value) * 100)}
                    </p>
                  </fieldset>
                )}
              />

              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Label>{label('web.builder')}</Label>
                  <InfoTooltip content={tooltip('web.builder')} />
                </div>
                <Controller
                  name="builderId"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {BUILDER_MULTIPLIER.map((b) => (
                          <SelectItem key={b.id} value={b.id}>
                            {b.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{label('web.addonsGroup')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Controller
                name="addMaintenance"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center justify-between gap-2">
                    <Label htmlFor="add-maint" className="flex items-center gap-1.5">
                      {label('web.addMaintenance')}
                      <InfoTooltip content={tooltip('web.maintenance')} />
                    </Label>
                    <Switch id="add-maint" checked={field.value} onCheckedChange={field.onChange} />
                  </div>
                )}
              />
              <Controller
                name="addCwv"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center justify-between gap-2">
                    <Label htmlFor="add-cwv" className="flex items-center gap-1.5">
                      {label('web.addCwv')}
                      <InfoTooltip content={tooltip('web.cwv')} />
                    </Label>
                    <Switch id="add-cwv" checked={field.value} onCheckedChange={field.onChange} />
                  </div>
                )}
              />
              <Controller
                name="multilangCount"
                control={control}
                render={({ field, fieldState }) => (
                  <NumberField
                    label={label('web.multilang')}
                    tooltip={tooltip('web.multilang')}
                    value={field.value}
                    onChange={field.onChange}
                    min={0}
                    max={10}
                    error={fieldState.error?.message}
                  />
                )}
              />
            </CardContent>
          </Card>
        </form>

        {/* ───── خلاصه‌ی زنده (۲/۵) ───── */}
        <div className="lg:col-span-2">
          {result ? (
            <Card className="lg:sticky lg:top-20">
              <CardHeader>
                <CardTitle className="text-base">{label('web.summaryTitle')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
                    <span>{label('web.finalPrice')}</span>
                    <InfoTooltip content={tooltip('web.waterfall')} />
                  </div>
                  <p className="text-success text-3xl font-bold break-words tabular-nums">
                    {formatToman(result.proposal.final)}
                  </p>
                  <p className="text-muted-foreground text-xs">{label('web.finalHint')}</p>
                </div>

                <div className="space-y-1 border-t pt-3 text-sm">
                  <SummaryRow
                    label={label('breakdown.base')}
                    value={formatToman(result.proposal.base)}
                  />
                  <SummaryRow
                    label={`+ ${label('breakdown.cm')}`}
                    value={formatToman(result.proposal.afterCM - result.proposal.base)}
                  />
                  <SummaryRow
                    label={`+ ${label('breakdown.rb')}`}
                    value={formatToman(result.proposal.afterRB - result.proposal.afterCM)}
                  />
                </div>

                {result.maintenance !== null ||
                result.performance !== null ||
                result.multilangExtraHours !== null ? (
                  <div className="space-y-1 border-t pt-3 text-sm">
                    {result.maintenance ? (
                      <SummaryRow
                        label={label('web.maintenanceLine')}
                        value={moneyRangeText(result.maintenance)}
                      />
                    ) : null}
                    {result.performance ? (
                      <SummaryRow
                        label={label('web.performanceLine')}
                        value={moneyRangeText(result.performance)}
                      />
                    ) : null}
                    {result.multilangExtraHours ? (
                      <SummaryRow
                        label={label('web.multilangExtra')}
                        value={`+${toPersianDigits(Math.round(result.multilangExtraHours))} ${label('unit.hours')}`}
                      />
                    ) : null}
                  </div>
                ) : null}

                <div className="border-t pt-3">
                  <span className="font-medium">{label('web.grandTotal')}</span>
                  <p className="text-primary text-xl font-bold break-words tabular-nums">
                    {moneyRangeText(result.grandTotal)}
                  </p>
                  <p className="text-muted-foreground pt-1 text-xs">
                    {label('web.grandTotalHint')}
                  </p>
                </div>

                <div className="text-muted-foreground flex flex-wrap justify-between gap-x-4 gap-y-1 border-t pt-3 text-xs">
                  <span>
                    {label('web.rateUsed')}:{' '}
                    <span className="tabular-nums">{formatToman(result.rate)}</span>
                  </span>
                  <span>
                    {label('web.rbUsed')}:{' '}
                    <span className="tabular-nums">{formatPercent(result.rb * 100)}</span>
                  </span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-muted-foreground py-12 text-center">
                {needsMar ? label('web.noMar') : label('state.invalid')}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* ───── تمام‌عرض: نمودار آبشاری + سه سطح ───── */}
      {result ? (
        <>
          <Card data-tour="web-waterfall">
            <CardHeader>
              <CardTitle className="text-base">{label('web.waterfallTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton className="h-64 w-full" />}>
                <WaterfallChart
                  ariaLabel={`${label('web.waterfallTitle')}: ${label('web.finalPrice')} ${formatToman(result.proposal.final)}`}
                  segments={[
                    {
                      label: label('breakdown.base'),
                      from: 0,
                      to: result.proposal.base,
                      kind: 'base',
                    },
                    {
                      label: label('breakdown.cm'),
                      from: result.proposal.base,
                      to: result.proposal.afterCM,
                      kind: 'step',
                    },
                    {
                      label: label('breakdown.rb'),
                      from: result.proposal.afterCM,
                      to: result.proposal.afterRB,
                      kind: 'step',
                    },
                    {
                      label: label('web.finalPrice'),
                      from: 0,
                      to: result.proposal.final,
                      kind: 'total',
                    },
                  ]}
                />
              </Suspense>
            </CardContent>
          </Card>

          <div data-tour="web-tiers" className="space-y-2">
            <h2 className="text-base font-semibold">{label('web.tiersTitle')}</h2>
            <TierCards tiers={tierCards} />
          </div>
        </>
      ) : null}

      <ScenarioBar module="web" inputs={values} onRestore={(inputs) => reset(inputs)} />
    </div>
  );
}
