import { Suspense } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useAppStore } from '@/lib/storage/appStore';
import { label } from '@/content/fa';
import { useApplyTheme } from './use-apply-theme';

/** پوسته‌ی سراسری: نوار بالا (عنوان + تاگل تم) + محتوای صفحه + Toaster. */
export function AppLayout() {
  useApplyTheme();
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);

  return (
    <TooltipProvider>
      <div className="bg-background text-foreground min-h-dvh">
        <header className="bg-background/80 sticky top-0 z-10 border-b backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link to="/" className="font-bold">
              {label('app.title')}
            </Link>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? label('theme.toLight') : label('theme.toDark')}
            >
              {theme === 'dark' ? <Sun aria-hidden /> : <Moon aria-hidden />}
            </Button>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-8">
          <Suspense
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

        <Toaster />
      </div>
    </TooltipProvider>
  );
}
