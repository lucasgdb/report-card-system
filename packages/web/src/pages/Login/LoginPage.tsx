import { graphql, useQuery } from 'relay-hooks';
import styled, { createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router';
import useMediaQuery from '@mui/material/useMediaQuery';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

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

const GlobalStyle = createGlobalStyle`
  body {
    @media (max-width: 1279px) {
      background: #0020a2 0 0 no-repeat padding-box !important;
    }
  }
`;

const OuterLoginPage = styled.div`
  display: grid;
  place-items: center;

  height: 100vh;
  padding: 16px 16px 0;
`;

const BackgroundImage = styled.img`
  position: absolute;
  top: 0;
  right: 0;

  max-height: 100%;

  @media (max-width: 1279px) {
    display: none;
  }
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

  const shouldChangeBodyStyle = useMediaQuery('(max-width: 1279px)');

  const { data, isLoading } = useQuery<LoginPageQuery>(query);

  if (isLoading) {
    return <PageLoader />;
  }

  if (data.auth.isLogged) {
    navigate('/');
    return null;
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.RECAPTCHA_V3_PUBLIC_TOKEN}
      language="pt-BR"
      useRecaptchaNet
      scriptProps={{ async: true }}
    >
      <OuterLoginPage>
        {shouldChangeBodyStyle && <GlobalStyle />}

        <BackgroundImage src="/assets/images/background_blue.svg" />
        <ZLogo src="/assets/images/z_logo.svg" />

        <UsefazLogo src="/assets/images/usefaz_logo.svg" />

        <LoginCard />

        <ReadingBookImage src="/assets/images/reading_book.svg" />
      </OuterLoginPage>
    </GoogleReCaptchaProvider>
  );
}
