import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';

import { Spinner } from '@usefaz/ui/components/ui/spinner';
import { cn } from '@usefaz/ui/lib/utils';

// shadcn's button, on the Usefaz palette. No shadows and no movement: states are shown by color.
const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-colors duration-200 outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-busy:cursor-progress aria-busy:opacity-100 motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground not-data-disabled:hover:bg-primary-hover not-data-disabled:active:bg-primary-active',
        secondary:
          'bg-secondary text-secondary-foreground not-data-disabled:hover:bg-secondary-hover not-data-disabled:active:bg-secondary-active',
        outline:
          'border-border bg-background text-foreground not-data-disabled:hover:bg-muted aria-expanded:bg-muted dark:border-input dark:bg-input/30 dark:not-data-disabled:hover:bg-input/50',
        ghost:
          'text-foreground not-data-disabled:hover:bg-muted aria-expanded:bg-muted dark:not-data-disabled:hover:bg-muted/50',
        destructive:
          'bg-destructive/10 text-destructive not-data-disabled:hover:bg-destructive/20 focus-visible:ring-destructive/25 dark:bg-destructive/20 dark:text-red-300 dark:not-data-disabled:hover:bg-destructive/30',
        link: 'text-primary underline-offset-4 not-data-disabled:hover:underline',
      },
      size: {
        default: 'h-10 gap-2 px-4',
        xs: "h-7 gap-1 rounded-md px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 rounded-md px-3 text-[0.8125rem] [&_svg:not([class*='size-'])]:size-3.5",
        lg: 'h-12 gap-2 rounded-xl px-6 text-base',
        icon: "size-10 [&_svg:not([class*='size-'])]:size-5",
        'icon-xs': "size-7 rounded-md [&_svg:not([class*='size-'])]:size-3.5",
        'icon-sm': "size-9 rounded-md [&_svg:not([class*='size-'])]:size-4",
        'icon-lg': "size-12 rounded-xl [&_svg:not([class*='size-'])]:size-6",
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    /** Shows a spinner in place of the content (keeping the size) and blocks clicks, keeping focus. */
    loading?: boolean;
    /** Announced to screen readers while loading. */
    loadingLabel?: string;
  };

function Button({
  className,
  variant = 'default',
  size = 'default',
  loading = false,
  loadingLabel = 'Carregando…',
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      focusableWhenDisabled={loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <>
          <span className="invisible inline-flex items-center gap-[inherit]">{children}</span>
          <span role="status" className="absolute inset-0 flex items-center justify-center">
            <Spinner className="size-[18px]" aria-hidden />
            <span className="sr-only">{loadingLabel}</span>
          </span>
        </>
      ) : (
        children
      )}
    </ButtonPrimitive>
  );
}

export { Button, type ButtonProps, buttonVariants };
