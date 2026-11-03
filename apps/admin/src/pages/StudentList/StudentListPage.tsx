import { PageContainer } from '@usefaz/ui/components/page-header';
import { PageLoader } from '@usefaz/ui/components/page-loader';
import { Suspense } from 'react';
import { graphql, useLazyLoadQuery } from 'react-relay';

import type { StudentListPageQuery } from './__generated__/StudentListPageQuery.graphql';
import StudentList from './components/StudentList';

export default function StudentListPage() {
  return (
    <>
      <title>Alunos | Usefaz Admin</title>
      <Suspense fallback={<PageLoader />}>
        <StudentListPageContent />
      </Suspense>
    </>
  );
}

function StudentListPageContent() {
  const data = useLazyLoadQuery<StudentListPageQuery>(
    graphql`
      query StudentListPageQuery {
        admin {
          ...StudentList_admin
        }
      }
    `,
    {}
  );

  return <PageContainer>{data.admin && <StudentList admin={data.admin} />}</PageContainer>;
}
