import { DataTable, type GridColDef, type GridRowsProp } from '@usefaz/ui/components/data-table';
import { Badge } from '@usefaz/ui/components/ui/badge';
import { useMediaQuery } from '@usefaz/ui/hooks/use-media-query';
import { graphql, useFragment } from 'react-relay';

import MoreButton from './MoreButton';
import type { StudentPasswordRecoveryRequestList_admin$key } from './__generated__/StudentPasswordRecoveryRequestList_admin.graphql';

const STATUS: Record<string, string> = {
  PENDING: 'Pendente',
  REFUSED: 'Recusado',
  CHANGED: 'Finalizado',
};

const STATUS_VARIANT: Record<string, 'secondary' | 'destructive' | 'success'> = {
  PENDING: 'secondary',
  REFUSED: 'destructive',
  CHANGED: 'success',
};

type StudentPasswordRecoveryRequestListProps = {
  admin: StudentPasswordRecoveryRequestList_admin$key;
};

export default function StudentPasswordRecoveryRequestList({ admin }: StudentPasswordRecoveryRequestListProps) {
  const data = useFragment<StudentPasswordRecoveryRequestList_admin$key>(
    graphql`
      fragment StudentPasswordRecoveryRequestList_admin on Admin {
        studentPasswordRecoveryRequests(first: 100)
          @connection(key: "StudentPasswordRecoveryRequestList_studentPasswordRecoveryRequests") {
          edges {
            node {
              id
              RM
              email
              status

              student {
                fullname
              }
            }
          }
        }
      }
    `,
    admin
  );

  const isDesktop = useMediaQuery('(min-width: 1200px)');

  const columns: GridColDef[] = [
    { field: 'RM', cellClassName: 'tabular-nums', headerName: 'RM', width: 100 },
    { field: 'email', headerName: 'E-mail', width: 300 },
    { field: 'fullname', headerName: 'Nome', width: 250 },
    {
      field: 'status',
      headerName: 'Status',
      width: 125,
      renderCell(params) {
        return (
          <Badge variant={STATUS_VARIANT[params.value] ?? 'outline'}>{STATUS[params.value] ?? 'Desconhecido'}</Badge>
        );
      },
    },
    {
      field: 'blank',
      headerName: '',
      disableColumnMenu: true,
      sortable: false,
      filterable: false,
      editable: false,
      hideable: false,
      flex: 1,
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 100,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      filterable: false,
      hideable: false,
      disableColumnMenu: true,
      renderCell(params) {
        return <MoreButton params={params} disabled={params.row.status === 'CHANGED'} />;
      },
    },
  ];

  const rows: GridRowsProp = data.studentPasswordRecoveryRequests.edges.map(
    ({ node: studentPasswordRecoveryRequest }) => ({
      id: studentPasswordRecoveryRequest.id,
      RM: studentPasswordRecoveryRequest.RM,
      email: studentPasswordRecoveryRequest.email,
      fullname: studentPasswordRecoveryRequest.student.fullname,
      status: studentPasswordRecoveryRequest.status,
    })
  );

  return (
    <div className="flex flex-1 flex-col">
      <DataTable rows={rows} columns={columns} columnVisibilityModel={{ blank: isDesktop }} autoHeight={false} />
    </div>
  );
}
