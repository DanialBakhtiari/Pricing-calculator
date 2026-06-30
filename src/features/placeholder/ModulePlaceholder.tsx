import { Card, CardContent } from '@/components/ui/card';
import { ModuleHeader } from '@/components/common';
import { MODULES, label, type ModuleId } from '@/content/fa';

/** صفحه‌ی موقت ماژول‌ها تا فازهای ۳–۵ که ماژول‌های واقعی ساخته شوند. */
export function ModulePlaceholder({ moduleId }: { moduleId: ModuleId }) {
  const meta = MODULES.find((m) => m.id === moduleId);
  if (!meta) return null;

  return (
    <div className="space-y-6">
      <ModuleHeader title={meta.name} description={meta.description} />
      <Card>
        <CardContent className="text-muted-foreground py-12 text-center">
          {label('state.empty')}
        </CardContent>
      </Card>
    </div>
  );
}
