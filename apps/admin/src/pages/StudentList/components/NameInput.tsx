import PersonIcon from '@mui/icons-material/Person';
import styled from 'styled-components';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

const StyledTextField = styled(TextField)`
  & .MuiInputBase-root {
    background-color: #f7f5fa;
  }
`;

export default function NameInput(props: TextFieldProps) {
  return (
    <StyledTextField
      name="fullname"
      placeholder="Nome completo"
      type="text"
      variant="outlined"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <PersonIcon color="primary" />
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
}
