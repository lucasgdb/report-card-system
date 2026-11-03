import { PageContainer } from '@usefaz/ui/components/page-header';
import { PageLoader } from '@usefaz/ui/components/page-loader';
import { Suspense } from 'react';
import { graphql, useLazyLoadQuery } from 'react-relay';

import type { StudentPasswordRecoveryRequestListPageQuery } from './__generated__/StudentPasswordRecoveryRequestListPageQuery.graphql';
import StudentPasswordRecoveryRequestList from './components/StudentPasswordRecoveryRequestList';

export default function StudentPasswordRecoveryRequestListPage() {
  return (
    <>
      <title>Recuperação de senha | Usefaz Admin</title>
      <Suspense fallback={<PageLoader />}>
        <StudentPasswordRecoveryRequestListPageContent />
      </Suspense>
    </>
  );
}

function StudentPasswordRecoveryRequestListPageContent() {
  const data = useLazyLoadQuery<StudentPasswordRecoveryRequestListPageQuery>(
    graphql`
      query StudentPasswordRecoveryRequestListPageQuery {
        admin {
          ...StudentPasswordRecoveryRequestList_admin
        }
      }
    `,
    {}
  );

  return <PageContainer>{data.admin && <StudentPasswordRecoveryRequestList admin={data.admin} />}</PageContainer>;
}
