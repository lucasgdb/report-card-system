import MailIcon from '@mui/icons-material/Mail';
import styled from 'styled-components';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

const StyledTextField = styled(TextField)`
  & .MuiInputBase-root {
    background-color: #f7f5fa;
  }
`;

export default function EmailInput() {
  return (
    <StyledTextField
      name="email"
      placeholder="E-mail"
      type="email"
      variant="outlined"
      defaultValue={localStorage.getItem('Usefaz-Email')}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <MailIcon color="primary" />
          </InputAdornment>
        ),
      }}
    />
  );
}
