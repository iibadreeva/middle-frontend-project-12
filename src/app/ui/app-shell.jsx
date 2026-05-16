import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import { selectIsAuthenticated } from '@/entities/session';
import { useLogout } from '@/features/logout';
import appRoutes from '@/shared/config/routes';

const AppShell = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const logout = useLogout();
  const { t } = useTranslation();

  return (
    <div className="h-100 bg-light">
      <div className="h-100">
        <div className="d-flex flex-column h-100">
          <header>
            <nav
              className="shadow-sm navbar navbar-expand-lg navbar-light bg-white"
              aria-label={t('app.navigation')}
            >
              <div className="container">
                <NavLink to={appRoutes.home} end className="navbar-brand">
                  {t('app.brand')}
                </NavLink>
                {isAuthenticated && (
                  <Button variant="primary" onClick={logout}>
                    {t('app.logout')}
                  </Button>
                )}
              </div>
            </nav>
          </header>
          <main className="h-100">{children}</main>
          <ToastContainer position="top-right" autoClose={3000} newestOnTop />
        </div>
      </div>
    </div>
  );
};

export default AppShell;
