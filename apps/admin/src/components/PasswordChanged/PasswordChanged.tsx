import styled from 'styled-components';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router';

const OuterPasswordChanged = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  z-index: 1;
`;

const RecoverySuccessImage = styled.img``;

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

export default function PasswordChanged() {
  const navigate = useNavigate();

  const handleBackToLoginPage = () => navigate('/');

  return (
    <OuterPasswordChanged>
      <RecoverySuccessImage src="/assets/images/recovery_success.svg" />

      <HelpText>Sua senha foi redefinida com sucesso. Clique no botão abaixo para acessar a página de login.</HelpText>

      <LoginButton variant="contained" color="primary" onClick={handleBackToLoginPage} fullWidth>
        <StyledArrowBackIcon />
        Voltar ao Login
      </LoginButton>
    </OuterPasswordChanged>
  );
}
