import { handleMutationError } from '@usefaz/shared';
import { FormAlert } from '@usefaz/ui/components/form-alert';
import { PasswordInput } from '@usefaz/ui/components/password-input';
import { Button } from '@usefaz/ui/components/ui/button';
import { FieldError } from '@usefaz/ui/components/ui/field';
import { required, sameAs, useFormValidation } from '@usefaz/ui/hooks/use-form-validation';
import { useMutation } from 'react-relay';
import { useNavigate, useParams } from 'react-router';

import RecoverAdminPasswordMutation from '~/modules/admin/RecoverAdminPasswordMutation';
import type { RecoverAdminPasswordMutation as RecoverAdminPasswordMutationType } from '~/modules/admin/__generated__/RecoverAdminPasswordMutation.graphql';

export default function Form() {
  const navigate = useNavigate();
  const { requestId, token } = useParams<{ requestId: string; token: string }>();
  const form = useFormValidation({
    password: [required('Informe a nova senha.')],
    passwordConfirmation: [
      required('Confirme a nova senha.'),
      sameAs('password', 'As senhas não são iguais. Digite a mesma senha nos dois campos.'),
    ],
  });

  const [recoverPasswordMutation, loading] =
    useMutation<RecoverAdminPasswordMutationType>(RecoverAdminPasswordMutation);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const values = form.validate(event.currentTarget);
    if (!values) {
      return;
    }

    recoverPasswordMutation({
      variables: {
        input: {
          adminPasswordRecoveryRequestId: requestId,
          passwordRecoveryToken: token,
          password: values.password,
          passwordConfirmation: values.passwordConfirmation,
        },
      },
      onCompleted: ({ recoverAdminPassword }) => {
        if (handleMutationError(form, recoverAdminPassword?.error)) {
          return;
        }
        navigate('/solicitacao-finalizada', { replace: true });
      },
      onError: (error) => handleMutationError(form, error),
    });
  };

  return (
    <div className="mt-6">
      <form onSubmit={handleSubmit} noValidate>
        <FormAlert tone="inverse" message={form.formError} className="mb-4" />

        <div className="flex flex-col gap-2">
          <PasswordInput
            placeholder="Nova senha…"
            aria-label="Nova senha"
            autoComplete="new-password"
            {...form.fieldProps('password')}
          />
          <FieldError tone="inverse" {...form.errorProps('password')} />

          <PasswordInput
            placeholder="Repita a nova senha…"
            aria-label="Confirme a nova senha"
            autoComplete="new-password"
            {...form.fieldProps('passwordConfirmation')}
          />
          <FieldError tone="inverse" {...form.errorProps('passwordConfirmation')} />
        </div>

        <Button type="submit" size="lg" className="mt-6 w-full" loading={loading}>
          Redefinir senha
        </Button>
      </form>
    </div>
  );
}
