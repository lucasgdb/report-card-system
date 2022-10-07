import styled from 'styled-components';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import MailIcon from '@mui/icons-material/Mail';

const StyledTextField = styled(TextField)`
  & .MuiInputBase-root {
    background-color: #f7f5fa;
  }
`;

export default function EmailInput() {
  return (
    <StyledTextField
      placeholder="E-mail"
      name="email"
      type="email"
      variant="outlined"
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
