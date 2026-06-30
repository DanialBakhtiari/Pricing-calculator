import { useId, useState } from 'react';
import { toast } from 'sonner';
import { RotateCcw, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/lib/storage/appStore';
import { toPersianDigits } from '@/lib/format';
import { label, message, type ModuleId } from '@/content/fa';

export interface ScenarioBarProps {
  module: ModuleId;
  inputs: Record<string, unknown>;
  onRestore: (inputs: Record<string, unknown>) => void;
}

/** ذخیره/بازیابی/حذف سناریوهای یک ماژول (zustand + persist). */
export function ScenarioBar({ module, inputs, onRestore }: ScenarioBarProps) {
  const scenarios = useAppStore((s) => s.scenarios);
  const addScenario = useAppStore((s) => s.addScenario);
  const removeScenario = useAppStore((s) => s.removeScenario);
  const [title, setTitle] = useState('');
  const titleId = useId();

  const mine = scenarios.filter((s) => s.module === module);

  const handleSave = () => {
    const finalTitle =
      title.trim() || `${label('scenario.titlePrefix')} ${toPersianDigits(mine.length + 1)}`;
    addScenario({ module, title: finalTitle, inputs });
    setTitle('');
    toast.success(message('scenarioSaved'));
  };

  const handleDelete = (id: string) => {
    removeScenario(id);
    toast.success(message('scenarioDeleted'));
  };

  return (
    <Card>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Label htmlFor={titleId} className="sr-only">
            {label('scenario.name')}
          </Label>
          <Input
            id={titleId}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={label('scenario.namePlaceholder')}
          />
          <Button type="button" size="sm" onClick={handleSave}>
            <Save aria-hidden />
            {label('action.save')}
          </Button>
        </div>

        {mine.length > 0 ? (
          <ul className="divide-border divide-y">
            {mine.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-2 py-2">
                <span className="truncate text-sm">{s.title}</span>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRestore(s.inputs)}
                  >
                    <RotateCcw aria-hidden />
                    {label('scenario.restore')}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`${label('action.remove')} ${s.title}`}
                    onClick={() => handleDelete(s.id)}
                  >
                    <Trash2 aria-hidden className="text-destructive" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground text-xs">{label('scenario.empty')}</p>
        )}
      </CardContent>
    </Card>
  );
}
