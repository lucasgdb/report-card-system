import styled, { createGlobalStyle } from 'styled-components';
import useMediaQuery from '@mui/material/useMediaQuery';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

import Login from './components/Login';

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

  width: 1105px;
  height: 809px;

  @media (max-width: 1279px) {
    display: none;
  }
`;

const ZLogoImage = styled.img`
  position: absolute;
  top: 0;
  right: 0;

  max-width: 80%;
`;

const StyledLink = styled(Link)`
  && {
    @media (max-width: 1279px) {
      display: none;
    }
  }
`;

const UsefazLogoImage = styled.img`
  position: absolute;
  left: 160px;
  top: 52px;

  @media (max-width: 1382px) {
    left: unset;
    right: 1000px;
  }
`;

const ReadingBookImage = styled.img`
  position: absolute;
  right: 708px;
  top: 230px;

  @media (max-width: 1299px) {
    display: none;
  }
`;

export default function LoginPage() {
  const shouldChangeBodyStyle = useMediaQuery('(max-width: 1279px)');

  useEffect(() => {
    document.title = 'Login | Usefaz Admin';
  }, []);

  return (
    <GoogleReCaptchaProvider reCaptchaKey={process.env.RECAPTCHA_V3_PUBLIC_TOKEN} language="pt-BR" useRecaptchaNet>
      {shouldChangeBodyStyle && <GlobalStyle />}

      <OuterLoginPage>
        <BackgroundImage src="/assets/images/background_blue.svg" />

        <ZLogoImage src="/assets/images/z_logo.svg" />

        <StyledLink to="/">
          <UsefazLogoImage src="/assets/images/usefaz_logo.svg" />
        </StyledLink>

        <Login />

        <ReadingBookImage src="/assets/images/woman_reading_book.svg" />
      </OuterLoginPage>
    </GoogleReCaptchaProvider>
  );
}
