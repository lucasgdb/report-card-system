import { PageLoader } from '@usefaz/ui/components/page-loader';
import { graphql, useLazyLoadQuery } from 'react-relay';
import { Suspense, useEffect } from 'react';

import SkipLink from '~/components/SkipLink';
import { saveStudentSnapshot } from '~/utils/saveSchoolReport';
import type { HomePageQuery } from './__generated__/HomePageQuery.graphql';
import Menu from './components/Menu/Menu';
import Profile from './components/Profile/Profile';
import SchoolReport from './components/SchoolReport/SchoolReport';

export default function HomePage() {
  return (
    <>
      <title>Boletim | Usefaz</title>
      <Suspense fallback={<PageLoader />}>
        <HomePageContent />
      </Suspense>
    </>
  );
}

function HomePageContent() {
  const data = useLazyLoadQuery<HomePageQuery>(
    graphql`
      query HomePageQuery {
        student {
          RM
          fullname
          firstname
          lastname

          ...Menu_student
          ...Profile_student

          schoolReport {
            year

            ...SchoolReport_schoolReport
          }
        }
      }
    `,
    {}
  );

  const { student } = data;

  // The offline page shows who the saved report card belongs to.
  useEffect(() => {
    saveStudentSnapshot({
      RM: student.RM,
      fullname: student.fullname,
      firstname: student.firstname,
      lastname: student.lastname,
      year: student.schoolReport?.year,
    });
  }, [student]);

  return (
    <>
      <SkipLink targetId="conteudo">Pular para o boletim</SkipLink>
      <Menu student={student} />
      <main id="conteudo" tabIndex={-1} className="scroll-mt-28 outline-none">
        <h1 className="sr-only">Boletim de {student.fullname}</h1>
        <Profile student={student} />
        <SchoolReport schoolReport={student.schoolReport} />
      </main>
    </>
  );
}
