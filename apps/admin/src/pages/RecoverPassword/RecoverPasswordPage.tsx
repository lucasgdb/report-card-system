import { Notification, PageLoader } from '@usefaz/components';
import styled, { createGlobalStyle } from 'styled-components';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Link } from 'react-router-dom';
import { graphql, useQuery } from 'relay-hooks';
import { useNavigate, useParams } from 'react-router';

import { RecoverPasswordPageQuery } from './__generated__/RecoverPasswordPageQuery.graphql';
import RecoverPassword from './components/RecoverPassword';
import { useEffect } from 'react';

const GlobalStyle = createGlobalStyle`
  body {
    @media (max-width: 1279px) {
      background: #0020a2 0 0 no-repeat padding-box !important;
    }
  }
`;

const OuterRecoverPasswordPage = styled.div`
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

const PasswordRecoveryImage = styled.img`
  position: absolute;
  right: 654px;
  top: 347px;

  @media (max-width: 1299px) {
    display: none;
  }
`;

export default function RecoverPasswordPage() {
  const { enqueueSnackbar } = Notification.useSnackbar();

  const navigate = useNavigate();
  const { requestId } = useParams<{ requestId: string }>();

  const { data, isLoading } = useQuery<RecoverPasswordPageQuery>(
    graphql`
      query RecoverPasswordPageQuery($requestId: ID!) {
        adminPasswordRecoveryRequest: node(id: $requestId) {
          ... on AdminPasswordRecoveryRequest {
            status
          }
        }
      }
    `,
    { requestId }
  );

  const shouldChangeBodyStyle = useMediaQuery('(max-width: 1279px)');

  useEffect(() => {
    document.title = 'Recuperar senha | Usefaz Admin';
  }, []);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (data.adminPasswordRecoveryRequest?.status !== 'PENDING') {
      enqueueSnackbar('Requisição inválida ou expirada.', { variant: 'error' });
      navigate('/');
    }
  }, [data, isLoading, enqueueSnackbar, navigate]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (data.adminPasswordRecoveryRequest?.status !== 'PENDING') {
    return null;
  }

  return (
    <>
      {shouldChangeBodyStyle && <GlobalStyle />}

      <OuterRecoverPasswordPage>
        <BackgroundImage src="/assets/images/background_blue.svg" />

        <ZLogoImage src="/assets/images/z_logo.svg" />

        <StyledLink to="/">
          <UsefazLogoImage src="/assets/images/usefaz_logo.svg" />
        </StyledLink>

        <RecoverPassword />

        <PasswordRecoveryImage src="/assets/images/password_recovery_man.svg" />
      </OuterRecoverPasswordPage>
    </>
  );
}
