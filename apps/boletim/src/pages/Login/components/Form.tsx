import { handleMutationError } from '@usefaz/shared';
import { getRecaptchaToken, jwtToken, preloadRecaptcha } from '@usefaz/shared/browser';
import { FormAlert } from '@usefaz/ui/components/form-alert';
import { PasswordInput } from '@usefaz/ui/components/password-input';
import { RMInput } from '@usefaz/ui/components/rm-input';
import { Button } from '@usefaz/ui/components/ui/button';
import { FieldError } from '@usefaz/ui/components/ui/field';
import { required, useFormValidation } from '@usefaz/ui/hooks/use-form-validation';
import { useState } from 'react';
import { useMutation } from 'react-relay';
import { Link } from 'react-router';

import StudentLoginMutation from '~/modules/student/StudentLoginMutation';
import type { StudentLoginMutation as StudentLoginMutationType } from '~/modules/student/__generated__/StudentLoginMutation.graphql';
import { readStorage, writeStorage } from '~/utils/storage';
import RememberMeCheckbox from './RememberMeCheckbox';

const REMEMBERED_RM_KEY = 'Usefaz-RM';

const RECAPTCHA_ERROR = 'Não foi possível verificar seu acesso. Recarregue a página e tente novamente.';

export default function Form() {
  const [rememberedRM] = useState(() => readStorage(REMEMBERED_RM_KEY) ?? undefined);
  const [loadingRecaptcha, setLoadingRecaptcha] = useState(false);

  const [loginMutation, loading] = useMutation<StudentLoginMutationType>(StudentLoginMutation);

  const form = useFormValidation({
    RM: [required('Informe seu número de matrícula.')],
    password: [required('Informe sua senha.')],
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formElement = event.currentTarget;
    const values = form.validate(formElement);
    if (!values) {
      return;
    }

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
        input: { RM: values.RM, password: values.password, token },
      },
      onCompleted: ({ studentLogin }) => {
        if (handleMutationError(form, studentLogin?.error) || !studentLogin?.jwtToken) {
          setLoadingRecaptcha(false);
          return;
        }

        writeStorage(REMEMBERED_RM_KEY, rememberMe ? values.RM : null);
        jwtToken.set(studentLogin.jwtToken);
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
      {/* reCAPTCHA is only needed to submit: start loading it once the student reaches the form. */}
      <form onSubmit={handleSubmit} onFocus={preloadRecaptcha} onPointerEnter={preloadRecaptcha} noValidate>
        <FormAlert tone="inverse" message={form.formError} className="mb-4" />

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <RMInput defaultValue={rememberedRM} {...form.fieldProps('RM')} />
            <FieldError tone="inverse" {...form.errorProps('RM')} />
          </div>

          <div className="flex flex-col gap-1">
            <PasswordInput {...form.fieldProps('password')} />
            <FieldError tone="inverse" {...form.errorProps('password')} />
          </div>
        </div>

        <div className="flex items-center justify-between py-6">
          <RememberMeCheckbox />
          <Link
            className="rounded-sm text-[#f7f5fa] no-underline outline-none hover:underline focus-visible:ring-3 focus-visible:ring-white/60"
            to="/esqueci-minha-senha"
          >
            Esqueci minha senha
          </Link>
        </div>

        <Button size="lg" type="submit" loading={loading || loadingRecaptcha} className="w-full">
          Entrar
        </Button>
      </form>
    </div>
  );
}
