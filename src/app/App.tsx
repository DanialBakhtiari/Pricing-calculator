import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/app/use-theme';

export function App() {
  const { theme, toggle } = useTheme();

  return (
    <div className="bg-background text-foreground min-h-dvh">
      <header className="border-b">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <h1 className="text-lg font-bold">ماشین‌حساب قیمت‌گذاری</h1>
          <Button
            variant="outline"
            size="icon"
            onClick={toggle}
            aria-label={theme === 'dark' ? 'روشن کردن تم' : 'تیره کردن تم'}
          >
            {theme === 'dark' ? <Sun aria-hidden /> : <Moon aria-hidden />}
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>سلام 👋</CardTitle>
            <CardDescription>
              اسکلت پروژه آماده است — فارسی، راست‌چین، با فونت وزیرمتن و تم روشن/تیره.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground text-sm leading-7">
              این صفحه‌ی موقت فاز ۰ است. در فازهای بعد، چهار ماژول قیمت‌گذاری (موتور هزینه و MAR،
              وب/وردپرس، سئو/ROI و مقیاس‌پذیری آژانس) روی همین پایه ساخته می‌شوند.
            </p>

            <div className="flex flex-wrap gap-2">
              <Button>دکمه‌ی اصلی</Button>
              <Button variant="secondary">ثانویه</Button>
              <Button variant="outline">حاشیه‌دار</Button>
            </div>

            <div className="border-t pt-4">
              <p className="text-muted-foreground text-xs">
                نمونه‌ی نمایش عدد (تراز با tabular-nums):
              </p>
              <p className="text-3xl font-bold tabular-nums">۱۲٬۰۰۰٬۰۰۰ تومان</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
