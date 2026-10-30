import { useRef, useState } from 'react';

import { toast } from '@usefaz/ui/components/ui/sonner';

/** Checks one field: returns the message to show, or nothing when the value is valid. */
export type Rule<Values> = (value: string, values: Values) => string | undefined;

type Schema<Name extends string> = Record<Name, Rule<Record<Name, string>>[]>;

type Options = {
  /**
   * Where errors about the whole form appear: `alert` (default) keeps them in the form, rendered with
   * `<FormAlert message={form.formError} />`; `toast` shows them as a toast instead.
   */
  formErrors?: 'alert' | 'toast';
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** The field must be filled in. */
export const required =
  (message: string): Rule<unknown> =>
  (value) =>
    value ? undefined : message;

/** When filled in, the field must look like an e-mail address. */
export const email =
  (message: string): Rule<unknown> =>
  (value) =>
    !value || EMAIL_PATTERN.test(value) ? undefined : message;

/** The field must repeat another one (e.g. a password confirmation). */
export const sameAs =
  <Name extends string>(field: Name, message: string): Rule<Record<Name, string>> =>
  (value, values) =>
    value === values[field] ? undefined : message;

/**
 * Errors of an uncontrolled form, from both sides:
 *
 * - validation: each field lists its rules in order and shows the first failing one. On submit,
 *   `validate(form)` reads the fields, shows the messages, focuses the first invalid field and returns
 *   the values (trimmed, except passwords) or `null`;
 * - the server: the returned object is a `MutationErrorTarget`, so `handleMutationError(form, error)`
 *   from `@usefaz/shared` puts a mutation's `error { field, userMessage }` on that field (`setError`) or
 *   on the whole form (`setFormError`).
 *
 * Wire each input with `fieldProps(name)`, its message with `<FieldError {...errorProps(name)} />` and
 * the form's own errors with `<FormAlert message={formError} />`. Fields whose value is only read can be
 * listed with no rules. Field names match the mutation's input fields, which is what the server reports.
 */
export function useFormValidation<Name extends string>(schema: Schema<Name>, { formErrors = 'alert' }: Options = {}) {
  const [errors, setErrors] = useState<Partial<Record<Name, string>>>({});
  const [formError, setFormErrorState] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const names = Object.keys(schema) as Name[];

  const focusField = (name: Name) => (formRef.current?.elements.namedItem(name) as HTMLElement | null)?.focus();

  const validate = (form: HTMLFormElement) => {
    formRef.current = form;
    setFormErrorState(null);

    const formData = new FormData(form);
    const values = {} as Record<Name, string>;

    for (const name of names) {
      const raw = formData.get(name)?.toString() ?? '';
      const input = form.elements.namedItem(name);
      values[name] = input instanceof HTMLInputElement && input.type === 'password' ? raw : raw.trim();
    }

    const nextErrors: Partial<Record<Name, string>> = {};
    for (const name of names) {
      for (const rule of schema[name]) {
        const message = rule(values[name], values);
        if (message) {
          nextErrors[name] = message;
          break;
        }
      }
    }

    setErrors(nextErrors);

    const firstInvalid = names.find((name) => nextErrors[name]);
    if (firstInvalid) {
      focusField(firstInvalid);
      return null;
    }

    return values;
  };

  /** Shows a server error on `field`; returns false when the form has no such field. */
  const setError = (field: string, message: string) => {
    if (!names.includes(field as Name)) {
      return false;
    }
    setErrors((current) => ({ ...current, [field]: message }));
    focusField(field as Name);
    return true;
  };

  /** Shows an error about the whole form. */
  const setFormError = (message: string) => {
    if (formErrors === 'toast') {
      toast.error(message);
      return;
    }
    setFormErrorState(message);
  };

  const errorId = (name: Name) => `${name}-error`;

  /** Props for the input named `name`: invalid state, link to its message, and clearing it on change. */
  const fieldProps = (name: Name) => ({
    name,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? errorId(name) : undefined,
    onChange: () => setErrors((current) => (current[name] ? { ...current, [name]: undefined } : current)),
  });

  /** Props for the FieldError of `name`. */
  const errorProps = (name: Name) => ({ id: errorId(name), children: errors[name] });

  return { errors, formError, validate, setError, setFormError, fieldProps, errorProps };
}
