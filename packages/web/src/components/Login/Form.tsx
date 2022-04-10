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
    background-color: #fff;
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

const StyledButton = styled(Button)`
  && {
    color: #fafafa;
    border-radius: 4px;
    height: 56px;
    padding: 0;
  }
`;

export default function Form() {
  const { enqueueSnackbar } = Notification.useSnackbar();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleClickShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault();

  const handleChangeRememberMe = (event: React.ChangeEvent<HTMLInputElement>) => setRememberMe(event.target.checked);

  const [loginMutation, { loading }] = useMutation<StudentLoginMutationType>(StudentLoginMutation, {
    onError: (errors) => {
      const { notFound } = errorConfig.student;

      const studentNotFoundError = getError(errors, notFound.code);
      if (studentNotFoundError) {
        enqueueSnackbar('Aluno não encontrado. Por favor, tente novamente.', { variant: 'error' });
      }
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const RM = formData.get('RM').toString();
    const password = formData.get('password').toString();
    const rememberMe = Boolean(formData.get('rememberMe')?.toString());

    loginMutation({
      variables: {
        input: { RM, password },
      },
      onCompleted: ({ studentLogin }) => {
        if (studentLogin?.jwtToken) {
          if (rememberMe) {
            localStorage.setItem('Usefaz-RM', RM);
          } else {
            localStorage.removeItem('Usefaz-RM');
          }

          jwtToken.set(studentLogin.jwtToken);
          window.location.reload();
        }
      },
    });
  };

  return (
    <OuterForm>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <InputWrapper>
          <StyledTextField
            name="RM"
            placeholder="N° de matrícula"
            type="text"
            variant="outlined"
            autoComplete="false"
            defaultValue={localStorage.getItem('Usefaz-RM')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />

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
        </InputWrapper>

        <OptionsWrapper>
          <StyledFormControlLabel
            label="Lembrar-me"
            name="rememberMe"
            control={<Checkbox checked={rememberMe} onChange={handleChangeRememberMe} />}
          />

          <Hyperlink to="/esqueci-minha-senha">Esqueci minha senha</Hyperlink>
        </OptionsWrapper>

        <StyledButton variant="contained" color="primary" type="submit" disabled={loading} fullWidth>
          Entrar
        </StyledButton>
      </form>
    </OuterForm>
  );
}
