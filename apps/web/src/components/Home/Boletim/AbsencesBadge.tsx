import styled from 'styled-components';

type OuterBadgeProps = {
  number: number;
};

const OuterAbsencesBadge = styled.div<OuterBadgeProps>`
  border-radius: 4px;

  width: 48px;

  padding: 2px 0;

  background-color: ${({ number }) => {
    if (number >= 18) {
      return '#EF233C';
    }

    if (number >= 11) {
      return '#F9C74F';
    }

    return '#22E575';
  }};
`;

const Text = styled.p`
  font: normal normal 600 18px/22px Inter;
  color: #fff;
  margin: 0;
  text-align: center;
`;

type AbsencesBadgeProps = {
  number: number;
};

export default function AbsencesBadge({ number }: AbsencesBadgeProps) {
  return (
    <OuterAbsencesBadge number={number}>
      <Text>{number.toLocaleString('pt-BR')}</Text>
    </OuterAbsencesBadge>
  );
}
