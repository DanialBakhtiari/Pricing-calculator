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
  ResultCard,
  ScenarioBar,
  SliderField,
  TierCards,
} from '@/components/common';
import { RANGES } from '@/lib/pricing';
import { formatPercent, formatToman, toPersianDigits } from '@/lib/format';
import { useAppStore } from '@/lib/storage/appStore';
import { startModuleTour } from '@/lib/onboarding/runTour';
import { BUILDER_MULTIPLIER, FEATURE_CHEAT_SHEET, RB_FACTORS } from '@/data';
import { MODULES, WEB_TIERS, label, tooltip } from '@/content/fa';
import { WEB_DEFAULTS, computeWebResult, rbTotal, webSchema, type WebFormValues } from './webForm';

const WaterfallChart = lazy(() => import('@/components/charts/WaterfallChart'));

const META = MODULES.find((m) => m.id === 'web');

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

      <div className="grid gap-6 lg:grid-cols-2">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* دامنه‌ی پروژه */}
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
                      <SelectTrigger className="w-full">
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

          {/* نرخ و ضرایب */}
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
                      <SelectTrigger className="w-full">
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
                          className="flex cursor-pointer items-center gap-2 text-sm"
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
                      <SelectTrigger className="w-full">
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

          {/* افزودنی‌ها */}
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

        {/* نتایج */}
        <div className="space-y-4">
          {result ? (
            <>
              <ResultCard
                label={label('web.finalPrice')}
                value={formatToman(result.proposal.final)}
                tooltip={tooltip('web.waterfall')}
                hint={label('web.finalHint')}
                status="healthy"
              />

              {(result.maintenance !== null ||
                result.performance !== null ||
                result.multilangExtraHours !== null) && (
                <Card>
                  <CardContent className="space-y-1 text-sm">
                    {result.maintenance ? (
                      <div className="flex justify-between gap-2">
                        <span className="text-muted-foreground">
                          {label('web.maintenanceLine')}
                        </span>
                        <span className="tabular-nums">
                          {formatToman(result.maintenance.min, { withUnit: false })} –{' '}
                          {formatToman(result.maintenance.max)}
                        </span>
                      </div>
                    ) : null}
                    {result.performance ? (
                      <div className="flex justify-between gap-2">
                        <span className="text-muted-foreground">
                          {label('web.performanceLine')}
                        </span>
                        <span className="tabular-nums">
                          {formatToman(result.performance.min, { withUnit: false })} –{' '}
                          {formatToman(result.performance.max)}
                        </span>
                      </div>
                    ) : null}
                    {result.multilangExtraHours ? (
                      <div className="flex justify-between gap-2">
                        <span className="text-muted-foreground">{label('web.multilangExtra')}</span>
                        <span className="tabular-nums">
                          +{toPersianDigits(Math.round(result.multilangExtraHours))}{' '}
                          {label('unit.hours')}
                        </span>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              )}

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
          ) : (
            <Card>
              <CardContent className="text-muted-foreground py-10 text-center">
                {needsMar ? label('web.noMar') : label('state.invalid')}
              </CardContent>
            </Card>
          )}

          <ScenarioBar module="web" inputs={values} onRestore={(inputs) => reset(inputs)} />
        </div>
      </div>
    </div>
  );
}
