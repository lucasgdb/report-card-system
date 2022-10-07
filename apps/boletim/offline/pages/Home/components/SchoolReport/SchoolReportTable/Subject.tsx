import styled from 'styled-components';

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
