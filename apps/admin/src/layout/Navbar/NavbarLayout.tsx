import styled from 'styled-components';
import { Outlet } from 'react-router';
import { useState, Suspense } from 'react';
import { graphql, useQuery } from 'relay-hooks';
import { PageLoader } from '@usefaz/components';

import { NavbarLayoutQuery } from './__generated__/NavbarLayoutQuery.graphql';
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
  const { data, isLoading } = useQuery<NavbarLayoutQuery>(
    graphql`
      query NavbarLayoutQuery($count: Int!, $after: String) {
        admin {
          ...Navbar_admin @arguments(count: $count, after: $after)
        }
      }
    `,
    { count: 5 }
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <OuterNavbarLayout>
      <Navbar admin={data.admin} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      <PageWrapper>
        <MenuLayout isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}>
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </MenuLayout>
      </PageWrapper>
    </OuterNavbarLayout>
  );
};

export default NavbarLayout;
