import type * as React from 'react';

import { cn } from '@usefaz/ui/lib/utils';

type AppHeaderProps = React.ComponentProps<'header'> & {
  /** Compact (64px: 12px + 40px controls + 11px + 1px border), used once the page scrolls on desktop. */
  condensed?: boolean;
};

function AppHeader({ condensed = false, className, ...props }: AppHeaderProps) {
  return (
    <header
      data-slot="app-header"
      data-state={condensed ? 'condensed' : 'expanded'}
      className={cn(
        'sticky top-0 z-20 flex justify-between gap-2 border-b border-border bg-(--bg-main) px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[11px] transition-[padding,border-color] duration-200 motion-reduce:transition-none min-[500px]:px-12',
        condensed
          ? 'min-[1076px]:px-12 min-[1076px]:pt-3 min-[1076px]:pb-[11px]'
          : 'min-[1076px]:border-transparent min-[1076px]:px-[10%] min-[1076px]:py-9',
        className
      )}
      {...props}
    />
  );
}

export { AppHeader };
