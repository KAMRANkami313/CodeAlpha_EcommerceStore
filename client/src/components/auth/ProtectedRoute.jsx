import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import Loader from '../common/Loader.jsx';
import ROUTES from '../../constants/ROUTES.js';

/**
 * ProtectedRoute — Editorial Modern Redesign
 *
 * Same logic, cleaner loader with label.
 * Redirects unauthenticated users to /login.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loader size="md" label="Loading..." />;

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
};

export default ProtectedRoute;
