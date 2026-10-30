import { cn } from '@usefaz/ui/lib/utils';

type BrandTitleProps = {
  children: string;
  className?: string;
};

/**
 * Brand display text of the auth pages ("Aluno,", "Esqueceu sua senha?"): orange letters over a light
 * outline offset down-right. Real text instead of an image, so it costs bytes rather than hundreds of
 * KB, scales, wraps and is read by screen readers. Place it inside the heading it belongs to.
 */
export function BrandTitle({ children, className }: BrandTitleProps) {
  return (
    <span
      data-slot="brand-title"
      className={cn('relative block font-heading text-5xl leading-[1.05] font-bold tracking-tight', className)}
    >
      <span
        aria-hidden
        className="absolute inset-0 translate-x-[3px] translate-y-[3px] text-transparent [-webkit-text-stroke:1.5px_#fafafa] select-none"
      >
        {children}
      </span>
      <span className="relative text-primary">{children}</span>
    </span>
  );
}
