import { useEffect, type ComponentType } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Calculator,
  FlaskConical,
  Globe,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/storage/appStore';
import { startModuleTour } from '@/lib/onboarding/runTour';
import { MODULES, label, type ModuleId } from '@/content/fa';
import { isEmbed } from '@/app/embed';

const MODULE_ICONS: Record<ModuleId, ComponentType<{ className?: string }>> = {
  mar: Calculator,
  web: Globe,
  seo: TrendingUp,
  agency: Building2,
};

export function DashboardPage() {
  const welcomeTourDone = useAppStore((s) => s.welcomeTourDone);
  const markWelcomeTourDone = useAppStore((s) => s.markWelcomeTourDone);

  // تور خوش‌آمد یک‌بار در اولین بازدید (نه در حالت embed).
  useEffect(() => {
    if (!welcomeTourDone && !isEmbed()) {
      markWelcomeTourDone();
      void startModuleTour('welcome');
    }
  }, [welcomeTourDone, markWelcomeTourDone]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold md:text-3xl">{label('app.title')}</h1>
          <p className="text-muted-foreground">{label('app.tagline')}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-11"
          onClick={() => void startModuleTour('welcome')}
        >
          <HelpCircle aria-hidden />
          {label('action.help')}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {MODULES.map((m) => {
          const Icon = MODULE_ICONS[m.id];
          return (
            <Card key={m.id} className="flex flex-col">
              <CardHeader>
                <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                  <Icon className="size-5" />
                </div>
                <CardTitle className="pt-2">{m.name}</CardTitle>
                <CardDescription>{m.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button asChild className="w-full sm:w-auto">
                  <Link to={m.path}>
                    {m.name}
                    <ArrowLeft aria-hidden className="rtl:-scale-x-100" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div>
        <Button asChild variant="outline" className="h-11">
          <Link to="/playground">
            <FlaskConical aria-hidden />
            {label('action.tryExample')}
          </Link>
        </Button>
      </div>
    </div>
  );
}
