import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MODULES, label } from '@/content/fa';

/** داشبورد: انتخاب یکی از چهار ماژول + ورود به صفحه‌ی نمونه. */
export function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold md:text-3xl">{label('app.title')}</h1>
        <p className="text-muted-foreground">{label('app.tagline')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {MODULES.map((m) => (
          <Card key={m.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{m.name}</CardTitle>
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
        ))}
      </div>

      <div>
        <Button asChild variant="outline">
          <Link to="/playground">{label('action.tryExample')}</Link>
        </Button>
      </div>
    </div>
  );
}
