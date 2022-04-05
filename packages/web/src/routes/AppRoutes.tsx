import { Route, Routes, HashRouter } from 'react-router-dom';
import * as React from 'react';

import PageLoader from '~/components/PageLoader';

const EnvironmentLayout = React.lazy(() => import('~/layout/EnvironmentLayout'));
const ErrorPage = React.lazy(() => import('~/pages/Error/ErrorPage'));
const LoginPage = React.lazy(() => import('~/pages/Login/LoginPage'));

export default function AppRoutes() {
  return (
    <HashRouter>
      <React.Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<EnvironmentLayout />}>
            <Route index element={<LoginPage />} />
          </Route>

          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </React.Suspense>
    </HashRouter>
  );
}
