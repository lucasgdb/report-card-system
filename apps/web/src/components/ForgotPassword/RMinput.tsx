import PersonIcon from '@mui/icons-material/Person';
import styled from 'styled-components';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

const StyledTextField = styled(TextField)`
  & .MuiInputBase-root {
    background-color: #f7f5fa;
  }
`;

export default function RMInput() {
  return (
    <StyledTextField
      name="RM"
      placeholder="N° de matrícula"
      type="text"
      variant="outlined"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <PersonIcon color="primary" />
          </InputAdornment>
        ),
      }}
    />
  );
}
