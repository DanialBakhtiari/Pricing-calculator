import { type ReactNode } from 'react';
import { GraduationCap, Lightbulb } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toPersianDigits } from '@/lib/format';
import { guide as getGuide, type GuideKey } from '@/content/fa';

export interface GuideDialogProps {
  guide: GuideKey;
  /** عنصر بازکننده (دکمه) که به‌عنوان DialogTrigger استفاده می‌شود. */
  trigger: ReactNode;
}

/** مدال آموزش — هدرِ برند + بخش‌های شماره‌دار + کارت مثال. به زبان فعال و RTL/LTR-aware. */
export function GuideDialog({ guide, trigger }: GuideDialogProps) {
  const g = getGuide(guide);
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="flex max-h-[88dvh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        {/* نوار هدر با آیکن برند */}
        <DialogHeader className="from-primary/10 shrink-0 space-y-3 border-b bg-gradient-to-b to-transparent p-6 pe-14 text-start">
          <div className="flex items-start gap-3">
            <div className="bg-primary/12 text-primary flex size-11 shrink-0 items-center justify-center rounded-xl">
              <GraduationCap className="size-5" aria-hidden />
            </div>
            <DialogTitle className="pt-1.5 text-start text-lg leading-snug">{g.title}</DialogTitle>
          </div>
          <DialogDescription className="text-foreground/75 text-start text-sm leading-7">
            {g.intro}
          </DialogDescription>
        </DialogHeader>

        {/* بدنه (اسکرول‌شونده) */}
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-6">
          {g.sections.map((section, i) => (
            <div key={section.heading} className="flex gap-3">
              <div className="bg-secondary text-secondary-foreground mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums">
                {toPersianDigits(i + 1)}
              </div>
              <div className="space-y-1">
                <h3 className="leading-6 font-semibold">{section.heading}</h3>
                <p className="text-muted-foreground text-sm leading-7">{section.body}</p>
              </div>
            </div>
          ))}

          {g.example ? (
            <div className="bg-primary/5 border-primary/20 rounded-xl border p-4">
              <p className="text-primary flex items-center gap-1.5 font-semibold">
                <Lightbulb className="size-4 shrink-0" aria-hidden />
                {g.example.title}
              </p>
              <p className="text-foreground/80 mt-1.5 text-sm leading-7">{g.example.body}</p>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
