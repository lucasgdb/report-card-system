import styled from 'styled-components';
import { graphql, useFragment } from 'relay-hooks';

import { Navbar_admin$key } from './__generated__/Navbar_admin.graphql';
import AvatarMenu from './AvatarMenu/AvatarMenu';
import OpenMenuButton from './OpenMenuButton';
import NotificationIcon from './NotificationIcon/NotificationIcon';

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
  justify-content: space-between;

  @media (min-width: 1200px) {
    background-color: #fff;
    height: 78px;
  }
`;

const LeftOptionsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  height: 100%;
`;

const RightOptionsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  height: 100%;
`;

const UsefazLogoWrapper = styled.div`
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  @media (min-width: 1200px) {
    background-color: #ee7844;
    width: 72px;
  }
`;

const UsefazLogo = styled.img`
  width: 40px;
  background-color: #0020a2;
  border-radius: 50%;
`;

type NavbarProps = {
  admin: Navbar_admin$key;
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Navbar = ({ admin, isMenuOpen, setIsMenuOpen }: NavbarProps) => {
  const data = useFragment<Navbar_admin$key>(
    graphql`
      fragment Navbar_admin on Admin
      @argumentDefinitions(count: { type: "Int", defaultValue: 5 }, after: { type: "String" }) {
        ...AvatarMenu_admin
        ...NotificationIcon_admin @arguments(count: $count, after: $after)
      }
    `,
    admin
  );

  return (
    <OuterNavbar>
      <LeftOptionsWrapper>
        <OpenMenuButton isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

        <UsefazLogoWrapper>
          <UsefazLogo src="/assets/icons/logo.png" />
        </UsefazLogoWrapper>
      </LeftOptionsWrapper>

      <RightOptionsWrapper>
        <NotificationIcon admin={data} />
        <AvatarMenu admin={data} />
      </RightOptionsWrapper>
    </OuterNavbar>
  );
};

export default Navbar;
