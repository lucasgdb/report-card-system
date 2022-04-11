import { Route, Routes, HashRouter } from 'react-router-dom';
import * as React from 'react';

import PageLoader from '~/components/PageLoader';

const EnvironmentLayout = React.lazy(() => import('~/layout/EnvironmentLayout'));
const ErrorPage = React.lazy(() => import('~/pages/Error/ErrorPage'));
const HomePage = React.lazy(() => import('~/pages/Home/HomePage'));

export default function AppRoutes() {
  return (
    <HashRouter>
      <React.Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<EnvironmentLayout />}>
            <Route index element={<HomePage />} />
          </Route>

          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </React.Suspense>
    </HashRouter>
  );
}
