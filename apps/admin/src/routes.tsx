import { PageLoader } from '@usefaz/components';
import { Route, Routes, HashRouter } from 'react-router-dom';
import * as React from 'react';
import NavbarLayout from './layout/Navbar/NavbarLayout';

const EnvironmentLayout = React.lazy(() => import('~/layout/EnvironmentLayout'));
const ErrorPage = React.lazy(() => import('~/pages/Error/ErrorPage'));
const HomePage = React.lazy(() => import('~/pages/Home/HomePage'));
const ForgotPasswordPage = React.lazy(() => import('~/pages/ForgotPassword/ForgotPasswordPage'));
const RequestSentPage = React.lazy(() => import('~/pages/ForgotPassword/RequestSentPage'));
const RecoverPasswordPage = React.lazy(() => import('~/pages/RecoverPassword/RecoverPasswordPage'));
const PasswordChangedPage = React.lazy(() => import('~/pages/PasswordChanged/PasswordChangedPage'));
const StudentPasswordRecoveryListPage = React.lazy(
  () => import('~/pages/StudentPasswordRecoveryList/StudentPasswordRecoveryListPage')
);

export default function AppRoutes() {
  return (
    <HashRouter>
      <React.Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<EnvironmentLayout />}>
            <Route element={<NavbarLayout />}>
              <Route index element={<HomePage />} />
              <Route path="/solicitacoes-de-recuperacao-de-senha" element={<StudentPasswordRecoveryListPage />} />
            </Route>
          </Route>

          <Route path="/esqueci-minha-senha" element={<ForgotPasswordPage />} />
          <Route path="/solicitacao-enviada" element={<RequestSentPage />} />
          <Route path="/recuperar-senha/:requestId/:token" element={<RecoverPasswordPage />} />
          <Route path="/solicitacao-finalizada" element={<PasswordChangedPage />} />

          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </React.Suspense>
    </HashRouter>
  );
}
