import { useAuthContext } from '../context/AuthContext.jsx';

const useAuth = () => {
  const { user, loading, register, login, logout, isAuthenticated, setUser } = useAuthContext();
  return { user, loading, register, login, logout, isAuthenticated, setUser };
};

export default useAuth;