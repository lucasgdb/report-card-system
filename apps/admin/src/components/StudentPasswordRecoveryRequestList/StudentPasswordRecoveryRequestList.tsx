import { makeStyles } from '@mui/styles';
import { DataGrid, GridRowsProp, GridColDef, ptBR } from '@mui/x-data-grid';
import { graphql, useFragment } from 'react-relay';
import styled from 'styled-components';

import MoreButton from './MoreButton';
import { StudentPasswordRecoveryRequestList_admin$key } from './__generated__/StudentPasswordRecoveryRequestList_admin.graphql';

const fragment = graphql`
  fragment StudentPasswordRecoveryRequestList_admin on Admin {
    studentPasswordRecoveryRequests(first: 25)
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

const useStyles = makeStyles({
  root: {
    '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus, &.MuiDataGrid-root .MuiDataGrid-cell:focus': {
      outline: 'none',
    },
  },
});

const STATUS = {
  PENDING: 'Pendente',
  REFUSED: 'Recusado',
  CHANGED: 'Finalizado',
};

const columns: GridColDef[] = [
  { field: 'col1', headerName: 'RM', width: 100 },
  { field: 'col2', headerName: 'E-mail', width: 300 },
  { field: 'col3', headerName: 'Nome', width: 250 },
  { field: 'col4', headerName: 'Status', width: 125 },
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
    field: 'col5',
    headerName: 'Ações',
    width: 100,
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    filterable: false,
    hideable: false,
    disableColumnMenu: true,
    renderCell: (params) => {
      return <MoreButton params={params} disabled={params.row.col4 !== 'Pendente'} />;
    },
  },
];

type StudentPasswordRecoveryRequestListProps = {
  admin: StudentPasswordRecoveryRequestList_admin$key;
};

export default function StudentPasswordRecoveryRequestList({ admin }: StudentPasswordRecoveryRequestListProps) {
  const classes = useStyles();

  const data = useFragment<StudentPasswordRecoveryRequestList_admin$key>(fragment, admin);

  const rows: GridRowsProp = data.studentPasswordRecoveryRequests.edges.map(
    ({ node: studentPasswordRecoveryRequest }) => ({
      id: studentPasswordRecoveryRequest.id,
      col1: studentPasswordRecoveryRequest.RM,
      col2: studentPasswordRecoveryRequest.email,
      col3: studentPasswordRecoveryRequest.student.fullname,
      col4: STATUS[studentPasswordRecoveryRequest.status],
    })
  );

  return (
    <OuterStudentPasswordRecoveryRequestList>
      <Title>Solicitações de recuperação de senha</Title>

      <DataGrid
        rows={rows}
        columns={columns}
        localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
        classes={{ root: classes.root }}
        pageSize={25}
        autoHeight
        disableSelectionOnClick
      />
    </OuterStudentPasswordRecoveryRequestList>
  );
}
