import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectIsAuthenticated } from '@/entities/session';
import appRoutes from '@/shared/config/routes';

const GuestRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to={appRoutes.home} replace />;
  }

  return children;
};

export default GuestRoute;
