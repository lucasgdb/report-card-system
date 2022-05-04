import styled from 'styled-components';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const StyledFormControlLabel = styled(FormControlLabel)`
  & .MuiTypography-root {
    font: normal normal 400 13px/16px Lexend;
    color: #f7f5fa;
  }
`;

export default function RememberMeCheckbox() {
  return <StyledFormControlLabel label="Lembrar-me" name="rememberMe" control={<Checkbox defaultChecked />} />;
}
