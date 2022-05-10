import { useTable, Column } from 'react-table';
import { useMemo } from 'react';
import styled from 'styled-components';

import FinalAverageBadge from './FinalAverageBadge';
import TotalAbsencesBadge from './TotalAbsencesBadge';
import Subject from './Subject';
import Grades from './Grades';

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
  font: normal normal 400 14px/17px Inter;
  color: ${(props) => props.theme.text.main};

  transition: color 0.2s;
  border-top: 1px solid #e6e8eb;
  border-bottom: 1px solid #e6e8eb;
  padding: 12px;
`;

const TableRow = styled.tr`
  ${TableHeader}:first-child, ${TableData}:first-child {
    position: sticky;
    left: 0;
    z-index: 1;
    background-color: ${(props) => props.theme.bg.main};
    transition: background-color 0.2s;
  }
`;

const COLUMNS: Column[] = [
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
];

export default function SchoolReport() {
  const columns: Column[] = useMemo(() => COLUMNS, []);

  const data = useMemo(
    () => [
      {
        subject: <Subject icon="portuguese_language" name="Língua Portuguesa" />,
        firstBimester: <Grades grade={8} />,
        firstBimesterAbsences: '0',
        secondBimester: <Grades grade={8} />,
        secondBimesterAbsences: '0',
        thirdBimester: <Grades grade={8} />,
        thirdBimesterAbsences: '0',
        fourthBimester: <Grades grade={8} />,
        fourthBimesterAbsences: '0',
        finalAverage: <FinalAverageBadge number={8} />,
        totalAbsences: <TotalAbsencesBadge number={0} />,
      },
      {
        subject: <Subject icon="math" name="Matemática" />,
        firstBimester: <Grades grade={8} />,
        firstBimesterAbsences: '3',
        secondBimester: <Grades grade={6} />,
        secondBimesterAbsences: '5',
        thirdBimester: <Grades grade={6} />,
        thirdBimesterAbsences: '3',
        fourthBimester: <Grades grade={6} />,
        fourthBimesterAbsences: '0',
        finalAverage: <FinalAverageBadge number={6.5} />,
        totalAbsences: <TotalAbsencesBadge number={11} />,
      },
      {
        subject: <Subject icon="science" name="Ciências" />,
        firstBimester: <Grades grade={4} />,
        firstBimesterAbsences: '5',
        secondBimester: <Grades grade={4} />,
        secondBimesterAbsences: '5',
        thirdBimester: <Grades grade={4} />,
        thirdBimesterAbsences: '5',
        fourthBimester: <Grades grade={4} />,
        fourthBimesterAbsences: '5',
        finalAverage: <FinalAverageBadge number={4} />,
        totalAbsences: <TotalAbsencesBadge number={20} />,
      },
      {
        subject: <Subject icon="history" name="História" />,
        firstBimester: <Grades grade={8} />,
        firstBimesterAbsences: '0',
        secondBimester: <Grades grade={8} />,
        secondBimesterAbsences: '0',
        thirdBimester: <Grades grade={8} />,
        thirdBimesterAbsences: '0',
        fourthBimester: <Grades grade={8} />,
        fourthBimesterAbsences: '0',
        finalAverage: <FinalAverageBadge number={8} />,
        totalAbsences: <TotalAbsencesBadge number={0} />,
      },
      {
        subject: <Subject icon="geography" name="Geografia" />,
        firstBimester: <Grades grade={8} />,
        firstBimesterAbsences: '0',
        secondBimester: <Grades grade={8} />,
        secondBimesterAbsences: '0',
        thirdBimester: <Grades grade={8} />,
        thirdBimesterAbsences: '0',
        fourthBimester: <Grades grade={8} />,
        fourthBimesterAbsences: '0',
        finalAverage: <FinalAverageBadge number={8} />,
        totalAbsences: <TotalAbsencesBadge number={0} />,
      },
      {
        subject: <Subject icon="art" name="Artes" />,
        firstBimester: <Grades grade={8} />,
        firstBimesterAbsences: '0',
        secondBimester: <Grades grade={8} />,
        secondBimesterAbsences: '0',
        thirdBimester: <Grades grade={8} />,
        thirdBimesterAbsences: '0',
        fourthBimester: <Grades grade={8} />,
        fourthBimesterAbsences: '0',
        finalAverage: <FinalAverageBadge number={8} />,
        totalAbsences: <TotalAbsencesBadge number={0} />,
      },
      {
        subject: <Subject icon="physical_education" name={'Educação Física'} />,
        firstBimester: <Grades grade={8} />,
        firstBimesterAbsences: '0',
        secondBimester: <Grades grade={8} />,
        secondBimesterAbsences: '0',
        thirdBimester: <Grades grade={8} />,
        thirdBimesterAbsences: '0',
        fourthBimester: <Grades grade={8} />,
        fourthBimesterAbsences: '0',
        finalAverage: <FinalAverageBadge number={8} />,
        totalAbsences: <TotalAbsencesBadge number={0} />,
      },
      {
        subject: <Subject icon="english" name="Inglês" />,
        firstBimester: <Grades grade={8} />,
        firstBimesterAbsences: '0',
        secondBimester: <Grades grade={8} />,
        secondBimesterAbsences: '0',
        thirdBimester: <Grades grade={8} />,
        thirdBimesterAbsences: '0',
        fourthBimester: <Grades grade={8} />,
        fourthBimesterAbsences: '0',
        finalAverage: <FinalAverageBadge number={8} />,
        totalAbsences: <TotalAbsencesBadge number={0} />,
      },
      {
        subject: <Subject icon="computing" name="Informática" />,
        firstBimester: <Grades grade={8} />,
        firstBimesterAbsences: '0',
        secondBimester: <Grades grade={8} />,
        secondBimesterAbsences: '0',
        thirdBimester: <Grades grade={8} />,
        thirdBimesterAbsences: '0',
        fourthBimester: <Grades grade={8} />,
        fourthBimesterAbsences: '0',
        finalAverage: <FinalAverageBadge number={8} />,
        totalAbsences: <TotalAbsencesBadge number={0} />,
      },
      {
        subject: <Subject icon="philosophy_and_ethics" name="Filosofia e Ética" />,
        firstBimester: <Grades grade={8} />,
        firstBimesterAbsences: '0',
        secondBimester: <Grades grade={8} />,
        secondBimesterAbsences: '0',
        thirdBimester: <Grades grade={8} />,
        thirdBimesterAbsences: '0',
        fourthBimester: <Grades grade={8} />,
        fourthBimesterAbsences: '0',
        finalAverage: <FinalAverageBadge number={8} />,
        totalAbsences: <TotalAbsencesBadge number={0} />,
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

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
