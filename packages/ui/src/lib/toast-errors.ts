import { toast } from '@usefaz/ui/components/ui/sonner';

/**
 * Error target for mutations outside forms (menus, confirmations, logout): every message becomes a
 * toast. Use it with `handleMutationError(toastErrors, error)` from `@usefaz/shared`.
 */
export const toastErrors = {
  setError: () => false,
  setFormError: (message: string) => {
    toast.error(message);
  },
};
