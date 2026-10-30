import { Outlet } from 'react-router';
import { useState, Suspense } from 'react';
import { graphql, useLazyLoadQuery } from 'react-relay';
import { PageLoader } from '@usefaz/ui/components/page-loader';

import type { NavbarLayoutQuery } from './__generated__/NavbarLayoutQuery.graphql';
import Navbar from './Navbar';
import MenuLayout from '../Menu/MenuLayout';

const NavbarLayout = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <NavbarLayoutContent />
    </Suspense>
  );
};

const NavbarLayoutContent = () => {
  const data = useLazyLoadQuery<NavbarLayoutQuery>(
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

  return (
    <div className="flex min-h-dvh w-full flex-col">
      {/* HashRouter owns the URL fragment, so the skip link moves focus instead of navigating to #conteudo. */}
      <button
        type="button"
        onClick={() => document.getElementById('conteudo')?.focus()}
        className="sr-only z-50 rounded-md bg-background text-sm font-medium text-foreground shadow-md outline-none focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:ring-3 focus:ring-ring/50"
      >
        Pular para o conteúdo
      </button>

      <Navbar admin={data.admin} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      <div className="flex w-full flex-1 flex-col">
        <MenuLayout isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}>
          <main id="conteudo" tabIndex={-1} className="flex w-full flex-1 outline-none">
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </main>
        </MenuLayout>
      </div>
    </div>
  );
};

export default NavbarLayout;
