import { handleMutationError } from '@usefaz/shared';
import { FormAlert } from '@usefaz/ui/components/form-alert';
import { Button } from '@usefaz/ui/components/ui/button';
import { FieldError } from '@usefaz/ui/components/ui/field';
import { required, useFormValidation } from '@usefaz/ui/hooks/use-form-validation';
import { useMutation } from 'react-relay';
import { useNavigate } from 'react-router';

import SendAdminRecoveryEmailMutation from '~/modules/admin/SendAdminRecoveryEmailMutation';
import type { SendAdminRecoveryEmailMutation as SendAdminRecoveryEmailMutationType } from '~/modules/admin/__generated__/SendAdminRecoveryEmailMutation.graphql';
import EmailInput from '~/components/EmailInput';

export default function Form() {
  const navigate = useNavigate();
  const form = useFormValidation({
    email: [required('Informe o e-mail da sua conta.')],
  });

  const [sendAdminRecoveryEmailMutation, loading] =
    useMutation<SendAdminRecoveryEmailMutationType>(SendAdminRecoveryEmailMutation);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const values = form.validate(event.currentTarget);
    if (!values) {
      return;
    }

    sendAdminRecoveryEmailMutation({
      variables: {
        input: { email: values.email },
      },
      onCompleted: ({ sendAdminRecoveryEmail }) => {
        if (handleMutationError(form, sendAdminRecoveryEmail?.error)) {
          return;
        }
        navigate('/solicitacao-enviada');
      },
      onError: (error) => handleMutationError(form, error),
    });
  };

  return (
    <div className="mt-6">
      <form onSubmit={handleSubmit} noValidate>
        <FormAlert tone="inverse" message={form.formError} className="mb-4" />

        <div className="flex flex-col gap-2">
          <EmailInput {...form.fieldProps('email')} />
          <FieldError tone="inverse" {...form.errorProps('email')} />
        </div>

        <Button type="submit" size="lg" className="mt-6 w-full" loading={loading}>
          Enviar link de recuperação
        </Button>
      </form>
    </div>
  );
}
