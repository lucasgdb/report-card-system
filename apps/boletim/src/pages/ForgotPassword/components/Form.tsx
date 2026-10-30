import { handleMutationError } from '@usefaz/shared';
import { FormAlert } from '@usefaz/ui/components/form-alert';
import { RMInput } from '@usefaz/ui/components/rm-input';
import { Button } from '@usefaz/ui/components/ui/button';
import { FieldError } from '@usefaz/ui/components/ui/field';
import { email, required, useFormValidation } from '@usefaz/ui/hooks/use-form-validation';
import { useNavigate } from 'react-router';
import { useMutation } from 'react-relay';

import SendStudentPasswordRecoveryRequestMutation from '~/modules/student/SendStudentPasswordRecoveryRequestMutation';
import type { SendStudentPasswordRecoveryRequestMutation as SendStudentPasswordRecoveryRequestMutationType } from '~/modules/student/__generated__/SendStudentPasswordRecoveryRequestMutation.graphql';
import EmailInput from './EmailInput';

export default function Form() {
  const navigate = useNavigate();

  const [sendStudentPasswordRecoveryRequestMutation, loading] =
    useMutation<SendStudentPasswordRecoveryRequestMutationType>(SendStudentPasswordRecoveryRequestMutation);

  const form = useFormValidation({
    RM: [required('Informe seu número de matrícula.')],
    email: [required('Informe seu e-mail.'), email('Digite um e-mail válido, como nome@exemplo.com.')],
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const values = form.validate(event.currentTarget);
    if (!values) {
      return;
    }

    sendStudentPasswordRecoveryRequestMutation({
      variables: {
        input: values,
      },
      onCompleted: ({ sendStudentPasswordRecoveryRequest }) => {
        if (handleMutationError(form, sendStudentPasswordRecoveryRequest?.error)) {
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
          <div className="flex flex-col gap-1">
            <RMInput {...form.fieldProps('RM')} />
            <FieldError tone="inverse" {...form.errorProps('RM')} />
          </div>

          <div className="flex flex-col gap-1">
            <EmailInput {...form.fieldProps('email')} />
            <FieldError tone="inverse" {...form.errorProps('email')} />
          </div>
        </div>

        <Button size="lg" type="submit" loading={loading} className="mt-6 w-full">
          Enviar solicitação
        </Button>
      </form>
    </div>
  );
}
