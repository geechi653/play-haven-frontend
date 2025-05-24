import { Navigate } from 'react-router';
import { useGlobalStore } from '../hooks/useGlobalStore';

function ProtectedRoute({ children }) {
  const { store } = useGlobalStore();
  if (!store.user?.isAuthenticated) return <Navigate to="/" />;
  return <>{children}</>;
}

export default ProtectedRoute;
