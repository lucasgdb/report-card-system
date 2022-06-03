import styled from 'styled-components';
import { Outlet } from 'react-router';
import { useState } from 'react';

import Navbar from './Navbar';
import MenuLayout from '../Menu/MenuLayout';

const OuterNavbarLayout = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  min-height: 100vh;
`;

export const PageWrapper = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  flex: 1;
`;

const NavbarLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <OuterNavbarLayout>
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      <PageWrapper>
        <MenuLayout isMenuOpen={isMenuOpen}>
          <Outlet />
        </MenuLayout>
      </PageWrapper>
    </OuterNavbarLayout>
  );
};

export default NavbarLayout;
