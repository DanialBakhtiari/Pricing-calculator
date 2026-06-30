import { Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatToman } from '@/lib/format';
import { label } from '@/content/fa';

export interface TierCardItem {
  id: string;
  name: string;
  price: number;
  features: readonly string[];
  recommended: boolean;
}

export interface TierCardsProps {
  tiers: TierCardItem[];
}

/** سه کارت قیمت؛ سطح «پیشنهادی» با حاشیه‌ی برند و badge هایلایت می‌شود (design §5). */
export function TierCards({ tiers }: TierCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {tiers.map((tier) => (
        <Card
          key={tier.id}
          className={cn(
            'flex flex-col',
            tier.recommended && 'border-primary ring-primary/30 ring-2',
          )}
        >
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <CardTitle>{tier.name}</CardTitle>
              {tier.recommended ? <Badge>{label('web.recommended')}</Badge> : null}
            </div>
            <p className="text-2xl font-bold tabular-nums">{formatToman(tier.price)}</p>
          </CardHeader>
          <CardContent className="mt-auto">
            <ul className="space-y-1.5 text-sm">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check aria-hidden className="text-success size-4 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
