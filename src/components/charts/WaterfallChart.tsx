import { useRef } from 'react';
import {
  BarElement,
  CategoryScale,
  Chart,
  LinearScale,
  Tooltip,
  type ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { formatToman } from '@/lib/format';
import { cssVar, CHART_FONT_FAMILY } from './chartTheme';
import { ChartBase } from './ChartBase';

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip);

export type WaterfallKind = 'base' | 'step' | 'total';

export interface WaterfallSegment {
  label: string;
  from: number;
  to: number;
  kind: WaterfallKind;
}

export interface WaterfallChartProps {
  segments: WaterfallSegment[];
  ariaLabel: string;
}

function colorFor(kind: WaterfallKind): string {
  if (kind === 'base') return cssVar('--chart-1');
  if (kind === 'total') return cssVar('--chart-3');
  return cssVar('--chart-2');
}

/** نمودار آبشاری با میله‌های شناور [from,to] — سهم هر ضریب (CM/RB) تا قیمت نهایی. ماژول ۲. */
export default function WaterfallChart({ segments, ariaLabel }: WaterfallChartProps) {
  const ref = useRef<Chart<'bar'>>(null);

  const data = {
    labels: segments.map((s) => s.label),
    datasets: [
      {
        data: segments.map((s) => [s.from, s.to] as [number, number]),
        backgroundColor: segments.map((s) => colorFor(s.kind)),
        borderRadius: 4,
        borderSkipped: false as const,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        rtl: true,
        bodyFont: { family: CHART_FONT_FAMILY },
        titleFont: { family: CHART_FONT_FAMILY },
        callbacks: {
          label: (ctx) => {
            const raw = ctx.raw as [number, number];
            return formatToman(Math.abs(raw[1] - raw[0]));
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { font: { family: CHART_FONT_FAMILY }, color: cssVar('--muted-foreground') },
        grid: { display: false },
      },
      y: {
        ticks: {
          font: { family: CHART_FONT_FAMILY },
          color: cssVar('--muted-foreground'),
          callback: (value) => formatToman(Number(value), { withUnit: false }),
        },
        grid: { color: cssVar('--border') },
      },
    },
  };

  const download = () => {
    const url = ref.current?.toBase64Image();
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = 'waterfall.png';
    a.click();
  };

  const dataTable = segments.map((s) => ({
    label: s.label,
    value: formatToman(Math.abs(s.to - s.from)),
  }));

  return (
    <ChartBase
      ariaLabel={ariaLabel}
      dataTable={dataTable}
      onDownload={download}
      className="max-w-xl"
    >
      <Bar ref={ref} data={data} options={options} aria-hidden />
    </ChartBase>
  );
}
