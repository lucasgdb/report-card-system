import styled from 'styled-components';

import OpenMenuButton from './OpenMenuButton';

const OuterNavbar = styled.div`
  position: sticky;
  top: 0;
  z-index: 12;

  height: 56px;
  background-color: #0020a2;
  padding-right: 16px;

  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.125), 0 -1px 2px rgba(0, 0, 0, 0.1);

  display: flex;
  align-items: center;
  gap: 16px;

  @media (min-width: 1200px) {
    display: none;
  }
`;

const UsefazLogo = styled.img`
  width: 32px;
`;

type NavbarProps = {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Navbar = ({ isMenuOpen, setIsMenuOpen }: NavbarProps) => {
  return (
    <OuterNavbar>
      <OpenMenuButton isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <UsefazLogo src="/assets/icons/logo.png" />
    </OuterNavbar>
  );
};

export default Navbar;
