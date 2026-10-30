import { cn } from '@usefaz/ui/lib/utils';

import type { ScoreTone } from './score-badge';

const dotClasses: Record<ScoreTone, string> = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  destructive: 'bg-red-500',
};

type ToneLegendProps = {
  items: { tone: ScoreTone; label: string }[];
  className?: string;
};

/** Explains what each badge color means. */
export function ToneLegend({ items, className }: ToneLegendProps) {
  return (
    <ul data-slot="tone-legend" className={cn('flex flex-wrap gap-x-5 gap-y-2 text-sm text-(--text-muted)', className)}>
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-2">
          <span aria-hidden className={cn('size-2.5 rounded-full', dotClasses[item.tone])} />
          {item.label}
        </li>
      ))}
    </ul>
  );
}
