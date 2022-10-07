import styled from 'styled-components';

const Grade = styled.p`
  margin: 0;
`;

type GradesProps = {
  grade?: number;
  rec?: number;
};

const formatGrade = (grade: number | undefined) =>
  grade?.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 });

export default function Grades({ grade, rec }: GradesProps) {
  return (
    <>
      <Grade>Nota: {formatGrade(grade) ?? '-'}</Grade>
      <Grade>Rec: {formatGrade(rec) ?? '-'}</Grade>
    </>
  );
}
