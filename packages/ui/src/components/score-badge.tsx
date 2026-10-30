import { Badge } from '@usefaz/ui/components/ui/badge';
import { cn } from '@usefaz/ui/lib/utils';

export type ScoreTone = 'success' | 'warning' | 'destructive';

type ScoreBadgeProps = {
  tone: ScoreTone;
  children: React.ReactNode;
  /** Extra text for screen readers, so the meaning doesn't depend on the color. */
  srLabel?: string;
  className?: string;
};

/** Status badge for numbers such as averages and absences (soft, high-contrast, tabular figures). */
export function ScoreBadge({ tone, children, srLabel, className }: ScoreBadgeProps) {
  return (
    <Badge variant={tone} className={cn('h-7 min-w-14 px-2.5 text-sm font-semibold tabular-nums', className)}>
      {children}
      {srLabel && <span className="sr-only"> ({srLabel})</span>}
    </Badge>
  );
}
