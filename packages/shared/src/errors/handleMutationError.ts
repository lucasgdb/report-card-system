/** `error { field userMessage }` selected from a mutation payload (see `MutationError` in the schema). */
export type MutationError = {
  readonly field?: string | null;
  readonly userMessage: string;
};

/**
 * Where mutation errors show up: a form (`useFormValidation` from `@usefaz/ui`) or, outside forms,
 * `toastErrors` (also from `@usefaz/ui`).
 */
export type MutationErrorTarget = {
  /** Shows `message` on `field`; returns false when there's no such field, so the error goes global. */
  setError(field: string, message: string): boolean;
  /** Shows `message` for the whole operation (the form's alert, or a toast). */
  setFormError(message: string): void;
};

export const UNEXPECTED_ERROR_MESSAGE = 'Não foi possível concluir agora. Verifique sua conexão e tente novamente.';

const isMutationError = (error: unknown): error is MutationError =>
  typeof error === 'object' && error !== null && 'userMessage' in error;

/**
 * The single way to handle a mutation's errors — use it in both callbacks:
 *
 * ```ts
 * commit({
 *   variables,
 *   onCompleted: ({ login }) => {
 *     if (handleMutationError(form, login?.error)) return;
 *     // success
 *   },
 *   onError: (error) => handleMutationError(form, error),
 * });
 * ```
 *
 * - `error { field, userMessage }` (an expected failure, e.g. RM already taken) goes to that field, or
 *   to the whole form when it has no field (or the form doesn't have that field);
 * - anything else (network down, server crash) shows a generic message for the whole form.
 *
 * Returns true when there was an error.
 */
export function handleMutationError(
  target: MutationErrorTarget,
  error: MutationError | Error | readonly Error[] | null | undefined
): boolean {
  if (!error) {
    return false;
  }

  if (isMutationError(error)) {
    if (!error.field || !target.setError(error.field, error.userMessage)) {
      target.setFormError(error.userMessage);
    }
    return true;
  }

  target.setFormError(UNEXPECTED_ERROR_MESSAGE);
  return true;
}
