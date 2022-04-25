import { useTable, Column } from 'react-table';
import { useMemo } from 'react';
import styled from 'styled-components';

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
`;

const TableHeader = styled.th`
  text-align: left;
  font: normal normal 500 12px/15px Lexend;
  color: #aba8b3;
  text-transform: uppercase;

  padding: 12px;

  white-space: nowrap;
`;

const TableData = styled.td`
  border-top: 1px solid #e6e8eb;
  border-bottom: 1px solid #e6e8eb;
  padding: 12px;
`;

const TableRow = styled.tr``;

const TableBody = styled.tbody`
  ${TableRow} ${TableData}:first-child {
    font: normal normal 600 16px/20px Lexend;
    color: #494d4b;
    white-space: nowrap;
  }

  ${TableRow} ${TableData}:not(:first-child) {
    font: normal normal 400 14px/17px Inter;
    color: #808080;
  }
`;

export default function SchoolReport() {
  const columns: Column[] = useMemo(
    () => [
      {
        Header: 'Disciplina',
        accessor: 'col1',
      },
      {
        Header: '1° Bimestre',
        accessor: 'col2',
      },
      {
        Header: 'Faltas',
        accessor: 'col3',
      },
      {
        Header: '2° Bimestre',
        accessor: 'col4',
      },
      {
        Header: 'Faltas',
        accessor: 'col5',
      },
      {
        Header: '3° Bimestre',
        accessor: 'col6',
      },
      {
        Header: 'Faltas',
        accessor: 'col7',
      },
      {
        Header: '4° Bimestre',
        accessor: 'col8',
      },
      {
        Header: 'Faltas',
        accessor: 'col9',
      },
      {
        Header: 'Média final',
        accessor: 'col10',
      },
      {
        Header: 'Total de faltas',
        accessor: 'col11',
      },
    ],
    []
  );

  const data = useMemo(
    () => [
      {
        col1: 'Língua Portuguesa',
        col2: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        col3: '0',
        col4: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        col5: '0',
        col6: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        col7: '0',
        col8: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        col9: '0',
        col10: '8,0',
        col11: '0',
      },
      {
        col1: 'Matemática',
        col2: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        col3: '0',
        col4: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        col5: '0',
        col6: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        col7: '0',
        col8: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        col9: '0',
        col10: '8,0',
        col11: '0',
      },
      {
        col1: 'Ciências',
        col2: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        col3: '0',
        col4: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        col5: '0',
        col6: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        col7: '0',
        col8: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        col9: '0',
        col10: '8,0',
        col11: '0',
      },
      {
        col1: 'História',
        col2: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        col3: '0',
        col4: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        col5: '0',
        col6: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        col7: '0',
        col8: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        col9: '0',
        col10: '8,0',
        col11: '0',
      },
      {
        col1: 'Geografia',
        col2: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        col3: '0',
        col4: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        col5: '0',
        col6: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        col7: '0',
        col8: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        col9: '0',
        col10: '8,0',
        col11: '0',
      },
      {
        col1: 'Arte',
        col2: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        col3: '0',
        col4: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        col5: '0',
        col6: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        col7: '0',
        col8: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        col9: '0',
        col10: '8,0',
        col11: '0',
      },
      {
        col1: 'Educação Física',
        col2: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        col3: '0',
        col4: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        col5: '0',
        col6: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        col7: '0',
        col8: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        col9: '0',
        col10: '8,0',
        col11: '0',
      },
      {
        col1: 'Inglês',
        col2: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        col3: '0',
        col4: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        col5: '0',
        col6: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        col7: '0',
        col8: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        col9: '0',
        col10: '8,0',
        col11: '0',
      },
      {
        col1: 'Informática',
        col2: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        col3: '0',
        col4: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        col5: '0',
        col6: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        col7: '0',
        col8: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        col9: '0',
        col10: '8,0',
        col11: '0',
      },
    ],
    []
  );

  const tableInstance = useTable({ columns, data });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  return (
    <Table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <TableRow key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <TableHeader key={column.id} {...column.getHeaderProps()}>
                {column.render('Header')}
              </TableHeader>
            ))}
          </TableRow>
        ))}
      </thead>

      <TableBody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <TableRow key={row.id} {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return (
                  <TableData key={cell.column.id} {...cell.getCellProps()}>
                    {cell.render('Cell')}
                  </TableData>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
