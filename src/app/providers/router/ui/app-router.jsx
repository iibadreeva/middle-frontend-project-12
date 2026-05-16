import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HomePage } from '@/pages/home';
import { LoginPage } from '@/pages/login';
import { NotFoundPage } from '@/pages/not-found';
import appRoutes from '@/shared/config/routes';
import AppShell from '@/app/ui/app-shell.jsx';
import GuestRoute from './guest-route.jsx';
import RequireAuth from './require-auth.jsx';

const AppRouter = () => (
  <BrowserRouter>
    <AppShell>
      <Routes>
        <Route
          path={appRoutes.home}
          element={(
            <RequireAuth>
              <HomePage />
            </RequireAuth>
          )}
        />
        <Route
          path={appRoutes.login}
          element={(
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          )}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppShell>
  </BrowserRouter>
);

export default AppRouter;
