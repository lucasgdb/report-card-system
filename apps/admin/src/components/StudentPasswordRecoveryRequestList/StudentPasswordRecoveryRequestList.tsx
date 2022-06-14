import { useMediaQuery } from '@mui/material';
import { GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { SimpleBadge, SimpleTable } from '@usefaz/components';
import { graphql, useFragment } from 'react-relay';
import styled from 'styled-components';

import MoreButton from './MoreButton';
import { StudentPasswordRecoveryRequestList_admin$key } from './__generated__/StudentPasswordRecoveryRequestList_admin.graphql';

const fragment = graphql`
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
`;

const OuterStudentPasswordRecoveryRequestList = styled.div``;

const Title = styled.h1`
  font: normal normal 700 22px/25px Lexend;
  margin: 0 0 24px;
  color: #333;
`;

const STATUS = {
  PENDING: 'Pendente',
  REFUSED: 'Recusado',
  CHANGED: 'Finalizado',
};

const STATUS_COLOR = {
  PENDING: '#808080',
  REFUSED: '#EF233C',
  CHANGED: '#1fc969',
};

type StudentPasswordRecoveryRequestListProps = {
  admin: StudentPasswordRecoveryRequestList_admin$key;
};

export default function StudentPasswordRecoveryRequestList({ admin }: StudentPasswordRecoveryRequestListProps) {
  const data = useFragment<StudentPasswordRecoveryRequestList_admin$key>(fragment, admin);

  const isDesktop = useMediaQuery('(min-width: 1200px)');

  const columns: GridColDef[] = [
    { field: 'RM', headerName: 'RM', width: 100 },
    { field: 'email', headerName: 'E-mail', width: 300 },
    { field: 'fullname', headerName: 'Nome', width: 250 },
    {
      field: 'status',
      headerName: 'Status',
      width: 125,
      renderCell(params) {
        return <SimpleBadge text={STATUS[params.value]} bgColor={STATUS_COLOR[params.value]} />;
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
      hide: !isDesktop,
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
        return <MoreButton params={params} disabled={params.row.status !== 'PENDING'} />;
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
    <OuterStudentPasswordRecoveryRequestList>
      <Title>Solicitações de recuperação de senha</Title>

      <SimpleTable rows={rows} columns={columns} />
    </OuterStudentPasswordRecoveryRequestList>
  );
}
