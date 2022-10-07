import styled from 'styled-components';
import { graphql, useFragment } from 'relay-hooks';

import { Information_student$key } from './__generated__/Information_student.graphql';

const OuterProfileInformation = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;

  @media (max-width: 863px) {
    padding: 0 24px;
    margin-top: 8px;
  }
`;

const RMText = styled.p`
  font: normal normal 700 24px/28px Lexend;
  color: #fafafa;

  margin: 0;

  @media (min-width: 864px) {
    font: normal normal 700 32px/40px Lexend;
  }
`;

const FullnameText = styled.p`
  font: normal normal 700 24px/28px Lexend;
  color: #fafafa;

  text-transform: uppercase;
  margin: 0;

  @media (min-width: 864px) {
    font: normal normal 700 32px/40px Lexend;
  }
`;

const Status = styled.div`
  padding: 11px 0;
  width: 250px;

  transition: background-color 0.2s;
  background-color: ${(props) => props.theme.bg.success};
  border-radius: 4px;
`;

const StatusText = styled.p`
  font: normal normal 700 24px/30px Lexend;
  color: #fafafa;
  margin: 0;
  text-align: center;

  text-transform: uppercase;
`;

const Year = styled.p`
  font: normal normal normal 16px/19px Lexend;
  color: #e6e8eb;
  margin: 0;
`;

type InformationProps = {
  student: Information_student$key;
};

export default function Information({ student }: InformationProps) {
  const data = useFragment<Information_student$key>(
    graphql`
      fragment Information_student on Student {
        RM
        fullname

        schoolReport {
          year

          schoolReportRows {
            count
            edges {
              node {
                id
              }
            }
          }
        }
      }
    `,
    student
  );

  return (
    <OuterProfileInformation>
      <RMText>RM: {data.RM}</RMText>
      <FullnameText>NOME: {data.fullname}</FullnameText>

      {data.schoolReport?.year && <Year>Ano: {data.schoolReport.year}</Year>}

      {data.schoolReport?.schoolReportRows?.count > 0 && (
        <Status>
          <StatusText>APROVADO</StatusText>
        </Status>
      )}
    </OuterProfileInformation>
  );
}
