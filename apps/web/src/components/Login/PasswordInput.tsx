import styled from 'styled-components';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import HttpsIcon from '@mui/icons-material/Https';
import { useState } from 'react';

const StyledTextField = styled(TextField)`
  & .MuiInputBase-root {
    background-color: #f7f5fa;
  }
`;

export default function PasswordInput() {
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
}
