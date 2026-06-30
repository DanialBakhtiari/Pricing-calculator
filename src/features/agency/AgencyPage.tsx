import { lazy, Suspense, useRef } from 'react';
import { Controller, useFieldArray, useForm, useWatch, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useReactToPrint } from 'react-to-print';
import { Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BENCHMARK_STATUS_LABELS,
  BenchmarkBar,
  FormMoney,
  FormSlider,
  InfoTooltip,
  ModuleHeader,
  ProposalSheet,
  ScenarioBar,
  SummaryRow,
} from '@/components/common';
import { RANGES } from '@/lib/pricing';
import { formatPercent, formatToman, parsePersianNumber, toPersianDigits } from '@/lib/format';
import { startModuleTour } from '@/lib/onboarding/runTour';
import { MODULES, label, message, tooltip } from '@/content/fa';
import {
  AGENCY_DEFAULTS,
  MARGIN_BENCHMARK,
  agencySchema,
  computeAgencyRate,
  computeAsf,
  computeBlended,
  computeMargin,
  validRoleLines,
  type AgencyFormValues,
} from './agencyForm';

const CostDoughnut = lazy(() => import('@/components/charts/CostDoughnut'));

const META = MODULES.find((m) => m.id === 'agency');

export function AgencyPage() {
  const { control, reset } = useForm<AgencyFormValues>({
    resolver: zodResolver(agencySchema) as Resolver<AgencyFormValues>,
    defaultValues: AGENCY_DEFAULTS,
    mode: 'onChange',
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'roleLines' });

  const values = useWatch({ control });
  const form = values as AgencyFormValues;
  const asf = computeAsf(form);
  const rate = computeAgencyRate(form);
  const blended = computeBlended(form);
  const margin = computeMargin(form);

  const roleShares = validRoleLines(form.roleLines ?? []).map((l) => ({
    label: l.role,
    value: l.hours * l.rate,
  }));

  const proposalRef = useRef<HTMLDivElement>(null);
  const printProposal = useReactToPrint({ contentRef: proposalRef });
  const hasProposal = blended !== null || asf !== null;

  const proposalSections = [
    {
      title: label('proposal.results'),
      rows: [
        ...(asf !== null
          ? [{ label: label('agency.asf'), value: `${toPersianDigits(asf.toFixed(2))}×` }]
          : []),
        ...(rate !== null ? [{ label: label('agency.agencyRate'), value: formatToman(rate) }] : []),
        ...(blended !== null
          ? [{ label: label('agency.blended'), value: formatToman(blended) }]
          : []),
        ...(margin ? [{ label: label('agency.margin'), value: formatPercent(margin.margin) }] : []),
      ],
    },
    ...(roleShares.length > 0
      ? [
          {
            title: label('agency.rolesGroup'),
            rows: roleShares.map((r) => ({ label: r.label, value: formatToman(r.value) })),
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      <ModuleHeader
        title={META?.name ?? ''}
        description={META?.description}
        onHelp={() => void startModuleTour('agency')}
        onExportPdf={hasProposal ? () => printProposal() : undefined}
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          {/* نیروی کار + ASF */}
          <Card data-tour="agency-labor">
            <CardHeader>
              <CardTitle>{label('agency.laborGroup')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <FormMoney
                control={control}
                name="directLabor"
                label={label('agency.directLabor')}
                tooltip={tooltip('agency.directLabor')}
              />
              <FormMoney
                control={control}
                name="indirectLabor"
                label={label('agency.indirectLabor')}
                tooltip={tooltip('agency.indirectLabor')}
              />
            </CardContent>
          </Card>

          {/* نرخ سطح آژانس */}
          <Card>
            <CardHeader>
              <CardTitle>{label('agency.rateGroup')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <FormMoney
                control={control}
                name="mar"
                label={label('agency.mar')}
                tooltip={tooltip('agency.mar')}
                step={50_000}
              />
              <FormSlider
                control={control}
                name="cm"
                label={label('agency.cm')}
                tooltip={tooltip('web.cm')}
                min={RANGES.cm.min}
                max={RANGES.cm.max}
                step={0.1}
                fallback={RANGES.cm.default}
                formatValue={(v) => `${toPersianDigits(v.toFixed(1))}×`}
              />
            </CardContent>
          </Card>

          {/* نقش‌ها (field array) */}
          <Card data-tour="agency-roles">
            <CardHeader>
              <CardTitle className="flex items-center gap-1.5">
                {label('agency.rolesGroup')}
                <InfoTooltip content={tooltip('agency.roles')} />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {fields.map((f, i) => (
                <div key={f.id} className="flex flex-wrap items-end gap-2 sm:flex-nowrap">
                  <div className="w-full space-y-1 sm:flex-1">
                    <Label htmlFor={`role-${f.id}`} className="text-xs">
                      {label('agency.role')}
                    </Label>
                    <Controller
                      control={control}
                      name={`roleLines.${i}.role`}
                      render={({ field }) => (
                        <Input id={`role-${f.id}`} className="h-11" {...field} />
                      )}
                    />
                  </div>
                  <div className="flex-1 sm:w-20 sm:flex-none">
                    <Controller
                      control={control}
                      name={`roleLines.${i}.hours`}
                      render={({ field }) => (
                        <div className="space-y-1">
                          <Label className="text-xs">{label('agency.roleHours')}</Label>
                          <Input
                            inputMode="decimal"
                            dir="ltr"
                            aria-label={`${label('agency.roleHours')} ${i + 1}`}
                            className="h-11 text-center"
                            value={field.value == null ? '' : toPersianDigits(field.value)}
                            onChange={(e) => field.onChange(parseField(e.target.value))}
                          />
                        </div>
                      )}
                    />
                  </div>
                  <div className="flex-1 sm:w-28 sm:flex-none">
                    <Controller
                      control={control}
                      name={`roleLines.${i}.rate`}
                      render={({ field }) => (
                        <div className="space-y-1">
                          <Label className="text-xs">{label('agency.roleRate')}</Label>
                          <Input
                            inputMode="decimal"
                            dir="ltr"
                            aria-label={`${label('agency.roleRate')} ${i + 1}`}
                            className="h-11 text-center"
                            value={field.value == null ? '' : toPersianDigits(field.value)}
                            onChange={(e) => field.onChange(parseField(e.target.value))}
                          />
                        </div>
                      )}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-11 shrink-0"
                    aria-label={`${label('action.remove')} ${i + 1}`}
                    onClick={() => remove(i)}
                  >
                    <Trash2 aria-hidden className="text-destructive" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ role: '', hours: null, rate: null })}
              >
                <Plus aria-hidden />
                {label('agency.addRole')}
              </Button>
            </CardContent>
          </Card>

          {/* راستی‌آزمایی حاشیه */}
          <Card data-tour="agency-margin">
            <CardHeader>
              <CardTitle>{label('agency.marginGroup')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <FormMoney control={control} name="pFinal" label={label('agency.pFinal')} />
              <FormMoney control={control} name="cActual" label={label('agency.cActual')} />
            </CardContent>
          </Card>
        </div>

        {/* ───── خلاصه‌ی زنده (۲/۵) ───── */}
        <div className="lg:col-span-2">
          <Card className="lg:sticky lg:top-20 lg:max-h-[calc(100dvh-6rem)] lg:overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-muted-foreground flex items-center gap-1.5 text-sm font-normal">
                {label('agency.blended')}
                <InfoTooltip content={tooltip('agency.blended')} />
              </CardTitle>
              <p className="text-success text-3xl font-bold break-words tabular-nums">
                {blended !== null ? formatToman(blended) : '—'}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1 border-t pt-3 text-sm">
                <SummaryRow
                  label={label('agency.asf')}
                  value={asf !== null ? `${toPersianDigits(asf.toFixed(2))}×` : '—'}
                />
                <SummaryRow
                  label={label('agency.agencyRate')}
                  value={rate !== null ? formatToman(rate) : '—'}
                />
              </div>

              <div className="border-t pt-3">
                <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
                  <span>{label('agency.margin')}</span>
                  <InfoTooltip content={tooltip('agency.margin')} />
                </div>
                {margin ? (
                  <div className="mt-1 space-y-2">
                    <p className="text-2xl font-bold tabular-nums">
                      {formatPercent(margin.margin)}
                    </p>
                    <BenchmarkBar
                      value={margin.margin}
                      min={MARGIN_BENCHMARK.min}
                      max={MARGIN_BENCHMARK.max}
                      segments={MARGIN_BENCHMARK.segments}
                      statusLabel={BENCHMARK_STATUS_LABELS}
                      formatValue={(v) => formatPercent(v)}
                    />
                    {margin.status === 'danger' ? (
                      <Alert variant="destructive">
                        <AlertDescription>{message('marginTooLow')}</AlertDescription>
                      </Alert>
                    ) : null}
                  </div>
                ) : (
                  <p className="text-muted-foreground mt-1 text-sm">{label('state.invalid')}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ───── دونات سهم نقش‌ها (تمام‌عرض) ───── */}
      {roleShares.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{label('agency.donutTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="mx-auto h-56 w-56 rounded-full" />}>
              <CostDoughnut ariaLabel={label('agency.donutTitle')} segments={roleShares} />
            </Suspense>
          </CardContent>
        </Card>
      ) : null}

      <ScenarioBar module="agency" inputs={values} onRestore={(inputs) => reset(inputs)} />

      <div className="hidden">
        {hasProposal ? (
          <ProposalSheet
            ref={proposalRef}
            moduleTitle={META?.name ?? ''}
            hero={{
              label: label('agency.blended'),
              value: blended !== null ? formatToman(blended) : '—',
            }}
            sections={proposalSections}
          />
        ) : null}
      </div>
    </div>
  );
}

// helper: parse a Persian/latin numeric string to number|null for role-line inputs.
function parseField(raw: string): number | null {
  if (raw.trim() === '') return null;
  const n = parsePersianNumber(raw);
  return Number.isNaN(n) ? null : n;
}
