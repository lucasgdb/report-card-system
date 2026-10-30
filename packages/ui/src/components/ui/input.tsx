import type * as React from 'react';
import { Input as InputPrimitive } from '@base-ui/react/input';
import { cn } from '@usefaz/ui/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        // Usefaz: h-11, primary border/ring on hover and focus.
        'h-11 w-full min-w-0 rounded-lg border border-input bg-transparent px-3.5 py-1 text-base md:text-[15px] transition-[color,background-color,border-color,box-shadow] duration-200 outline-none enabled:hover:border-primary enabled:hover:ring-2 enabled:hover:ring-primary/20 file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/35 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
        className
      )}
      {...props}
    />
  );
}

export { Input };
