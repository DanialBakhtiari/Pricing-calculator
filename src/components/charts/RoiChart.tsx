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

export interface RoiChartProps {
  monthlyValue: number;
  retainer: number;
  valueLabel: string;
  retainerLabel: string;
  ariaLabel: string;
}

/** مقایسه‌ی «ارزش ماهانه‌ی ترافیک» با «هزینه‌ی ماهانه» — ماژول ۳. */
export default function RoiChart({
  monthlyValue,
  retainer,
  valueLabel,
  retainerLabel,
  ariaLabel,
}: RoiChartProps) {
  const ref = useRef<Chart<'bar'>>(null);

  const data = {
    labels: [valueLabel, retainerLabel],
    datasets: [
      {
        data: [monthlyValue, retainer],
        backgroundColor: [cssVar('--chart-3'), cssVar('--chart-1')],
        borderRadius: 4,
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
        callbacks: { label: (ctx) => formatToman(ctx.parsed.y ?? 0) },
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
    a.download = 'roi.png';
    a.click();
  };

  const dataTable = [
    { label: valueLabel, value: formatToman(monthlyValue) },
    { label: retainerLabel, value: formatToman(retainer) },
  ];

  return (
    <ChartBase
      ariaLabel={ariaLabel}
      dataTable={dataTable}
      onDownload={download}
      className="max-w-md"
    >
      <Bar ref={ref} data={data} options={options} aria-hidden />
    </ChartBase>
  );
}
