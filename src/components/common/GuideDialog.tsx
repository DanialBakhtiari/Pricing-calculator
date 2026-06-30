import { type ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { guides, type Guide, type GuideKey } from '@/content/fa';

export interface GuideDialogProps {
  guide: GuideKey;
  /** عنصر بازکننده (دکمه) که به‌عنوان DialogTrigger استفاده می‌شود. */
  trigger: ReactNode;
}

/** مدال آموزش — توضیح کامل و مثالِ هر صفحه به زبان ساده. */
export function GuideDialog({ guide, trigger }: GuideDialogProps) {
  const g: Guide = guides[guide];
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[85dvh] gap-4 overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-start text-lg">{g.title}</DialogTitle>
          <DialogDescription className="text-foreground/80 text-start leading-7">
            {g.intro}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {g.sections.map((section) => (
            <div key={section.heading} className="space-y-1">
              <h3 className="font-semibold">{section.heading}</h3>
              <p className="text-muted-foreground text-sm leading-7">{section.body}</p>
            </div>
          ))}

          {g.example ? (
            <div className="bg-primary/5 border-primary/20 rounded-lg border p-4">
              <p className="text-primary font-semibold">💡 {g.example.title}</p>
              <p className="mt-1 text-sm leading-7">{g.example.body}</p>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
