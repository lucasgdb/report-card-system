import { Badge } from '@usefaz/ui/components/ui/badge';

export type StatusTone = 'neutral' | 'info' | 'warning' | 'success' | 'destructive';

const VARIANTS = {
  neutral: 'outline',
  info: 'info',
  warning: 'warning',
  success: 'success',
  destructive: 'destructive',
} as const;

/** The status of a row (a request, an order…): a soft pill in the status color. */
export function StatusBadge({ tone, children }: { tone: StatusTone; children: React.ReactNode }) {
  return (
    <Badge variant={VARIANTS[tone]} size="md" data-tone={tone}>
      {children}
    </Badge>
  );
}
