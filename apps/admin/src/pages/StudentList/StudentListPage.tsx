import { graphql, useLazyLoadQuery } from 'react-relay';
import { Suspense } from 'react';

import type { StudentListPageQuery } from './__generated__/StudentListPageQuery.graphql';
import StudentList from './components/StudentList';
import UploadButton from './components/Upload/UploadButton';
import PageLoader from '~/components/PageLoader';

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
          ...UploadButton_admin
          ...StudentList_admin
        }
      }
    `,
    {}
  );

  return (
    <div className="flex w-full flex-col gap-6 px-8 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] leading-[25px] font-bold text-foreground">Alunos</h1>
        <UploadButton admin={data.admin} />
      </div>

      <StudentList admin={data.admin} />
    </div>
  );
}
