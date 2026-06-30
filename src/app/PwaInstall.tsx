import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Download, Monitor, Smartphone } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toPersianDigits } from '@/lib/format';
import { useAppStore } from '@/lib/storage/appStore';
import { installGuide, label, message, type InstallPlatformId } from '@/content/fa';
import { usePwaInstall } from './use-pwa-install';

const PLATFORM_ICON: Record<InstallPlatformId, typeof Smartphone> = {
  ios: Smartphone,
  android: Smartphone,
  desktop: Monitor,
};

/** مدال آموزش نصب — گام‌های هر پلتفرم؛ دستگاهِ کاربر اول و هایلایت می‌شود. */
function InstallGuideDialog({
  open,
  onOpenChange,
  platform,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  platform: InstallPlatformId;
}) {
  // دستگاهِ تشخیص‌داده‌شده را اول بیاور.
  const platforms = [...installGuide()].sort(
    (a, b) => Number(b.id === platform) - Number(a.id === platform),
  );
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[88dvh] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="from-primary/10 shrink-0 space-y-3 border-b bg-gradient-to-b to-transparent p-6 pe-14 text-start">
          <div className="flex items-start gap-3">
            <div className="bg-primary/12 text-primary flex size-11 shrink-0 items-center justify-center rounded-xl">
              <Download className="size-5" aria-hidden />
            </div>
            <DialogTitle className="pt-1.5 text-start text-lg leading-snug">
              {label('install.guideTitle')}
            </DialogTitle>
          </div>
          <DialogDescription className="text-foreground/75 text-start text-sm leading-7">
            {label('install.guideIntro')}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-6">
          {platforms.map((pf) => {
            const Icon = PLATFORM_ICON[pf.id];
            const isYours = pf.id === platform;
            return (
              <div
                key={pf.id}
                className={cn(
                  'rounded-xl border p-4',
                  isYours ? 'border-primary/40 bg-primary/5' : 'border-border',
                )}
              >
                <p className="flex items-center gap-2 font-semibold">
                  <Icon className="text-primary size-4 shrink-0" aria-hidden />
                  {pf.title}
                  {isYours ? (
                    <span className="bg-primary/15 text-primary ms-auto rounded-full px-2 py-0.5 text-xs font-medium">
                      {label('install.yourDevice')}
                    </span>
                  ) : null}
                </p>
                <ol className="mt-2.5 space-y-2">
                  {pf.steps.map((step, i) => (
                    <li key={step} className="text-muted-foreground flex gap-2.5 text-sm leading-6">
                      <span className="bg-secondary text-secondary-foreground mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums">
                        {toPersianDigits(i + 1)}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * کنترلِ نصب PWA: دکمه‌ی هدر + مدال آموزش + توستِ یادآوریِ یک‌باره.
 * در حالت نصب‌شده (standalone) چیزی نشان نمی‌دهد. در embed اصلاً رندر نمی‌شود.
 */
export function PwaInstall() {
  const { canPrompt, promptInstall, standalone, installed, platform, isIOS } = usePwaInstall();
  const installHintSeen = useAppStore((s) => s.installHintSeen);
  const markInstallHintSeen = useAppStore((s) => s.markInstallHintSeen);
  const [guideOpen, setGuideOpen] = useState(false);

  const eligible = !standalone && !installed;

  const openInstall = useCallback(async () => {
    if (canPrompt) {
      // اندروید/دسکتاپ Chromium: پرامپت نیتیو. اگر رد شد، گام‌های دستی را نشان بده.
      const accepted = await promptInstall();
      if (!accepted) setGuideOpen(true);
    } else {
      // iOS و بقیه: فقط آموزش دستی (پرامپت برنامه‌ای ندارند).
      setGuideOpen(true);
    }
  }, [canPrompt, promptInstall]);

  // یک‌بار، با تأخیر کوتاه: توستِ یادآوری — فقط روی دستگاه‌هایی که واقعاً نصب دارند.
  useEffect(() => {
    if (!eligible || installHintSeen) return;
    if (!canPrompt && !isIOS) return;
    const id = window.setTimeout(() => {
      toast(message('pwaInstall'), {
        action: { label: label('install.action'), onClick: () => void openInstall() },
        duration: 12_000,
      });
      markInstallHintSeen();
    }, 3500);
    return () => window.clearTimeout(id);
  }, [eligible, installHintSeen, canPrompt, isIOS, markInstallHintSeen, openInstall]);

  if (!eligible) return null;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="h-11 gap-1.5"
        onClick={() => void openInstall()}
        aria-label={label('install.button')}
      >
        <Download className="size-4" aria-hidden />
        <span className="hidden text-sm font-medium sm:inline">{label('install.button')}</span>
      </Button>
      <InstallGuideDialog open={guideOpen} onOpenChange={setGuideOpen} platform={platform} />
    </>
  );
}
