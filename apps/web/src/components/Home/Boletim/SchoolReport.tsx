import { useTable, Column } from 'react-table';
import { useMemo } from 'react';
import styled from 'styled-components';

import GradeBadge from './GradeBadge';
import AbsencesBadge from './AbsencesBadge';

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

  font: normal normal 400 14px/17px Inter;
  color: #808080;
`;

const TableRow = styled.tr``;

const TableBody = styled.tbody``;

const FirstRowColumn = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SubjectName = styled.p`
  font: normal normal 600 16px/20px Lexend;
  color: #494d4b;
  margin: 0;
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
        col1: (
          <FirstRowColumn>
            <img src="/assets/icons/portuguese_language.svg" />
            <SubjectName>
              Língua <br />
              Portuguesa
            </SubjectName>
          </FirstRowColumn>
        ),
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
        col10: <GradeBadge number={8} />,
        col11: <AbsencesBadge number={0} />,
      },
      {
        col1: (
          <FirstRowColumn>
            <img src="/assets/icons/math.svg" />
            <SubjectName>Matemática</SubjectName>
          </FirstRowColumn>
        ),
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
        col10: <GradeBadge number={6} />,
        col11: <AbsencesBadge number={11} />,
      },
      {
        col1: (
          <FirstRowColumn>
            <img src="/assets/icons/science.svg" />
            <SubjectName>Ciências</SubjectName>
          </FirstRowColumn>
        ),
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
        col10: <GradeBadge number={4} />,
        col11: <AbsencesBadge number={20} />,
      },
      {
        col1: (
          <FirstRowColumn>
            <img src="/assets/icons/history.svg" />
            <SubjectName>História</SubjectName>
          </FirstRowColumn>
        ),
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
        col10: <GradeBadge number={8} />,
        col11: <AbsencesBadge number={0} />,
      },
      {
        col1: (
          <FirstRowColumn>
            <img src="/assets/icons/geography.svg" />
            <SubjectName>Geografia</SubjectName>
          </FirstRowColumn>
        ),
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
        col10: <GradeBadge number={8} />,
        col11: <AbsencesBadge number={0} />,
      },
      {
        col1: (
          <FirstRowColumn>
            <img src="/assets/icons/art.svg" />
            <SubjectName>Artes</SubjectName>
          </FirstRowColumn>
        ),
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
        col10: <GradeBadge number={8} />,
        col11: <AbsencesBadge number={0} />,
      },
      {
        col1: (
          <FirstRowColumn>
            <img src="/assets/icons/physical_education.svg" />
            <SubjectName>Educação Física</SubjectName>
          </FirstRowColumn>
        ),
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
        col10: <GradeBadge number={8} />,
        col11: <AbsencesBadge number={0} />,
      },
      {
        col1: (
          <FirstRowColumn>
            <img src="/assets/icons/english.svg" />
            <SubjectName>Inglês</SubjectName>
          </FirstRowColumn>
        ),
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
        col10: <GradeBadge number={8} />,
        col11: <AbsencesBadge number={0} />,
      },
      {
        col1: (
          <FirstRowColumn>
            <img src="/assets/icons/computing.svg" />
            <SubjectName>Informática</SubjectName>
          </FirstRowColumn>
        ),
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
        col10: <GradeBadge number={8} />,
        col11: <AbsencesBadge number={0} />,
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
