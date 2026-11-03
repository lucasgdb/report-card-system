import type * as React from 'react';

import { cn } from '@usefaz/ui/lib/utils';

/** The width and spacing of a page's content inside the app shell. */
export function PageContainer({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="page-container"
      className={cn('mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-10 lg:py-10', className)}
      {...props}
    />
  );
}

type PageHeaderProps = {
  title: React.ReactNode;
  /** One line under the title (what the page is for, or a count). */
  description?: React.ReactNode;
  /** Buttons and controls on the right (below the title on phones). */
  actions?: React.ReactNode;
  className?: string;
};

/** The page's `<h1>`, with an optional description and actions. */
export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div
      data-slot="page-header"
      className={cn('flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}
    >
      <div className="flex min-w-0 flex-col gap-1">
        <h1 className="font-heading text-2xl leading-tight font-semibold text-foreground">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
