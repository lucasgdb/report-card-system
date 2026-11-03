import { handleMutationError } from '@usefaz/shared';
import { FormAlert } from '@usefaz/ui/components/form-alert';
import { PasswordInput } from '@usefaz/ui/components/password-input';
import { Button } from '@usefaz/ui/components/ui/button';
import { FieldError } from '@usefaz/ui/components/ui/field';
import { minLength, required, sameAs, useFormValidation } from '@usefaz/ui/hooks/use-form-validation';
import { useMutation } from 'react-relay';
import { useNavigate, useParams } from 'react-router';

import ResetStudentPasswordMutation from '~/modules/student/ResetStudentPasswordMutation';
import type { ResetStudentPasswordMutation as ResetStudentPasswordMutationType } from '~/modules/student/__generated__/ResetStudentPasswordMutation.graphql';

export default function Form() {
  const navigate = useNavigate();
  const { requestId = '', token = '' } = useParams<{ requestId: string; token: string }>();
  const form = useFormValidation({
    password: [required('Informe a nova senha.'), minLength(8, 'A senha precisa ter pelo menos 8 caracteres.')],
    passwordConfirmation: [
      required('Confirme a nova senha.'),
      sameAs('password', 'As senhas não são iguais. Digite a mesma senha nos dois campos.'),
    ],
  });

  const [resetPassword, loading] = useMutation<ResetStudentPasswordMutationType>(ResetStudentPasswordMutation);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const values = form.validate(event.currentTarget);
    if (!values) {
      return;
    }

    resetPassword({
      variables: {
        input: {
          studentPasswordRecoveryRequestId: requestId,
          passwordRecoveryToken: token,
          password: values.password,
          passwordConfirmation: values.passwordConfirmation,
        },
      },
      onCompleted: ({ resetStudentPassword }) => {
        if (handleMutationError(form, resetStudentPassword?.error)) {
          return;
        }
        navigate('/senha-redefinida', { replace: true });
      },
      onError: (error) => handleMutationError(form, error),
    });
  };

  return (
    <div className="mt-6">
      <form onSubmit={handleSubmit} noValidate>
        <FormAlert tone="inverse" message={form.formError} className="mb-4" />

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <PasswordInput
              placeholder="Nova senha…"
              aria-label="Nova senha"
              autoComplete="new-password"
              {...form.fieldProps('password')}
            />
            <FieldError tone="inverse" {...form.errorProps('password')} />
          </div>

          <div className="flex flex-col gap-1">
            <PasswordInput
              placeholder="Repita a nova senha…"
              aria-label="Confirme a nova senha"
              autoComplete="new-password"
              {...form.fieldProps('passwordConfirmation')}
            />
            <FieldError tone="inverse" {...form.errorProps('passwordConfirmation')} />
          </div>
        </div>

        <Button size="lg" type="submit" loading={loading} className="mt-6 w-full">
          Salvar nova senha
        </Button>
      </form>
    </div>
  );
}
