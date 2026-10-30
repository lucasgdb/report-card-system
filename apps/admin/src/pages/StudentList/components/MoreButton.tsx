import type { GridRenderCellParams } from '@usefaz/ui/components/data-table';
import { Button } from '@usefaz/ui/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@usefaz/ui/components/ui/dropdown-menu';
import { EllipsisVerticalIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { graphql, useFragment } from 'react-relay';

import EditStudentInformationDialog from './EditStudentInformationDialog';
import RemoveStudentDialog from './RemoveStudentDialog';
import type { MoreButton_admin$key } from './__generated__/MoreButton_admin.graphql';

type MoreButtonProps = {
  params: GridRenderCellParams;
  disabled?: boolean;
  admin: MoreButton_admin$key;
};

export default function MoreButton({ params, disabled = false, admin }: MoreButtonProps) {
  const data = useFragment<MoreButton_admin$key>(
    graphql`
      fragment MoreButton_admin on Admin {
        ...RemoveStudentDialog_admin
      }
    `,
    admin
  );

  const [isEditStudentInformationDialogOpen, setIsEditStudentInformationDialogOpen] = useState(false);
  const [isRemoveStudentDialogOpen, setIsRemoveStudentDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          disabled={disabled}
          render={<Button variant="ghost" size="icon" aria-label={`Mais ações para ${params.row.fullname}`} />}
        >
          <EllipsisVerticalIcon />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="min-w-48">
          <DropdownMenuItem onClick={() => setIsEditStudentInformationDialogOpen(true)}>
            <PencilIcon />
            Editar informações
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={() => setIsRemoveStudentDialogOpen(true)}>
            <Trash2Icon />
            Remover
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditStudentInformationDialog
        open={isEditStudentInformationDialogOpen}
        studentId={params.row.id}
        RM={params.row.RM}
        fullname={params.row.fullname}
        onClose={() => setIsEditStudentInformationDialogOpen(false)}
      />

      <RemoveStudentDialog
        open={isRemoveStudentDialogOpen}
        studentId={params.row.id}
        fullname={params.row.fullname}
        onClose={() => setIsRemoveStudentDialogOpen(false)}
        admin={data}
      />
    </>
  );
}
