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
import { useState } from 'react';
import { useMutation } from 'relay-hooks';
import { useNavigate } from 'react-router';

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

const StyledButton = styled(Button)`
  && {
    margin-top: 24px;
    color: #fafafa;
    border-radius: 4px;
    height: 56px;
    padding: 0;
  }
`;

export default function Form() {
  const { enqueueSnackbar } = Notification.useSnackbar();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

  const handleMouseDownPassword = (event) => event.preventDefault();

  const [loginMutation, { loading }] = useMutation<StudentLoginMutationType>(StudentLoginMutation, {
    onCompleted: ({ studentLogin }) => {
      if (studentLogin?.jwtToken) {
        jwtToken.set(studentLogin.jwtToken);
        navigate('/home');
      }
    },
    onError: (errors) => {
      const { notFound } = errorConfig.student;

      const studentNotFoundError = getError(errors, notFound.code);
      if (studentNotFoundError) {
        enqueueSnackbar('Usuário não encontrado. Por favor, tente novamente.', { variant: 'error' });
      }
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const RM = formData.get('RM').toString();
    const password = formData.get('password').toString();

    loginMutation({
      variables: {
        input: { RM, password },
      },
    });
  };

  return (
    <OuterForm>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <InputWrapper>
          <StyledTextField
            id="RM"
            name="RM"
            placeholder="N° de matrícula"
            type="text"
            variant="outlined"
            autoComplete="false"
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

        <StyledButton variant="contained" color="primary" type="submit" disabled={loading} fullWidth>
          Entrar
        </StyledButton>
      </form>
    </OuterForm>
  );
}
