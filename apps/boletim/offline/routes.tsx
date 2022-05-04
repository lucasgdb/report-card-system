import { Route, Routes, HashRouter } from 'react-router-dom';
import * as React from 'react';

import HomePage from './pages/Home/HomePage';

export default function AppRoutes() {
  return (
    <HashRouter>
      <Routes>
        <Route path="*" element={<HomePage />} />
      </Routes>
    </HashRouter>
  );
}
