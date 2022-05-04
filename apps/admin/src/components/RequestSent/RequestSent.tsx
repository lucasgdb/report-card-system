import styled from 'styled-components';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router';

const OuterRequestSent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  z-index: 1;
`;

const RecoverySuccessImage = styled.img``;

const RequestSentTextImage = styled.img`
  margin-top: 32px;
  max-width: 100%;
`;

const HelpText = styled.p`
  font: normal normal 400 16px/24px Lexend;
  color: #fafafa;
  margin: 24px 0 0;
  text-align: center;
  max-width: 350px;
`;

const LoginButton = styled(Button)`
  && {
    color: #fafafa;
    border-radius: 4px;
    height: 56px;
    padding: 0;

    max-width: 358px;

    text-transform: unset;

    margin-top: 32px;
  }
`;

const StyledArrowBackIcon = styled(ArrowBackIcon)`
  && {
    margin-right: 24px;
  }
`;

export default function RequestSent() {
  const navigate = useNavigate();

  const handleBackToLoginPage = () => navigate('/');

  return (
    <OuterRequestSent>
      <RecoverySuccessImage src="/assets/images/recovery_success.svg" />
      <RequestSentTextImage src="/assets/images/request_sent_text.svg" />

      <HelpText>Agora é só checar o e-mail que foi enviado para você redefinir sua senha.</HelpText>

      <LoginButton variant="contained" color="primary" onClick={handleBackToLoginPage} fullWidth>
        <StyledArrowBackIcon />
        Voltar ao Login
      </LoginButton>
    </OuterRequestSent>
  );
}
