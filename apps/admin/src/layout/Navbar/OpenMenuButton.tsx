import styled from 'styled-components';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const OuterOpenMenuButton = styled(IconButton)`
  && {
    width: 56px;
    height: 56px;

    background-color: #ee7844;
    border-radius: 0 0 24px 0;

    display: flex;
    justify-content: center;
    align-items: center;

    :hover {
      background-color: #d66c3d;
    }

    @media (min-width: 1200px) {
      display: none;
    }
  }
`;

const StyledMenuIcon = styled(MenuIcon)`
  && {
    color: #fff;
  }
`;

const StyledCloseIcon = styled(CloseIcon)`
  && {
    color: #fff;
  }
`;

type OpenMenuButtonProps = {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const OpenMenuButton = ({ isMenuOpen, setIsMenuOpen }: OpenMenuButtonProps) => {
  const handleClick = () => setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);

  return (
    <OuterOpenMenuButton onClick={handleClick} color="secondary">
      {isMenuOpen ? <StyledCloseIcon /> : <StyledMenuIcon />}
    </OuterOpenMenuButton>
  );
};

export default OpenMenuButton;
