import { handleMutationError } from '@usefaz/shared';
import { FormAlert } from '@usefaz/ui/components/form-alert';
import { toast } from '@usefaz/ui/components/ui/sonner';
import { PasswordInput } from '@usefaz/ui/components/password-input';
import { Button } from '@usefaz/ui/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@usefaz/ui/components/ui/dialog';
import { FieldError } from '@usefaz/ui/components/ui/field';
import { required, useFormValidation } from '@usefaz/ui/hooks/use-form-validation';
import { useMutation } from 'react-relay';

import ChangeStudentPasswordMutation from '~/modules/admin/ChangeStudentPasswordMutation';
import type { ChangeStudentPasswordMutation as ChangeStudentPasswordMutationType } from '~/modules/admin/__generated__/ChangeStudentPasswordMutation.graphql';

type EditPasswordDialogProps = {
  open: boolean;
  studentPasswordRecoveryRequestId: string;
  onClose(): void;
};

export default function EditPasswordDialog({
  open,
  studentPasswordRecoveryRequestId,
  onClose,
}: EditPasswordDialogProps) {
  const [changeStudentPassword, loading] =
    useMutation<ChangeStudentPasswordMutationType>(ChangeStudentPasswordMutation);
  const form = useFormValidation({
    newPassword: [required('Digite a nova senha do aluno.')],
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const values = form.validate(event.currentTarget);
    if (!values) {
      return;
    }

    changeStudentPassword({
      variables: { input: { newPassword: values.newPassword, studentPasswordRecoveryRequestId } },
      onCompleted: ({ changeStudentPassword }) => {
        if (handleMutationError(form, changeStudentPassword?.error)) {
          return;
        }
        onClose();
        toast.success('Senha alterada com sucesso.');
      },
      onError: (error) => handleMutationError(form, error),
    });
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
          <DialogHeader>
            <DialogTitle>Alterar senha</DialogTitle>
            <DialogDescription>Defina a nova senha do aluno.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-2">
            <PasswordInput
              placeholder="Nova senha…"
              autoComplete="new-password"
              aria-label="Nova senha"
              {...form.fieldProps('newPassword')}
            />
            <FieldError {...form.errorProps('newPassword')} />
          </div>

          <FormAlert message={form.formError} />

          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancelar</DialogClose>
            <Button type="submit" loading={loading}>
              Salvar nova senha
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
