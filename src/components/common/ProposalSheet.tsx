import { type Ref } from 'react';
import { label } from '@/content/fa';

export interface ProposalRow {
  label: string;
  value: string;
}

export interface ProposalSection {
  title: string;
  rows: ProposalRow[];
}

export interface ProposalTier {
  name: string;
  price: string;
  recommended: boolean;
  features: readonly string[];
}

export interface ProposalSheetProps {
  ref?: Ref<HTMLDivElement>;
  moduleTitle: string;
  hero: ProposalRow;
  sections: ProposalSection[];
  tiers?: ProposalTier[];
}

function todayFa(): string {
  try {
    return new Intl.DateTimeFormat('fa-IR', { dateStyle: 'long' }).format(new Date());
  } catch {
    return '';
  }
}

/**
 * برگه‌ی پروپوزالِ قابل‌چاپ (A4، RTL). رنگ‌های صریحِ روشن تا مستقل از تم چاپ شود.
 * با react-to-print چاپ/PDF می‌شود. روی صفحه پنهان است (در یک wrapper با کلاس hidden).
 */
export function ProposalSheet({ ref, moduleTitle, hero, sections, tiers }: ProposalSheetProps) {
  return (
    <div ref={ref} dir="rtl" className="bg-white p-10 font-sans text-neutral-900">
      <header className="flex items-start justify-between border-b-2 border-indigo-600 pb-4">
        <div>
          <p className="text-sm text-neutral-500">{label('app.title')}</p>
          <h1 className="text-2xl font-bold text-indigo-700">
            {label('proposal.title')} — {moduleTitle}
          </h1>
        </div>
        <p className="text-sm text-neutral-500">
          {label('proposal.date')}: {todayFa()}
        </p>
      </header>

      <section className="mt-6 rounded-lg bg-indigo-50 p-5">
        <p className="text-sm text-neutral-600">{hero.label}</p>
        <p className="text-3xl font-bold text-indigo-700 tabular-nums">{hero.value}</p>
      </section>

      {sections.map((section) => (
        <section key={section.title} className="mt-6">
          <h2 className="mb-2 text-base font-semibold text-neutral-800">{section.title}</h2>
          <table className="w-full border-collapse text-sm">
            <tbody>
              {section.rows.map((row) => (
                <tr key={row.label} className="border-b border-neutral-200">
                  <th scope="row" className="py-2 text-start font-normal text-neutral-600">
                    {row.label}
                  </th>
                  <td className="py-2 text-end font-medium tabular-nums">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}

      {tiers && tiers.length > 0 ? (
        <section className="mt-6">
          <h2 className="mb-3 text-base font-semibold text-neutral-800">
            {label('web.tiersTitle')}
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-lg border p-4 ${tier.recommended ? 'border-indigo-600 bg-indigo-50' : 'border-neutral-300'}`}
              >
                <p className="font-semibold">
                  {tier.name}
                  {tier.recommended ? (
                    <span className="ms-1 text-xs text-indigo-700">
                      ★ {label('web.recommended')}
                    </span>
                  ) : null}
                </p>
                <p className="mt-1 text-lg font-bold tabular-nums">{tier.price}</p>
                <ul className="mt-2 space-y-1 text-xs text-neutral-600">
                  {tier.features.map((f) => (
                    <li key={f}>• {f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <footer className="mt-10 border-t border-neutral-200 pt-3 text-center text-xs text-neutral-400">
        {label('proposal.generatedBy')}
      </footer>
    </div>
  );
}
