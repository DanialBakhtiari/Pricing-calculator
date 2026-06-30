import { Link } from 'react-router-dom';
import { ArrowRight, Download, FileDown, GraduationCap, HelpCircle, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { label, type GuideKey } from '@/content/fa';
import { GuideDialog } from './GuideDialog';

export interface ModuleHeaderProps {
  title: string;
  description?: string;
  /** کلید مدال آموزش این ماژول. */
  guide?: GuideKey;
  onHelp?: () => void;
  onSave?: () => void;
  onExportPdf?: () => void;
  onDownloadImage?: () => void;
}

/** سربرگ هر ماژول: عنوان + بازگشت + دکمه‌ی راهنما (تور) + خروجی‌ها. */
export function ModuleHeader({
  title,
  description,
  guide,
  onHelp,
  onSave,
  onExportPdf,
  onDownloadImage,
}: ModuleHeaderProps) {
  return (
    <div className="flex flex-col gap-3 border-b pb-4 md:flex-row md:items-start md:justify-between">
      <div className="space-y-1">
        <Button asChild variant="ghost" size="sm" className="text-muted-foreground -ms-2 h-11">
          <Link to="/">
            {/* فلش بازگشت در RTL آینه می‌شود */}
            <ArrowRight aria-hidden className="rtl:-scale-x-100" />
            {label('nav.back')}
          </Link>
        </Button>
        <h1 className="text-xl font-bold md:text-2xl">{title}</h1>
        {description ? <p className="text-muted-foreground text-sm">{description}</p> : null}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {guide ? (
          <GuideDialog
            guide={guide}
            trigger={
              <Button type="button" variant="outline" size="sm" className="h-11">
                <GraduationCap aria-hidden />
                {label('guide.open')}
              </Button>
            }
          />
        ) : null}
        {onHelp ? (
          <Button type="button" variant="outline" size="sm" className="h-11" onClick={onHelp}>
            <HelpCircle aria-hidden />
            {label('action.help')}
          </Button>
        ) : null}
        {onSave ? (
          <Button type="button" variant="outline" size="sm" className="h-11" onClick={onSave}>
            <Save aria-hidden />
            {label('action.save')}
          </Button>
        ) : null}
        {onExportPdf ? (
          <Button type="button" variant="outline" size="sm" className="h-11" onClick={onExportPdf}>
            <FileDown aria-hidden />
            {label('action.exportPdf')}
          </Button>
        ) : null}
        {onDownloadImage ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-11"
            onClick={onDownloadImage}
          >
            <Download aria-hidden />
            {label('action.downloadImage')}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
