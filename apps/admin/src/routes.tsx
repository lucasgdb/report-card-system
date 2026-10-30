import { Route, Routes, HashRouter } from 'react-router';
import * as React from 'react';

import EnvironmentLayout from '~/layout/EnvironmentLayout';
import SuspenseRouter from './components/SuspenseRouter';

// The signed-in shell (menu, notifications) isn't needed on the login, so it loads with the first page.
const NavbarLayout = React.lazy(() => import('./layout/Navbar/NavbarLayout'));

const ErrorPage = React.lazy(() => import('~/pages/Error/ErrorPage'));
const ForgotPasswordPage = React.lazy(() => import('~/pages/ForgotPassword/ForgotPasswordPage'));
const RequestSentPage = React.lazy(() => import('~/pages/RequestSent/RequestSentPage'));
const RecoverPasswordPage = React.lazy(() => import('~/pages/RecoverPassword/RecoverPasswordPage'));
const PasswordChangedPage = React.lazy(() => import('~/pages/PasswordChanged/PasswordChangedPage'));
const StudentPasswordRecoveryRequestListPage = React.lazy(
  () => import('~/pages/StudentPasswordRecoveryRequestList/StudentPasswordRecoveryRequestListPage')
);
const StudentListPage = React.lazy(() => import('~/pages/StudentList/StudentListPage'));

export default function AppRoutes() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<EnvironmentLayout />}>
          <Route element={<NavbarLayout />}>
            <Route index element={<StudentListPage />} />

            <Route path="/solicitacoes-de-recuperacao-de-senha" element={<StudentPasswordRecoveryRequestListPage />} />
          </Route>
        </Route>

        <Route element={<SuspenseRouter />}>
          <Route path="/esqueci-minha-senha" element={<ForgotPasswordPage />} />
          <Route path="/solicitacao-enviada" element={<RequestSentPage />} />
          <Route path="/recuperar-senha/:requestId/:token" element={<RecoverPasswordPage />} />
          <Route path="/solicitacao-finalizada" element={<PasswordChangedPage />} />

          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
