import { useMediaQuery } from '@mui/material';
import { GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { SimpleTable } from '@usefaz/components';
import { graphql, useFragment } from 'react-relay';
import styled from 'styled-components';

import MoreButton from './MoreButton';
import { StudentList_admin$key } from './__generated__/StudentList_admin.graphql';

const OuterStudentList = styled.div`
  height: calc(100% - 48px);
`;

type StudentListProps = {
  admin: StudentList_admin$key;
};

export default function StudentList({ admin }: StudentListProps) {
  const data = useFragment<StudentList_admin$key>(
    graphql`
      fragment StudentList_admin on Admin {
        students(first: 100) @connection(key: "StudentList_students") {
          edges {
            node {
              id
              RM
              fullname
            }
          }
        }
      }
    `,
    admin
  );

  const isDesktop = useMediaQuery('(min-width: 1200px)');

  const columns: GridColDef[] = [
    { field: 'RM', headerName: 'RM', width: 100 },
    { field: 'fullname', headerName: 'Nome', width: 250 },
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
        return <MoreButton params={params} />;
      },
    },
  ];

  const rows: GridRowsProp = data.students.edges.map(({ node: student }) => ({
    id: student.id,
    RM: student.RM,
    fullname: student.fullname,
  }));

  return (
    <OuterStudentList>
      <SimpleTable rows={rows} columns={columns} autoHeight={false} />
    </OuterStudentList>
  );
}
