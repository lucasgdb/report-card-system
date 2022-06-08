import styled, { css } from 'styled-components';

const FirstRowColumn = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SubjectIcon = styled.img`
  width: 24px;

  @media (max-width: 599px) {
    display: none;
  }

  transition: filter 0.2s;

  ${(props) =>
    props.theme.palette.mode === 'dark' &&
    css`
      filter: invert(50%);
    `};
`;

const SubjectName = styled.p`
  font: normal normal 600 16px/20px Lexend;
  color: ${(props) => props.theme.text.main};

  transition: color 0.2s;
  margin: 0;
`;

type SubjectProps = {
  icon: string;
  name: React.ReactChild | string;
};

export default function Subject({ icon, name }: SubjectProps) {
  return (
    <FirstRowColumn>
      <SubjectIcon src={`/assets/icons/${icon}.svg`} />
      <SubjectName>{name}</SubjectName>
    </FirstRowColumn>
  );
}
