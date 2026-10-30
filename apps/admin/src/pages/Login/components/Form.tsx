import { handleMutationError } from '@usefaz/shared';
import { getRecaptchaToken, jwtToken, preloadRecaptcha } from '@usefaz/shared/browser';
import { FormAlert } from '@usefaz/ui/components/form-alert';
import { PasswordInput } from '@usefaz/ui/components/password-input';
import { Button } from '@usefaz/ui/components/ui/button';
import { FieldError } from '@usefaz/ui/components/ui/field';
import { required, useFormValidation } from '@usefaz/ui/hooks/use-form-validation';
import { useState } from 'react';
import { useMutation } from 'react-relay';
import { Link } from 'react-router';

import AdminLoginMutation from '~/modules/admin/AdminLoginMutation';
import type { AdminLoginMutation as AdminLoginMutationType } from '~/modules/admin/__generated__/AdminLoginMutation.graphql';
import EmailInput from '~/components/EmailInput';
import RememberMeCheckbox from './RememberMeCheckbox';

const REMEMBERED_EMAIL_KEY = 'Usefaz-Email';

// Storage can be blocked (private mode, policies): remembering the e-mail is just a convenience.
const readRememberedEmail = () => {
  try {
    return localStorage.getItem(REMEMBERED_EMAIL_KEY) ?? undefined;
  } catch {
    return undefined;
  }
};

const rememberEmail = (email: string | null) => {
  try {
    if (email) {
      localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
    } else {
      localStorage.removeItem(REMEMBERED_EMAIL_KEY);
    }
  } catch {
    // Ignored, see readRememberedEmail.
  }
};

const RECAPTCHA_ERROR = 'Não foi possível verificar seu acesso. Recarregue a página e tente novamente.';

export default function Form() {
  const form = useFormValidation({
    email: [required('Informe seu e-mail.')],
    password: [required('Informe sua senha.')],
  });

  const [rememberedEmail] = useState(readRememberedEmail);
  const [loadingRecaptcha, setLoadingRecaptcha] = useState(false);

  const [loginMutation, loading] = useMutation<AdminLoginMutationType>(AdminLoginMutation);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formElement = event.currentTarget;
    const values = form.validate(formElement);
    if (!values) {
      return;
    }

    const { email, password } = values;
    const rememberMe = Boolean(new FormData(formElement).get('rememberMe'));

    setLoadingRecaptcha(true);

    let token: string;
    try {
      token = await getRecaptchaToken('login');
    } catch {
      setLoadingRecaptcha(false);
      form.setFormError(RECAPTCHA_ERROR);
      return;
    }

    loginMutation({
      variables: {
        input: { email, password, token },
      },
      onCompleted: ({ adminLogin }) => {
        if (handleMutationError(form, adminLogin?.error) || !adminLogin?.jwtToken) {
          setLoadingRecaptcha(false);
          return;
        }

        rememberEmail(rememberMe ? email : null);
        jwtToken.set(adminLogin.jwtToken);
        window.location.reload();
      },
      onError: (error) => {
        setLoadingRecaptcha(false);
        handleMutationError(form, error);
      },
    });
  };

  return (
    <div className="mt-[42px]">
      {/* reCAPTCHA is only needed to submit: start loading it once the admin reaches the form. */}
      <form onSubmit={handleSubmit} onFocus={preloadRecaptcha} onPointerEnter={preloadRecaptcha} noValidate>
        <FormAlert tone="inverse" message={form.formError} className="mb-4" />

        <div className="flex flex-col gap-2">
          <EmailInput autoComplete="username" defaultValue={rememberedEmail} {...form.fieldProps('email')} />
          <FieldError tone="inverse" {...form.errorProps('email')} />

          <PasswordInput aria-label="Senha" {...form.fieldProps('password')} />
          <FieldError tone="inverse" {...form.errorProps('password')} />
        </div>

        <div className="flex items-center justify-between py-6">
          <RememberMeCheckbox />
          <Link
            to="/esqueci-minha-senha"
            className="rounded-sm text-[#f7f5fa] no-underline outline-none hover:underline focus-visible:ring-3 focus-visible:ring-white/60"
          >
            Esqueci minha senha
          </Link>
        </div>

        <Button type="submit" size="lg" className="w-full" loading={loading || loadingRecaptcha}>
          Entrar
        </Button>
      </form>
    </div>
  );
}
