import { CircleAlertIcon } from 'lucide-react';

import { Alert, AlertDescription } from '@usefaz/ui/components/ui/alert';
import { cn } from '@usefaz/ui/lib/utils';

type FormAlertProps = {
  /** The form-level error (`form.formError`); renders nothing without one. */
  message?: string | null;
  /** `inverse`: on dark/brand backgrounds (e.g. the login over the blue panel). */
  tone?: 'default' | 'inverse';
  className?: string;
};

/**
 * Error about the whole form rather than one field (wrong credentials, expired link, server down).
 * Announced by screen readers as it appears (`role="alert"`). Field errors use `FieldError` instead.
 */
export function FormAlert({ message, tone = 'default', className }: FormAlertProps) {
  if (!message) {
    return null;
  }

  return (
    <Alert
      variant="destructive"
      data-tone={tone}
      className={cn(
        tone === 'inverse' &&
          'border-[#ffd2d2]/40 bg-[#ffd2d2]/10 text-[#ffd2d2] *:data-[slot=alert-description]:text-[#ffd2d2]',
        className
      )}
    >
      <CircleAlertIcon aria-hidden />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
