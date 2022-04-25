import styled from 'styled-components';

type OuterGradeBadgeProps = {
  number: number;
};

const OuterGradeBadge = styled.div<OuterGradeBadgeProps>`
  border-radius: 4px;

  width: 48px;

  padding: 2px 0;

  background-color: ${({ number }) => {
    if (number >= 7) {
      return '#22E575';
    }

    if (number >= 5) {
      return '#F9C74F';
    }

    return '#EF233C';
  }};
`;

const Text = styled.p`
  font: normal normal 600 18px/22px Inter;
  color: #fff;
  margin: 0;
  text-align: center;
`;

type GradeBadgeProps = {
  number: number;
};

export default function GradeBadge({ number }: GradeBadgeProps) {
  return (
    <OuterGradeBadge number={number}>
      <Text>{number.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}</Text>
    </OuterGradeBadge>
  );
}
