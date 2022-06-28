import styled from 'styled-components';
import { graphql, useQuery } from 'relay-hooks';
import { useEffect } from 'react';

import { StudentListPageQuery } from './__generated__/StudentListPageQuery.graphql';
import StudentList from '~/components/StudentList/StudentList';
import UploadButton from '~/components/StudentList/Upload/UploadButton';
import PageLoader from '~/components/PageLoader';

const OuterStudentListPage = styled.div`
  padding: 24px 32px;
  width: 100%;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font: normal normal 700 22px/25px Lexend;
  margin: 0;
  color: #333;
`;

export default function StudentListPage() {
  const { data, isLoading } = useQuery<StudentListPageQuery>(graphql`
    query StudentListPageQuery {
      admin {
        ...UploadButton_admin
        ...StudentList_admin
      }
    }
  `);

  useEffect(() => {
    document.title = 'Alunos | Usefaz Admin';
  }, []);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <OuterStudentListPage>
      <Header>
        <Title>Alunos</Title>
        <UploadButton admin={data.admin} />
      </Header>

      <StudentList admin={data.admin} />
    </OuterStudentListPage>
  );
}
