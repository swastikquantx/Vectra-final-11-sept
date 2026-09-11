
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-white">Loading...</div>;
  if (!user) return <Navigate to="/auth" replace />;
  const isAdmin = ['founder','admin'].includes(user?.role);
  if (!isAdmin) return <Navigate to="/studio" replace />;
  return children;
}
export function useIsAdmin() {
  const { user } = useAuth();
  return ['founder','admin'].includes(user?.role);
}
