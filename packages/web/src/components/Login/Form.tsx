import { errorConfig, getError } from '@usefaz/shared';
import { Notification } from '@usefaz/components';
import styled from 'styled-components';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PersonIcon from '@mui/icons-material/Person';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import HttpsIcon from '@mui/icons-material/Https';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useState } from 'react';
import { useMutation } from 'relay-hooks';
import { Link } from 'react-router-dom';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

import jwtToken from '~/utils/jwtToken';
import StudentLoginMutation from '~/modules/student/StudentLoginMutation';
import { StudentLoginMutation as StudentLoginMutationType } from '~/modules/student/__generated__/StudentLoginMutation.graphql';

const OuterForm = styled.div`
  margin-top: 42px;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StyledTextField = styled(TextField)`
  & .MuiInputBase-root {
    background-color: #f7f5fa;
  }
`;

const OptionsWrapper = styled.div`
  padding: 24px 0;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledFormControlLabel = styled(FormControlLabel)`
  & .MuiTypography-root {
    font: normal normal 400 13px/16px Lexend;
    color: #f7f5fa;
  }
`;

const Hyperlink = styled(Link)`
  && {
    color: #f7f5fa;
    text-decoration: none;

    :hover {
      text-decoration: underline;
    }
  }
`;

const LoginButton = styled(Button)`
  && {
    color: #fafafa;
    border-radius: 4px;
    height: 56px;
    padding: 0;
  }
`;

const RMInput = () => {
  return (
    <StyledTextField
      name="RM"
      placeholder="N° de matrícula"
      type="text"
      variant="outlined"
      defaultValue={localStorage.getItem('Usefaz-RM')}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <PersonIcon color="primary" />
          </InputAdornment>
        ),
      }}
    />
  );
};

const PasswordInput = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault();

  return (
    <StyledTextField
      placeholder="Senha"
      name="password"
      type={showPassword ? 'text' : 'password'}
      variant="outlined"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <HttpsIcon color="primary" />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
              {showPassword ? <VisibilityOff color="secondary" /> : <Visibility color="secondary" />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

const RememberMeCheckbox = () => {
  const [rememberMe, setRememberMe] = useState(true);

  const handleChangeRememberMe = (event: React.ChangeEvent<HTMLInputElement>) => setRememberMe(event.target.checked);

  return (
    <StyledFormControlLabel
      label="Lembrar-me"
      name="rememberMe"
      control={<Checkbox checked={rememberMe} onChange={handleChangeRememberMe} />}
    />
  );
};

export default function Form() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const { enqueueSnackbar } = Notification.useSnackbar();

  const [loginMutation, { loading }] = useMutation<StudentLoginMutationType>(StudentLoginMutation, {
    onError: (errors) => {
      const { notFound } = errorConfig.student;

      const studentNotFoundError = getError(errors, notFound.code);
      if (studentNotFoundError) {
        enqueueSnackbar('Aluno não encontrado. Por favor, tente novamente.', { variant: 'error' });
      }
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const RM = formData.get('RM').toString();
    if (!RM) {
      enqueueSnackbar('RM obrigatório.', { variant: 'error' });
      return;
    }

    const password = formData.get('password').toString();
    if (!password) {
      enqueueSnackbar('Senha obrigatória.', { variant: 'error' });
      return;
    }

    const rememberMe = Boolean(formData.get('rememberMe')?.toString());

    const __DEV__ = process.env.NODE_ENV?.toUpperCase() === 'DEVELOPMENT';
    const token = __DEV__ ? '' : await executeRecaptcha('login');

    loginMutation({
      variables: {
        input: { RM, password, token },
      },
      onCompleted: ({ studentLogin }) => {
        if (studentLogin.jwtToken) {
          if (rememberMe) {
            localStorage.setItem('Usefaz-RM', RM);
          } else {
            localStorage.removeItem('Usefaz-RM');
          }

          jwtToken.set(studentLogin.jwtToken);

          window.location.href = '/';
        }
      },
    });
  };

  return (
    <OuterForm>
      <form onSubmit={handleSubmit}>
        <InputWrapper>
          <RMInput />
          <PasswordInput />
        </InputWrapper>

        <OptionsWrapper>
          <RememberMeCheckbox />
          <Hyperlink to="/esqueci-minha-senha">Esqueci minha senha</Hyperlink>
        </OptionsWrapper>

        <LoginButton variant="contained" color="primary" type="submit" disabled={loading} fullWidth>
          Entrar
        </LoginButton>
      </form>
    </OuterForm>
  );
}
