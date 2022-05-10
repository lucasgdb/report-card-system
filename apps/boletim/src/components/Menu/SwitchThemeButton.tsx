import styled from 'styled-components';
import IconButton from '@mui/material/IconButton';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

import { useThemeContext } from '~/contexts/ThemeContext';

const StyledIconButton = styled(IconButton)`
  && {
    padding: 0;
  }
`;

const StyledDarkModeIcon = styled(DarkModeIcon)`
  && {
    color: ${(props) => props.theme.text.main};
    transition: color 0.2s;
  }
`;

const StyledLightModeIcon = styled(LightModeIcon)`
  && {
    color: ${(props) => props.theme.text.main};
    transition: color 0.2s;
  }
`;

export default function SwitchThemeButton() {
  const { theme, switchTheme } = useThemeContext();

  return (
    <StyledIconButton onClick={switchTheme}>
      {theme === 'light' ? <StyledDarkModeIcon /> : <StyledLightModeIcon />}
    </StyledIconButton>
  );
}
