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

const TableRow = styled.tr`
  ${TableHeader}:first-child,${TableData}:first-child {
    position: sticky;
    left: 0;
    z-index: 1;
    background-color: #fafafa;
  }
`;

const FirstRowColumn = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SubjectIcon = styled.img`
  @media (max-width: 599px) {
    display: none;
  }
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
        accessor: 'subject',
      },
      {
        Header: '1° Bimestre',
        accessor: 'firstBimester',
      },
      {
        Header: 'Faltas',
        accessor: 'firstBimesterAbsences',
      },
      {
        Header: '2° Bimestre',
        accessor: 'secondBimester',
      },
      {
        Header: 'Faltas',
        accessor: 'secondBimesterAbsences',
      },
      {
        Header: '3° Bimestre',
        accessor: 'thirdBimester',
      },
      {
        Header: 'Faltas',
        accessor: 'thirdBimesterAbsences',
      },
      {
        Header: '4° Bimestre',
        accessor: 'fourthBimester',
      },
      {
        Header: 'Faltas',
        accessor: 'fourthBimesterAbsences',
      },
      {
        Header: 'Média final',
        accessor: 'finalAverage',
      },
      {
        Header: 'Total de faltas',
        accessor: 'totalAbsences',
      },
    ],
    []
  );

  const data = useMemo(
    () => [
      {
        subject: (
          <FirstRowColumn>
            <SubjectIcon src="/assets/icons/portuguese_language.svg" />
            <SubjectName>
              Língua <br />
              Portuguesa
            </SubjectName>
          </FirstRowColumn>
        ),
        firstBimester: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        firstBimesterAbsences: '0',
        secondBimester: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        secondBimesterAbsences: '0',
        thirdBimester: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        thirdBimesterAbsences: '0',
        fourthBimester: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        fourthBimesterAbsences: '0',
        finalAverage: <GradeBadge number={8} />,
        totalAbsences: <AbsencesBadge number={0} />,
      },
      {
        subject: (
          <FirstRowColumn>
            <SubjectIcon src="/assets/icons/math.svg" />
            <SubjectName>Matemática</SubjectName>
          </FirstRowColumn>
        ),
        firstBimester: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        firstBimesterAbsences: '0',
        secondBimester: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        secondBimesterAbsences: '0',
        thirdBimester: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        thirdBimesterAbsences: '0',
        fourthBimester: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        fourthBimesterAbsences: '0',
        finalAverage: <GradeBadge number={6} />,
        totalAbsences: <AbsencesBadge number={11} />,
      },
      {
        subject: (
          <FirstRowColumn>
            <SubjectIcon src="/assets/icons/science.svg" />
            <SubjectName>Ciências</SubjectName>
          </FirstRowColumn>
        ),
        firstBimester: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        firstBimesterAbsences: '0',
        secondBimester: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        secondBimesterAbsences: '0',
        thirdBimester: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        thirdBimesterAbsences: '0',
        fourthBimester: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        fourthBimesterAbsences: '0',
        finalAverage: <GradeBadge number={4} />,
        totalAbsences: <AbsencesBadge number={20} />,
      },
      {
        subject: (
          <FirstRowColumn>
            <SubjectIcon src="/assets/icons/history.svg" />
            <SubjectName>História</SubjectName>
          </FirstRowColumn>
        ),
        firstBimester: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        firstBimesterAbsences: '0',
        secondBimester: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        secondBimesterAbsences: '0',
        thirdBimester: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        thirdBimesterAbsences: '0',
        fourthBimester: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        fourthBimesterAbsences: '0',
        finalAverage: <GradeBadge number={8} />,
        totalAbsences: <AbsencesBadge number={0} />,
      },
      {
        subject: (
          <FirstRowColumn>
            <SubjectIcon src="/assets/icons/geography.svg" />
            <SubjectName>Geografia</SubjectName>
          </FirstRowColumn>
        ),
        firstBimester: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        firstBimesterAbsences: '0',
        secondBimester: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        secondBimesterAbsences: '0',
        thirdBimester: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        thirdBimesterAbsences: '0',
        fourthBimester: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        fourthBimesterAbsences: '0',
        finalAverage: <GradeBadge number={8} />,
        totalAbsences: <AbsencesBadge number={0} />,
      },
      {
        subject: (
          <FirstRowColumn>
            <SubjectIcon src="/assets/icons/art.svg" />
            <SubjectName>Artes</SubjectName>
          </FirstRowColumn>
        ),
        firstBimester: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        firstBimesterAbsences: '0',
        secondBimester: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        secondBimesterAbsences: '0',
        thirdBimester: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        thirdBimesterAbsences: '0',
        fourthBimester: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        fourthBimesterAbsences: '0',
        finalAverage: <GradeBadge number={8} />,
        totalAbsences: <AbsencesBadge number={0} />,
      },
      {
        subject: (
          <FirstRowColumn>
            <SubjectIcon src="/assets/icons/physical_education.svg" />
            <SubjectName>
              Educação
              <br />
              Física
            </SubjectName>
          </FirstRowColumn>
        ),
        firstBimester: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        firstBimesterAbsences: '0',
        secondBimester: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        secondBimesterAbsences: '0',
        thirdBimester: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        thirdBimesterAbsences: '0',
        fourthBimester: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        fourthBimesterAbsences: '0',
        finalAverage: <GradeBadge number={8} />,
        totalAbsences: <AbsencesBadge number={0} />,
      },
      {
        subject: (
          <FirstRowColumn>
            <SubjectIcon src="/assets/icons/english.svg" />
            <SubjectName>Inglês</SubjectName>
          </FirstRowColumn>
        ),
        firstBimester: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        firstBimesterAbsences: '0',
        secondBimester: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        secondBimesterAbsences: '0',
        thirdBimester: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        thirdBimesterAbsences: '0',
        fourthBimester: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        fourthBimesterAbsences: '0',
        finalAverage: <GradeBadge number={8} />,
        totalAbsences: <AbsencesBadge number={0} />,
      },
      {
        subject: (
          <FirstRowColumn>
            <SubjectIcon src="/assets/icons/computing.svg" />
            <SubjectName>Informática</SubjectName>
          </FirstRowColumn>
        ),
        firstBimester: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        firstBimesterAbsences: '0',
        secondBimester: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        secondBimesterAbsences: '0',
        thirdBimester: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        thirdBimesterAbsences: '0',
        fourthBimester: (
          <span>
            Nota: 8,0
            <br />
            Rec: -
          </span>
        ),
        fourthBimesterAbsences: '0',
        finalAverage: <GradeBadge number={8} />,
        totalAbsences: <AbsencesBadge number={0} />,
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

      <tbody {...getTableBodyProps()}>
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
      </tbody>
    </Table>
  );
}
