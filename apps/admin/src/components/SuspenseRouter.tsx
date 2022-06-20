import * as React from 'react';
import { Outlet } from 'react-router';

import PageLoader from './PageLoader';

export default function SuspenseRouter() {
  return (
    <React.Suspense fallback={<PageLoader />}>
      <Outlet />
    </React.Suspense>
  );
}
