import styled from 'styled-components';
import { Outlet } from 'react-router';
import { useState } from 'react';
import { graphql, useQuery } from 'relay-hooks';

import { NavbarLayoutQuery } from './__generated__/NavbarLayoutQuery.graphql';
import Navbar from './Navbar';
import MenuLayout from '../Menu/MenuLayout';
import { PageLoader } from '@usefaz/components';

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
  const { data, isLoading } = useQuery<NavbarLayoutQuery>(graphql`
    query NavbarLayoutQuery {
      admin {
        ...Navbar_admin
      }
    }
  `);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <OuterNavbarLayout>
      <Navbar admin={data.admin} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      <PageWrapper>
        <MenuLayout isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}>
          <Outlet />
        </MenuLayout>
      </PageWrapper>
    </OuterNavbarLayout>
  );
};

export default NavbarLayout;
