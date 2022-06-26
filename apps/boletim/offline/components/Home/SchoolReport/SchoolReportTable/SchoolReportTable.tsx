import { useTable, Column } from 'react-table';
import { useMemo } from 'react';
import styled from 'styled-components';

import FinalAverageBadge from './FinalAverageBadge';
import TotalAbsencesBadge from './TotalAbsencesBadge';
import Subject from './Subject';
import Grades from './Grades';
import getSchoolReport from '../../../../utils/getSchoolReport';

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
  color: #808080;

  border-top: 1px solid #e6e8eb;
  border-bottom: 1px solid #e6e8eb;
  padding: 12px;
`;

const TableRow = styled.tr`
  ${TableHeader}:first-child, ${TableData}:first-child {
    position: sticky;
    left: 0;
    z-index: 1;
    background-color: #fafafa;
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

const ICONS_SUBJECT = {
  'Língua Portuguesa': 'portuguese_language',
  Matemática: 'math',
  Ciências: 'science',
  História: 'history',
  Geografia: 'geography',
  Artes: 'art',
  'Educação Física': 'physical_education',
  Inglês: 'english',
  Espanhol: 'english',
  Informática: 'computing',
  'Filosofia e Ética': 'philosophy_and_ethics',
};

export default function SchoolReportTable() {
  const columns: Column[] = useMemo(() => COLUMNS, []);

  const data = useMemo(() => {
    const schoolReport = getSchoolReport();

    return schoolReport.map((schoolReportRow) => {
      const {
        disciplineName,
        firstBimesterGrade,
        secondBimesterGrade,
        thirdBimesterGrade,
        fourthBimesterGrade,
        firstBimesterAbsences,
        secondBimesterAbsences,
        thirdBimesterAbsences,
        fourthBimesterAbsences,
      } = schoolReportRow;

      const finalAverage: number =
        (firstBimesterGrade + secondBimesterGrade + thirdBimesterGrade + fourthBimesterGrade) / 4;

      const totalAbsences: number =
        firstBimesterAbsences + secondBimesterAbsences + thirdBimesterAbsences + fourthBimesterAbsences;

      return {
        subject: <Subject icon={ICONS_SUBJECT[disciplineName]} name={disciplineName} />,
        firstBimester: <Grades grade={firstBimesterGrade} />,
        firstBimesterAbsences,
        secondBimester: <Grades grade={secondBimesterGrade} />,
        secondBimesterAbsences,
        thirdBimester: <Grades grade={thirdBimesterGrade} />,
        thirdBimesterAbsences,
        fourthBimester: <Grades grade={fourthBimesterGrade} />,
        fourthBimesterAbsences,
        finalAverage: <FinalAverageBadge number={finalAverage} />,
        totalAbsences: <TotalAbsencesBadge number={totalAbsences} />,
      };
    });
  }, []);

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
