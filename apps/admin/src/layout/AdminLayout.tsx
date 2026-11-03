import { AppShell, AppShellBrand, SidebarNav, SidebarNavItem } from '@usefaz/ui/components/app-shell';
import { PageLoader } from '@usefaz/ui/components/page-loader';
import { GraduationCapIcon, KeyRoundIcon } from 'lucide-react';
import { Suspense } from 'react';
import { graphql, useLazyLoadQuery } from 'react-relay';
import { Link, Outlet, useLocation } from 'react-router';

import AccountMenu from './AccountMenu';
import NotificationIcon from './Notifications/NotificationIcon';
import type { AdminLayoutQuery } from './__generated__/AdminLayoutQuery.graphql';

/** The signed-in admin's frame: sidebar (navigation, notifications, account) around the page. */
export default function AdminLayout() {
  return (
    <Suspense fallback={<PageLoader />}>
      <AdminLayoutContent />
    </Suspense>
  );
}

function AdminLayoutContent() {
  const { pathname } = useLocation();
  const data = useLazyLoadQuery<AdminLayoutQuery>(
    graphql`
      query AdminLayoutQuery($count: Int!, $after: String) {
        admin {
          pendingStudentPasswordRecoveryRequestCount
          ...AccountMenu_admin
          ...NotificationIcon_admin @arguments(count: $count, after: $after)
        }
      }
    `,
    { count: 5 }
  );

  if (!data.admin) {
    return null;
  }

  const pending = data.admin.pendingStudentPasswordRecoveryRequestCount;

  return (
    <AppShell
      closeKey={pathname}
      brand={
        <AppShellBrand
          logo={<img src="/assets/icons/usefaz_mark.svg" alt="" width={32} height={32} />}
          name="Usefaz"
          badge="Admin"
        />
      }
      actions={<NotificationIcon admin={data.admin} />}
      nav={
        <SidebarNav>
          <SidebarNavItem active={pathname === '/'} icon={<GraduationCapIcon />} render={<Link to="/" />}>
            Alunos
          </SidebarNavItem>
          <SidebarNavItem
            active={pathname === '/solicitacoes-de-recuperacao-de-senha'}
            icon={<KeyRoundIcon />}
            badge={pending > 0 ? pending : undefined}
            render={<Link to="/solicitacoes-de-recuperacao-de-senha" />}
          >
            Recuperação de senha
          </SidebarNavItem>
        </SidebarNav>
      }
      footer={<AccountMenu admin={data.admin} />}
    >
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </AppShell>
  );
}
