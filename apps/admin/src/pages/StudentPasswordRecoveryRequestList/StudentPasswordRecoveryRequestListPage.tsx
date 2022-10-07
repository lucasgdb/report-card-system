import styled from 'styled-components';
import { graphql, useQuery } from 'relay-hooks';
import { useEffect } from 'react';

import { StudentPasswordRecoveryRequestListPageQuery } from './__generated__/StudentPasswordRecoveryRequestListPageQuery.graphql';
import StudentPasswordRecoveryRequestList from './components/StudentPasswordRecoveryRequestList';
import PageLoader from '~/components/PageLoader';

const Title = styled.h1`
  font: normal normal 700 22px/25px Lexend;
  margin: 0;
  color: #333;
`;

const OuterStudentPasswordRecoveryRequestListPage = styled.div`
  padding: 24px 32px;
  width: 100%;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export default function StudentPasswordRecoveryRequestListPage() {
  const { data, isLoading } = useQuery<StudentPasswordRecoveryRequestListPageQuery>(graphql`
    query StudentPasswordRecoveryRequestListPageQuery {
      admin {
        ...StudentPasswordRecoveryRequestList_admin
      }
    }
  `);

  useEffect(() => {
    document.title = 'Solicitações de Recuperação de Senha | Usefaz Admin';
  }, []);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <OuterStudentPasswordRecoveryRequestListPage>
      <Title>Solicitações de recuperação de senha</Title>

      <StudentPasswordRecoveryRequestList admin={data.admin} />
    </OuterStudentPasswordRecoveryRequestListPage>
  );
}
