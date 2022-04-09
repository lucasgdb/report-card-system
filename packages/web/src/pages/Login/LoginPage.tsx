import { graphql, useQuery } from 'relay-hooks';
import styled from 'styled-components';
import { useNavigate } from 'react-router';

import { LoginPageQuery } from './__generated__/LoginPageQuery.graphql';
import PageLoader from '~/components/PageLoader';
import LoginCard from '~/components/Login/LoginCard';

const query = graphql`
  query LoginPageQuery {
    auth {
      isLogged
    }
  }
`;

const OuterLoginPage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  height: 100vh;
  padding: 0 16px;
`;

const BackgroundImage = styled.img`
  position: absolute;
  top: 0;
  right: 0;
`;

const ZLogo = styled.img`
  position: absolute;
  top: 0;
  right: 0;

  max-width: 80%;
`;

const UsefazLogo = styled.img`
  position: absolute;
  left: 160px;
  top: 52px;

  @media (max-width: 1279px) {
    display: none;
  }

  @media (max-width: 1359px) {
    left: 80px;
  }
`;

const ReadingBookImage = styled.img`
  position: absolute;
  right: 726px;
  top: 219px;

  @media (max-width: 1299px) {
    display: none;
  }
`;

export default function LoginPage() {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<LoginPageQuery>(query);

  if (isLoading) {
    return <PageLoader />;
  }

  if (data.auth.isLogged) {
    navigate('/home');
    return null;
  }

  return (
    <OuterLoginPage>
      <BackgroundImage src="/assets/images/background_blue.svg" />
      <ZLogo src="/assets/images/z_logo.svg" />

      <UsefazLogo src="/assets/images/usefaz_logo.svg" />

      <LoginCard />

      <ReadingBookImage src="/assets/images/reading_book.svg" />
    </OuterLoginPage>
  );
}
