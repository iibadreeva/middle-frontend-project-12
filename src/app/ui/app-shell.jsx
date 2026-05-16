import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { selectIsAuthenticated } from '@/entities/session';
import { useLogout } from '@/features/logout';
import appRoutes from '@/shared/config/routes';
import { AppToasts } from '@/shared/ui/app-toasts';

const AppShell = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const logout = useLogout();

  return (
    <div className="h-100 bg-light">
      <div className="h-100">
        <div className="d-flex flex-column h-100">
          <header>
            <nav
              className="shadow-sm navbar navbar-expand-lg navbar-light bg-white"
              aria-label="Основная навигация"
            >
              <div className="container">
                <NavLink to={appRoutes.home} end className="navbar-brand">
                  Hexlet Chat
                </NavLink>
                {isAuthenticated && (
                  <Button variant="primary" onClick={logout}>
                    Выйти
                  </Button>
                )}
              </div>
            </nav>
          </header>
          <main className="h-100">{children}</main>
          <AppToasts />
        </div>
      </div>
    </div>
  );
};

export default AppShell;
