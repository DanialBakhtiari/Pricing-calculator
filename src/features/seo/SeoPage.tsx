import { lazy, Suspense } from 'react';
import { Controller, useForm, useWatch, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import {
  FormMoney,
  FormNumber,
  FormPercent,
  ModuleHeader,
  ResultCard,
  ScenarioBar,
} from '@/components/common';
import { formatPercent, formatToman, toPersianDigits } from '@/lib/format';
import { startModuleTour } from '@/lib/onboarding/runTour';
import { AUDIT_COMPONENTS } from '@/data';
import { MODULES, label, message, tooltip } from '@/content/fa';
import {
  SEO_DEFAULTS,
  computeAudit,
  computePerformance,
  computeRetainer,
  computeRoi,
  seoSchema,
  type SeoFormValues,
} from './seoForm';

const RoiChart = lazy(() => import('@/components/charts/RoiChart'));

const META = MODULES.find((m) => m.id === 'seo');

export function SeoPage() {
  const { control, reset } = useForm<SeoFormValues>({
    resolver: zodResolver(seoSchema) as Resolver<SeoFormValues>,
    defaultValues: SEO_DEFAULTS,
    mode: 'onChange',
  });

  const values = useWatch({ control });
  const retainer = computeRetainer(values);
  const performance = computePerformance(values);
  const audit = computeAudit(values);
  const roi = computeRoi(values);

  return (
    <div className="space-y-6">
      <ModuleHeader
        title={META?.name ?? ''}
        description={META?.description}
        onHelp={() => void startModuleTour('seo')}
      />

      <Tabs defaultValue="retainer" data-tour="seo-model">
        <TabsList className="h-auto w-full flex-wrap">
          <TabsTrigger value="retainer" className="whitespace-normal">
            {label('seo.modeRetainer')}
          </TabsTrigger>
          <TabsTrigger value="performance" className="whitespace-normal">
            {label('seo.modePerformance')}
          </TabsTrigger>
          <TabsTrigger value="audit" className="whitespace-normal">
            {label('seo.modeAudit')}
          </TabsTrigger>
        </TabsList>

        {/* Retainer ماهانه */}
        <TabsContent value="retainer" className="mt-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="space-y-5 pt-6">
                <FormNumber
                  control={control}
                  name="contentHours"
                  label={label('seo.contentHours')}
                  tooltip={tooltip('seo.contentHours')}
                  unit={label('unit.hours')}
                />
                <FormMoney
                  control={control}
                  name="writerRate"
                  label={label('seo.writerRate')}
                  step={50_000}
                />
                <FormNumber
                  control={control}
                  name="technicalHours"
                  label={label('seo.technicalHours')}
                  tooltip={tooltip('seo.technicalHours')}
                  unit={label('unit.hours')}
                />
                <FormNumber
                  control={control}
                  name="outreachHours"
                  label={label('seo.outreachHours')}
                  tooltip={tooltip('seo.outreachHours')}
                  unit={label('unit.hours')}
                />
                <FormMoney
                  control={control}
                  name="seoRate"
                  label={label('seo.seoRate')}
                  step={50_000}
                />
                <FormMoney
                  control={control}
                  name="toolsCost"
                  label={label('seo.tools')}
                  tooltip={tooltip('seo.tools')}
                />
              </CardContent>
            </Card>
            <div>
              <ResultCard
                label={label('seo.retainerResult')}
                value={retainer !== null ? formatToman(retainer) : '—'}
                status="healthy"
              />
            </div>
          </div>
        </TabsContent>

        {/* عملکردمحور */}
        <TabsContent value="performance" className="mt-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="space-y-5 pt-6">
                <FormMoney
                  control={control}
                  name="baseRetainer"
                  label={label('seo.baseRetainer')}
                  tooltip={tooltip('seo.performance')}
                />
                <FormNumber
                  control={control}
                  name="milestones"
                  label={label('seo.milestones')}
                  min={0}
                  max={100}
                />
                <FormMoney
                  control={control}
                  name="bonusPerMilestone"
                  label={label('seo.bonus')}
                  step={500_000}
                />
                <FormMoney
                  control={control}
                  name="estimatedCost"
                  label={label('seo.estimatedCost')}
                />
                <FormPercent
                  control={control}
                  name="performanceRb"
                  label={label('seo.performanceRb')}
                  min={0}
                  max={1}
                />
              </CardContent>
            </Card>
            <div className="space-y-4">
              <ResultCard
                label={label('seo.performanceResult')}
                value={performance ? formatToman(performance.payment) : '—'}
              />
              {performance ? (
                <Alert variant={performance.safe ? 'default' : 'destructive'}>
                  <AlertDescription>
                    {performance.safe ? label('seo.performanceSafe') : message('performanceUnsafe')}
                  </AlertDescription>
                </Alert>
              ) : null}
            </div>
          </div>
        </TabsContent>

        {/* حسابرسی */}
        <TabsContent value="audit" className="mt-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="space-y-3 pt-6">
                <Controller
                  control={control}
                  name="auditComponentIds"
                  render={({ field }) => (
                    <fieldset className="space-y-2">
                      <legend className="mb-2 text-sm font-medium">
                        {label('seo.auditGroup')}
                      </legend>
                      {AUDIT_COMPONENTS.map((c) => {
                        const checked = field.value.includes(c.id);
                        return (
                          <label
                            key={c.id}
                            className="flex cursor-pointer items-center gap-2 text-sm"
                          >
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(v) =>
                                field.onChange(
                                  v
                                    ? [...field.value, c.id]
                                    : field.value.filter((x) => x !== c.id),
                                )
                              }
                            />
                            <span>{c.label}</span>
                          </label>
                        );
                      })}
                    </fieldset>
                  )}
                />
              </CardContent>
            </Card>
            <div className="space-y-3">
              <ResultCard
                label={label('seo.auditPrice')}
                tooltip={tooltip('seo.audit')}
                value={audit ? formatToman(audit.price) : '—'}
                hint={
                  audit
                    ? `${label('seo.auditHours')}: ${toPersianDigits(Math.round(audit.hours))} ${label('unit.hours')}`
                    : undefined
                }
              />
              <p className="text-muted-foreground text-xs">{label('seo.auditBand')}</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* ROI — همیشه دیده می‌شود */}
      <Card data-tour="seo-roi">
        <CardHeader>
          <CardTitle className="text-base">{label('seo.roiGroup')}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-5">
            <FormPercent
              control={control}
              name="cr"
              label={label('seo.cr')}
              tooltip={tooltip('seo.cr')}
              min={0}
              max={1}
            />
            <FormMoney
              control={control}
              name="aov"
              label={label('seo.aov')}
              tooltip={tooltip('seo.aov')}
            />
            <FormNumber
              control={control}
              name="deltaTraffic"
              label={label('seo.deltaTraffic')}
              tooltip={tooltip('seo.deltaTraffic')}
            />
            <FormMoney
              control={control}
              name="monthlyRetainer"
              label={label('seo.monthlyRetainer')}
            />
          </div>

          <div className="space-y-3">
            {roi ? (
              <>
                <ResultCard
                  label={label('seo.roiResult')}
                  value={formatPercent(roi.roi)}
                  tooltip={tooltip('seo.roi')}
                  status={roi.roi >= 0 ? 'healthy' : 'danger'}
                  hint={`${label('seo.monthlyValue')}: ${formatToman(roi.vMonthly)}`}
                />
                <Suspense fallback={<Skeleton className="h-56 w-full" />}>
                  <RoiChart
                    monthlyValue={roi.vMonthly}
                    retainer={values.monthlyRetainer ?? 0}
                    valueLabel={label('seo.roiChartValue')}
                    retainerLabel={label('seo.roiChartRetainer')}
                    ariaLabel={`${label('seo.roiResult')} ${formatPercent(roi.roi)}`}
                  />
                </Suspense>
                <Alert data-tour="seo-pitch">
                  <AlertDescription>
                    <span className="font-medium">{label('seo.pitchTitle')}: </span>
                    {label('seo.pitch').replace('{roi}', formatPercent(roi.roi))}
                  </AlertDescription>
                </Alert>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">{label('state.invalid')}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <ScenarioBar module="seo" inputs={values} onRestore={(inputs) => reset(inputs)} />
    </div>
  );
}
