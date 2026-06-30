import { lazy, Suspense, useRef, useState } from 'react';
import { Controller, useForm, useWatch, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useReactToPrint } from 'react-to-print';
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
  ProposalSheet,
  ScenarioBar,
  SummaryRow,
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
  type SeoMode,
} from './seoForm';

const TAB_IDS: SeoMode[] = ['retainer', 'performance', 'audit'];

// تریگرِ تب: همه‌ی بک‌گراندهای active پیش‌فرض shadcn (روشن/تیره/حاشیه) خنثی می‌شوند
// تا فقط «پیلِ برندِ لغزان» وضعیت فعال را نشان دهد.
const TAB_TRIGGER_CLASS =
  'relative z-10 min-h-11 text-foreground/70 transition-colors data-[state=active]:bg-transparent data-[state=active]:text-primary-foreground data-[state=active]:shadow-none dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-transparent dark:data-[state=active]:text-primary-foreground';

const RoiChart = lazy(() => import('@/components/charts/RoiChart'));

const META = MODULES.find((m) => m.id === 'seo');

/** کارت قهرمانِ خلاصه — عنوان + عدد بزرگ. */
function SummaryHero({ title, value }: { title: string; value: string }) {
  return (
    <CardHeader>
      <CardTitle className="text-muted-foreground text-sm font-normal">{title}</CardTitle>
      <p className="text-success text-2xl font-bold break-words tabular-nums sm:text-3xl">
        {value}
      </p>
    </CardHeader>
  );
}

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
  const dash = '—';

  const [tab, setTab] = useState<SeoMode>('retainer');
  const activeIndex = TAB_IDS.indexOf(tab);

  const proposalRef = useRef<HTMLDivElement>(null);
  const printProposal = useReactToPrint({ contentRef: proposalRef });
  const hasProposal = retainer !== null || roi !== null;

  const proposalSections = [
    ...(retainer !== null
      ? [
          {
            title: label('seo.modeRetainer'),
            rows: [
              { label: label('seo.retainerResult'), value: formatToman(retainer) },
              { label: label('seo.annual'), value: formatToman(retainer * 12) },
            ],
          },
        ]
      : []),
    ...(performance
      ? [
          {
            title: label('seo.modePerformance'),
            rows: [
              { label: label('seo.performanceResult'), value: formatToman(performance.payment) },
            ],
          },
        ]
      : []),
    ...(audit
      ? [
          {
            title: label('seo.modeAudit'),
            rows: [{ label: label('seo.auditPrice'), value: formatToman(audit.price) }],
          },
        ]
      : []),
    ...(roi
      ? [
          {
            title: label('seo.roiGroup'),
            rows: [
              { label: label('seo.monthlyValue'), value: formatToman(roi.vMonthly) },
              { label: label('seo.roiResult'), value: formatPercent(roi.roi) },
            ],
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      <ModuleHeader
        title={META?.name ?? ''}
        description={META?.description}
        guide="seo"
        onHelp={() => void startModuleTour('seo')}
        onExportPdf={hasProposal ? () => printProposal() : undefined}
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as SeoMode)} data-tour="seo-model">
        <TabsList className="relative grid h-auto w-full grid-cols-3 p-1">
          {/* پیلِ برندِ لغزان (RTL) — نشانگر تب فعال */}
          <span
            aria-hidden
            className="bg-primary absolute inset-y-1 rounded-md shadow-sm transition-transform duration-200 ease-out"
            style={{
              width: 'calc((100% - 0.5rem) / 3)',
              insetInlineStart: '0.25rem',
              transform: `translateX(calc(${activeIndex} * -100%))`,
            }}
          />
          <TabsTrigger value="retainer" className={TAB_TRIGGER_CLASS}>
            {label('seo.tabRetainer')}
          </TabsTrigger>
          <TabsTrigger value="performance" className={TAB_TRIGGER_CLASS}>
            {label('seo.tabPerformance')}
          </TabsTrigger>
          <TabsTrigger value="audit" className={TAB_TRIGGER_CLASS}>
            {label('seo.tabAudit')}
          </TabsTrigger>
        </TabsList>

        {/* ───── Retainer ماهانه ───── */}
        <TabsContent value="retainer" className="mt-4">
          <div className="grid gap-6 lg:grid-cols-5">
            <Card className="lg:col-span-3">
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

            <div className="lg:col-span-2">
              <Card className="lg:sticky lg:top-20 lg:max-h-[calc(100dvh-6rem)] lg:overflow-y-auto">
                <SummaryHero
                  title={label('seo.retainerResult')}
                  value={retainer !== null ? formatToman(retainer) : dash}
                />
                <CardContent className="space-y-1 border-t pt-4 text-sm">
                  <SummaryRow
                    label={label('seo.annual')}
                    value={retainer !== null ? formatToman(retainer * 12) : dash}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ───── عملکردمحور ───── */}
        <TabsContent value="performance" className="mt-4">
          <div className="grid gap-6 lg:grid-cols-5">
            <Card className="lg:col-span-3">
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

            <div className="space-y-4 lg:col-span-2">
              <Card className="lg:sticky lg:top-20 lg:max-h-[calc(100dvh-6rem)] lg:overflow-y-auto">
                <SummaryHero
                  title={label('seo.performanceResult')}
                  value={performance ? formatToman(performance.payment) : dash}
                />
                <CardContent className="space-y-3 border-t pt-4">
                  <div className="space-y-1 text-sm">
                    <SummaryRow
                      label={label('seo.baseRetainer')}
                      value={values.baseRetainer != null ? formatToman(values.baseRetainer) : dash}
                    />
                    <SummaryRow
                      label={label('seo.bonusTotal')}
                      value={formatToman(
                        (values.milestones ?? 0) * (values.bonusPerMilestone ?? 0),
                      )}
                    />
                  </div>
                  {performance ? (
                    <Alert variant={performance.safe ? 'default' : 'destructive'}>
                      <AlertDescription>
                        {performance.safe
                          ? label('seo.performanceSafe')
                          : message('performanceUnsafe')}
                      </AlertDescription>
                    </Alert>
                  ) : null}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ───── حسابرسی ───── */}
        <TabsContent value="audit" className="mt-4">
          <div className="grid gap-6 lg:grid-cols-5">
            <Card className="lg:col-span-3">
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
                            className="flex min-h-11 cursor-pointer items-center gap-2 py-2 text-sm"
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

            <div className="lg:col-span-2">
              <Card className="lg:sticky lg:top-20 lg:max-h-[calc(100dvh-6rem)] lg:overflow-y-auto">
                <SummaryHero
                  title={label('seo.auditPrice')}
                  value={audit ? formatToman(audit.price) : dash}
                />
                <CardContent className="space-y-1 border-t pt-4 text-sm">
                  <SummaryRow
                    label={label('seo.auditHours')}
                    value={
                      audit
                        ? `${toPersianDigits(Math.round(audit.hours))} ${label('unit.hours')}`
                        : dash
                    }
                  />
                  <SummaryRow
                    label={label('seo.auditComponents')}
                    value={toPersianDigits((values.auditComponentIds ?? []).length)}
                  />
                  <p className="text-muted-foreground pt-2 text-xs">{label('seo.auditBand')}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* ───── ROI مشتری ───── */}
      <Card data-tour="seo-roi">
        <CardHeader>
          <CardTitle className="text-base">{label('seo.roiGroup')}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-5">
          <div className="space-y-5 lg:col-span-2">
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

          <div className="space-y-4 lg:col-span-3">
            {roi ? (
              <>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Card>
                    <CardContent className="space-y-1 pt-6">
                      <p className="text-muted-foreground text-sm">{label('seo.roiResult')}</p>
                      <p
                        className={`text-3xl font-bold tabular-nums ${roi.roi >= 0 ? 'text-success' : 'text-destructive'}`}
                      >
                        {formatPercent(roi.roi)}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="space-y-1 pt-6">
                      <p className="text-muted-foreground text-sm">{label('seo.monthlyValue')}</p>
                      <p className="text-xl font-bold break-words tabular-nums">
                        {formatToman(roi.vMonthly)}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="space-y-1 pt-6">
                      <p className="text-muted-foreground text-sm">{label('seo.roiMonthlyNet')}</p>
                      <p className="text-xl font-bold break-words tabular-nums">
                        {formatToman(roi.vMonthly - (values.monthlyRetainer ?? 0))}
                      </p>
                    </CardContent>
                  </Card>
                </div>

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

      <div className="hidden">
        {hasProposal ? (
          <ProposalSheet
            ref={proposalRef}
            moduleTitle={META?.name ?? ''}
            hero={
              roi
                ? { label: label('seo.roiResult'), value: formatPercent(roi.roi) }
                : {
                    label: label('seo.retainerResult'),
                    value: retainer !== null ? formatToman(retainer) : dash,
                  }
            }
            sections={proposalSections}
          />
        ) : null}
      </div>
    </div>
  );
}
