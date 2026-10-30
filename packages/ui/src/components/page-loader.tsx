import { Spinner } from '@usefaz/ui/components/ui/spinner';
import { cn } from '@usefaz/ui/lib/utils';

/** Full-height centered spinner, shown while a page loads. */
export function PageLoader({ className }: { className?: string }) {
  return (
    <div
      data-slot="page-loader"
      className={cn('flex h-screen w-full items-center justify-center text-primary', className)}
    >
      <Spinner className="size-10" />
    </div>
  );
}
