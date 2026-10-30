import { handleMutationError } from '@usefaz/shared';
import { FormAlert } from '@usefaz/ui/components/form-alert';
import { PasswordInput } from '@usefaz/ui/components/password-input';
import { RMInput } from '@usefaz/ui/components/rm-input';
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
import { toast } from '@usefaz/ui/components/ui/sonner';
import { required, useFormValidation } from '@usefaz/ui/hooks/use-form-validation';
import { useMutation } from 'react-relay';

import ChangeStudentInformationMutation from '~/modules/admin/ChangeStudentInformationMutation';
import type { ChangeStudentInformationMutation as ChangeStudentInformationMutationType } from '~/modules/admin/__generated__/ChangeStudentInformationMutation.graphql';
import NameInput from './NameInput';

type EditStudentInformationDialogProps = {
  open: boolean;
  studentId: string;
  RM: string;
  fullname: string;
  onClose(): void;
};

export default function EditStudentInformationDialog({
  open,
  studentId,
  RM,
  fullname,
  onClose,
}: EditStudentInformationDialogProps) {
  const [changeStudentInformation, loading] = useMutation<ChangeStudentInformationMutationType>(
    ChangeStudentInformationMutation
  );
  const form = useFormValidation({
    RM: [required('Informe o número de matrícula.')],
    fullname: [required('Informe o nome completo.')],
    // Optional: left blank, the password stays the same.
    password: [],
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const values = form.validate(event.currentTarget);
    if (!values) {
      return;
    }

    changeStudentInformation({
      variables: { input: { studentId, ...values } },
      onCompleted: ({ changeStudentInformation }) => {
        if (handleMutationError(form, changeStudentInformation?.error)) {
          return;
        }
        onClose();
        toast.success('Dados alterados com sucesso.');
      },
      onError: (error) => handleMutationError(form, error),
    });
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
          <DialogHeader>
            <DialogTitle>Alterar informações</DialogTitle>
            <DialogDescription>Deixe a senha em branco para mantê-la.</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3">
            <RMInput defaultValue={RM} autoComplete="off" aria-label="Número de matrícula" {...form.fieldProps('RM')} />
            <FieldError {...form.errorProps('RM')} />

            <NameInput defaultValue={fullname} aria-label="Nome completo" {...form.fieldProps('fullname')} />
            <FieldError {...form.errorProps('fullname')} />

            <PasswordInput
              autoComplete="new-password"
              placeholder="Nova senha (opcional)…"
              aria-label="Nova senha"
              {...form.fieldProps('password')}
            />
          </div>

          <FormAlert message={form.formError} />

          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancelar</DialogClose>
            <Button type="submit" loading={loading}>
              Salvar alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
