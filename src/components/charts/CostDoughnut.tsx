import { useRef } from 'react';
import { ArcElement, Chart, Legend, Tooltip, type ChartOptions } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { formatToman } from '@/lib/format';
import { cssVar, CHART_FONT_FAMILY } from './chartTheme';
import { ChartBase } from './ChartBase';

// فقط المان‌های لازم را register کن (tree-shake).
Chart.register(ArcElement, Tooltip, Legend);

export interface CostSegment {
  label: string;
  value: number;
}

export interface CostDoughnutProps {
  segments: CostSegment[];
  ariaLabel: string;
}

/** نمودار دونات سهم هزینه‌ها (مستقیم/سربار/سود) — ماژول ۱. */
export default function CostDoughnut({ segments, ariaLabel }: CostDoughnutProps) {
  const ref = useRef<Chart<'doughnut'>>(null);
  // پالت چرخشی chart-1..5 — برای ۳ بخش هزینه و N نقش (BlendedDonut) قابل‌استفاده.
  const colors = segments.map((_, i) => cssVar(`--chart-${(i % 5) + 1}`));

  const data = {
    labels: segments.map((s) => s.label),
    datasets: [
      {
        data: segments.map((s) => s.value),
        backgroundColor: colors,
        borderColor: cssVar('--background'),
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        rtl: true,
        labels: { font: { family: CHART_FONT_FAMILY }, color: cssVar('--foreground') },
      },
      tooltip: {
        rtl: true,
        bodyFont: { family: CHART_FONT_FAMILY },
        titleFont: { family: CHART_FONT_FAMILY },
        callbacks: { label: (ctx) => `${ctx.label}: ${formatToman(ctx.parsed)}` },
      },
    },
  };

  const download = () => {
    const url = ref.current?.toBase64Image();
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cost-doughnut.png';
    a.click();
  };

  const dataTable = segments.map((s) => ({ label: s.label, value: formatToman(s.value) }));

  return (
    <ChartBase ariaLabel={ariaLabel} dataTable={dataTable} onDownload={download}>
      <Doughnut ref={ref} data={data} options={options} aria-hidden />
    </ChartBase>
  );
}
