import { DataTable, type GridColDef, type GridRowsProp } from '@usefaz/ui/components/data-table';
import { useMediaQuery } from '@usefaz/ui/hooks/use-media-query';
import { graphql, useFragment } from 'react-relay';

import MoreButton from './MoreButton';
import type { StudentList_admin$key } from './__generated__/StudentList_admin.graphql';

type StudentListProps = {
  admin: StudentList_admin$key;
};

export default function StudentList({ admin }: StudentListProps) {
  const data = useFragment<StudentList_admin$key>(
    graphql`
      fragment StudentList_admin on Admin {
        ...MoreButton_admin

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

  const isTablet = useMediaQuery('(min-width: 768px)');

  const columns: GridColDef[] = [
    { field: 'RM', cellClassName: 'tabular-nums', headerName: 'RM', width: 100 },
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
        return <MoreButton params={params} admin={data} />;
      },
    },
  ];

  const rows: GridRowsProp = data.students.edges.map(({ node: student }) => ({
    id: student.id,
    RM: student.RM,
    fullname: student.fullname,
  }));

  return (
    <div className="flex flex-1 flex-col">
      <DataTable rows={rows} columns={columns} columnVisibilityModel={{ blank: isTablet }} autoHeight={false} />
    </div>
  );
}
