import { DataTable, type GridColDef, type GridRowsProp } from '@usefaz/ui/components/data-table';
import { PageHeader } from '@usefaz/ui/components/page-header';
import { StatusBadge, type StatusTone } from '@usefaz/ui/components/status-badge';
import { ToggleGroup, ToggleGroupItem } from '@usefaz/ui/components/ui/toggle-group';
import { useMediaQuery } from '@usefaz/ui/hooks/use-media-query';
import { useState } from 'react';
import { graphql, useFragment } from 'react-relay';

import MoreButton from './MoreButton';
import type { StudentPasswordRecoveryRequestList_admin$key } from './__generated__/StudentPasswordRecoveryRequestList_admin.graphql';

type Status = 'PENDING' | 'LINK_SENT' | 'CHANGED' | 'REFUSED';
type Filter = Status | 'ALL';

const STATUS: Record<Status, { label: string; tone: StatusTone }> = {
  PENDING: { label: 'Pendente', tone: 'warning' },
  LINK_SENT: { label: 'Link enviado', tone: 'info' },
  CHANGED: { label: 'Concluído', tone: 'success' },
  REFUSED: { label: 'Recusado', tone: 'destructive' },
};

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'ALL', label: 'Todos' },
  { value: 'PENDING', label: 'Pendentes' },
  { value: 'LINK_SENT', label: 'Link enviado' },
  { value: 'CHANGED', label: 'Concluídos' },
  { value: 'REFUSED', label: 'Recusados' },
];

const requestedAt = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

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
              createdAt

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

  // Phones keep the essentials: who, status and the actions.
  const isTablet = useMediaQuery('(min-width: 768px)');

  const requests = (data.studentPasswordRecoveryRequests?.edges ?? []).map(({ node }) => node);
  const pending = requests.filter((request) => request.status === 'PENDING').length;
  // Start where there's work to do.
  const [filter, setFilter] = useState<Filter>(pending > 0 ? 'PENDING' : 'ALL');

  const countOf = (value: Filter) =>
    value === 'ALL' ? requests.length : requests.filter((request) => request.status === value).length;

  const columns: GridColDef[] = [
    {
      field: 'student',
      headerName: 'Aluno',
      flex: 1,
      width: 180,
      renderCell: ({ row }) => (
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-medium text-foreground">{row.fullname}</span>
          <span className="text-xs text-muted-foreground tabular-nums">RM {row.RM}</span>
        </div>
      ),
    },
    { field: 'email', headerName: 'E-mail', width: 280, cellClassName: 'text-muted-foreground' },
    {
      field: 'createdAt',
      headerName: 'Pedido em',
      width: 170,
      cellClassName: 'tabular-nums text-muted-foreground',
      renderCell: ({ value }) => <time dateTime={value}>{requestedAt.format(new Date(value))}</time>,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 160,
      renderCell: ({ value }) => {
        const status = STATUS[value as Status];
        return <StatusBadge tone={status?.tone ?? 'neutral'}>{status?.label ?? value}</StatusBadge>;
      },
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 88,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      renderCell(params) {
        return <MoreButton params={params} disabled={params.row.status === 'CHANGED'} />;
      },
    },
  ];

  const rows: GridRowsProp = requests
    .filter((request) => filter === 'ALL' || request.status === filter)
    .map((request) => ({
      id: request.id,
      RM: request.RM,
      email: request.email,
      // The student may have been removed since the request.
      fullname: request.student?.fullname ?? 'Aluno removido',
      createdAt: request.createdAt,
      status: request.status,
    }));

  return (
    <>
      <PageHeader
        title="Recuperação de senha"
        description="Pedidos de alunos que esqueceram a senha. Envie um link para o aluno criar uma nova ou recuse o pedido."
      />

      <ToggleGroup
        aria-label="Filtrar por status"
        value={[filter]}
        onValueChange={(value) => value[0] && setFilter(value[0] as Filter)}
        className="max-w-full flex-nowrap self-start overflow-x-auto"
      >
        {FILTERS.map(({ value, label }) => (
          <ToggleGroupItem key={value} value={value}>
            {label}
            <span className="text-xs tabular-nums opacity-70">{countOf(value)}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <DataTable
        rows={rows}
        columns={columns}
        columnVisibilityModel={{ email: isTablet, createdAt: isTablet }}
        emptyMessage={
          filter === 'ALL' ? 'Nenhum pedido de recuperação de senha ainda.' : 'Nenhum pedido com esse status.'
        }
      />
    </>
  );
}
