import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { selectIsAuthenticated } from '@/entities/session'
import appRoutes from '@/shared/config/routes'

const RequireAuth = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={appRoutes.login} replace state={{ from: location }} />
  }

  return children
}

export default RequireAuth
