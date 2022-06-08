import { PageLoader } from '@usefaz/components';
import styled from 'styled-components';
import { graphql, useQuery } from 'relay-hooks';
import { useEffect } from 'react';

import { StudentPasswordRecoveryListPageQuery } from './__generated__/StudentPasswordRecoveryListPageQuery.graphql';
import LogoutButton from '~/components/Home/LogoutButton';

const query = graphql`
  query StudentPasswordRecoveryListPageQuery {
    admin {
      studentPasswordRecoveries {
        edges {
          node {
            id
            status
          }
        }
      }
    }
  }
`;

const OuterStudentPasswordRecoveryListPage = styled.div`
  padding: 8px 24px;
`;

const AdminIDText = styled.p`
  font: normal normal normal 16px/19px Lexend;
  margin: 0 0 8px;
`;

export default function StudentPasswordRecoveryListPage() {
  const { data, isLoading } = useQuery<StudentPasswordRecoveryListPageQuery>(query);

  useEffect(() => {
    document.title = 'Solicitações de Recuperação de Senha | Usefaz Admin';
  }, []);

  if (isLoading) {
    return <PageLoader />;
  }

  console.log(data);

  return (
    <OuterStudentPasswordRecoveryListPage>
      <LogoutButton />
    </OuterStudentPasswordRecoveryListPage>
  );
}
