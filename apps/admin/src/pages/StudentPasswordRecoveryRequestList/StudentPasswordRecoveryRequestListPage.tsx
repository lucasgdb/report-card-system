import { PageLoader } from '@usefaz/components';
import styled from 'styled-components';
import { graphql, useQuery } from 'relay-hooks';
import { useEffect } from 'react';

import { StudentPasswordRecoveryRequestListPageQuery } from './__generated__/StudentPasswordRecoveryRequestListPageQuery.graphql';
import StudentPasswordRecoveryRequestList from '~/components/StudentPasswordRecoveryRequestList/StudentPasswordRecoveryRequestList';

const query = graphql`
  query StudentPasswordRecoveryRequestListPageQuery {
    admin {
      ...StudentPasswordRecoveryRequestList_admin
    }
  }
`;

const OuterStudentPasswordRecoveryRequestListPage = styled.div`
  padding: 24px 32px;
  width: 100%;
  box-sizing: border-box;
`;

export default function StudentPasswordRecoveryRequestListPage() {
  const { data, isLoading } = useQuery<StudentPasswordRecoveryRequestListPageQuery>(query);

  useEffect(() => {
    document.title = 'Solicitações de Recuperação de Senha | Usefaz Admin';
  }, []);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <OuterStudentPasswordRecoveryRequestListPage>
      <StudentPasswordRecoveryRequestList admin={data.admin} />
    </OuterStudentPasswordRecoveryRequestListPage>
  );
}
