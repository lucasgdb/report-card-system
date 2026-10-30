import { Spinner } from '@usefaz/ui/components/ui/spinner';
import { cn } from '@usefaz/ui/lib/utils';
import { ImageOffIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

type ImageWithLoaderProps = React.ComponentProps<'img'> & {
  /** Classes for the wrapper, which keeps the image's box while it loads (no layout shift). */
  containerClassName?: string;
};

type LoadState = 'loading' | 'loaded' | 'error';

/**
 * `<img>` that shows a spinner while it loads (again whenever `src` changes) and an icon if it fails.
 * The state is exposed as `data-state` on the wrapper.
 */
export function ImageWithLoader({
  src,
  alt,
  className,
  containerClassName,
  onLoad,
  onError,
  ...props
}: ImageWithLoaderProps) {
  const [state, setState] = useState<LoadState>('loading');

  useEffect(() => {
    setState('loading');
  }, [src]);

  return (
    <span
      data-slot="image-with-loader"
      data-state={state}
      className={cn('relative inline-flex size-full items-center justify-center', containerClassName)}
    >
      {state === 'loading' && <Spinner className="absolute size-10 text-primary" />}
      {state === 'error' && <ImageOffIcon aria-hidden className="absolute size-8 text-muted-foreground" />}
      <img
        src={src}
        alt={alt}
        className={cn('transition-opacity duration-200', state === 'loaded' ? 'opacity-100' : 'opacity-0', className)}
        onLoad={(event) => {
          setState('loaded');
          onLoad?.(event);
        }}
        onError={(event) => {
          setState('error');
          onError?.(event);
        }}
        {...props}
      />
    </span>
  );
}
