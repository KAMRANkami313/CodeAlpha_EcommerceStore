import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import Loader from '../common/Loader.jsx';
import ROUTES from '../../constants/ROUTES.js';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <Loader />;
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;
  if (user?.role !== 'admin') return <Navigate to={ROUTES.HOME} replace />;

  return children;
};

export default AdminRoute;