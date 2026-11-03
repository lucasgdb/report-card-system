import { Input } from '@usefaz/ui/components/ui/input';
import { cn } from '@usefaz/ui/lib/utils';

/** Reads what was typed in a grade field: `null` when empty, `NaN` when it isn't a number ("8,5" and "8.5" work). */
export function parseMark(value: string) {
  const trimmed = value.trim();
  return trimmed ? Number(trimmed.replace(',', '.')) : null;
}

/** A short field for a grade or an absence count, centered; empty means "not given yet". */
export function GradeInput({ className, ...props }: Omit<React.ComponentProps<'input'>, 'type'>) {
  return (
    <Input
      data-slot="grade-input"
      type="text"
      inputMode="decimal"
      autoComplete="off"
      placeholder="—"
      className={cn(
        'h-10 w-full min-w-0 px-1 text-center tabular-nums placeholder:text-muted-foreground/60',
        className
      )}
      {...props}
    />
  );
}
