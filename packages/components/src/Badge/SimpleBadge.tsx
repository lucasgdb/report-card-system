import styled from 'styled-components';

type OuterSimpleBadgeProps = {
  $bgColor: string;
};

const OuterSimpleBadge = styled.div<OuterSimpleBadgeProps>`
  padding: 4px 8px;
  border-radius: 8px;
  background-color: ${({ $bgColor }) => $bgColor};
  flex: 1;
`;

const Text = styled.p`
  font: normal normal normal 16px/19px Lexend;
  color: #fff;
  text-align: center;
  margin: 0;
`;

type SimpleBadgeProps = {
  text: string;
  bgColor: string;
};

export default function SimpleBadge({ text, bgColor }: SimpleBadgeProps) {
  return (
    <OuterSimpleBadge $bgColor={bgColor}>
      <Text>{text}</Text>
    </OuterSimpleBadge>
  );
}
