import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group';

import { cn } from '@usefaz/ui/lib/utils';

/** A row of toggles; with the default single selection it works as a segmented filter. */
function ToggleGroup({ className, ...props }: ToggleGroupPrimitive.Props) {
  return (
    <ToggleGroupPrimitive
      data-slot="toggle-group"
      className={cn('inline-flex flex-wrap items-center gap-1 rounded-lg bg-muted p-1', className)}
      {...props}
    />
  );
}

function ToggleGroupItem({ className, ...props }: TogglePrimitive.Props) {
  return (
    <TogglePrimitive
      data-slot="toggle-group-item"
      className={cn(
        'inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md px-3 text-sm font-medium whitespace-nowrap text-muted-foreground outline-none transition-colors select-none',
        'hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40',
        'data-pressed:bg-background data-pressed:text-foreground data-pressed:shadow-xs',
        'disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}

export { ToggleGroup, ToggleGroupItem };
