import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import Loader from '../common/Loader.jsx';
import ROUTES from '../../constants/ROUTES.js';

/**
 * AdminRoute — Editorial Modern Redesign
 *
 * Same logic, cleaner loader with label.
 * Redirects: unauthenticated → /login, non-admin → /
 */
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <Loader size="md" label="Loading..." />;
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;
  if (user?.role !== 'admin') return <Navigate to={ROUTES.HOME} replace />;

  return children;
};

export default AdminRoute;