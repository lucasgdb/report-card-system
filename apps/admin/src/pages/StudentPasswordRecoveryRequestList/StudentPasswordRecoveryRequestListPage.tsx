import { graphql, useLazyLoadQuery } from 'react-relay';
import { Suspense } from 'react';

import type { StudentPasswordRecoveryRequestListPageQuery } from './__generated__/StudentPasswordRecoveryRequestListPageQuery.graphql';
import StudentPasswordRecoveryRequestList from './components/StudentPasswordRecoveryRequestList';
import PageLoader from '~/components/PageLoader';

export default function StudentPasswordRecoveryRequestListPage() {
  return (
    <>
      <title>Solicitações de recuperação de senha | Usefaz Admin</title>
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

  return (
    <div className="flex w-full flex-col gap-6 px-8 py-6">
      <h1 className="text-[22px] leading-[25px] font-bold text-balance text-foreground">
        Solicitações de recuperação de senha
      </h1>

      <StudentPasswordRecoveryRequestList admin={data.admin} />
    </div>
  );
}
