import { Suspense } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Direction } from 'radix-ui';
import { Globe, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useAppStore } from '@/lib/storage/appStore';
import { dirOf } from '@/lib/i18n/locale';
import { BRAND, label } from '@/content/fa';
import { useApplyTheme } from './use-apply-theme';
import { useApplyLocale } from './use-apply-locale';
import { isEmbed, usePostHeight } from './embed';

/** تاگل تم روشن/تیره. */
function ThemeToggle() {
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  return (
    <Button
      variant="outline"
      size="icon"
      className="size-11"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? label('theme.toLight') : label('theme.toDark')}
    >
      {theme === 'dark' ? <Sun aria-hidden /> : <Moon aria-hidden />}
    </Button>
  );
}

/** تاگل زبان فارسی/انگلیسی — متنِ دکمه، زبانِ مقصد است. */
function LanguageToggle() {
  const locale = useAppStore((s) => s.locale);
  const toggleLocale = useAppStore((s) => s.toggleLocale);
  const next = locale === 'fa' ? label('locale.toEnglish') : label('locale.toPersian');
  return (
    <Button
      variant="outline"
      size="sm"
      className="h-11 gap-1.5"
      onClick={toggleLocale}
      aria-label={label('locale.change')}
    >
      <Globe aria-hidden className="size-4" />
      <span className="text-sm font-medium">{next}</span>
    </Button>
  );
}

/** پوسته‌ی سراسری: نوار بالا (عنوان + تاگل زبان/تم) + محتوای صفحه + Toaster. */
export function AppLayout() {
  useApplyTheme();
  useApplyLocale();
  const embed = isEmbed();
  usePostHeight(embed);
  const locale = useAppStore((s) => s.locale);

  return (
    <Direction.DirectionProvider dir={dirOf(locale)}>
      <TooltipProvider>
        <div className="bg-background text-foreground min-h-dvh">
          {/* در حالت embed، هدر سایت میزبان نمایش داده می‌شود؛ نوار ما حذف می‌شود. */}
          {embed ? (
            <div className="flex justify-end gap-2 px-4 pt-3">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          ) : (
            <header className="bg-background/80 sticky top-0 z-10 border-b backdrop-blur">
              <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
                <Link to="/" className="font-bold">
                  {label('app.title')}
                </Link>
                <div className="flex items-center gap-2">
                  <LanguageToggle />
                  <ThemeToggle />
                </div>
              </div>
            </header>
          )}

          <main className="mx-auto max-w-5xl px-4 py-8">
            {/* با تغییر زبان، زیردرختِ مسیر remount می‌شود تا accessorها دوباره با
                زبان جدید خوانده شوند (Outlet با re-renderِ والد به‌تنهایی re-run نمی‌شود). */}
            <Suspense
              key={locale}
              fallback={
                <div className="space-y-4">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-64 w-full" />
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </main>

          {embed ? null : (
            <footer className="mt-8 border-t">
              <div className="text-muted-foreground mx-auto flex max-w-5xl flex-col items-center gap-2 px-4 py-6 text-center text-sm sm:flex-row sm:justify-between sm:text-start">
                <p className="font-medium">{label('footer.madeBy')}</p>
                <div className="flex items-center gap-4">
                  <a
                    href={BRAND.site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground underline-offset-4 hover:underline"
                  >
                    {label('footer.site')}
                  </a>
                  <a
                    href={BRAND.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground underline-offset-4 hover:underline"
                  >
                    {label('footer.github')}
                  </a>
                </div>
              </div>
              <p className="text-muted-foreground/70 px-4 pb-4 text-center text-xs">
                {label('footer.rights')}
              </p>
            </footer>
          )}

          <Toaster />
        </div>
      </TooltipProvider>
    </Direction.DirectionProvider>
  );
}
