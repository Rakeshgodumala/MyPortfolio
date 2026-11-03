import { Navigate, Outlet, useLocation } from 'react-router-dom';
import PageLoader from '../components/PageLoader';
import { useAuth } from './AuthContext';

export default function ProtectedRoute() {
  const { admin, checking } = useAuth();
  const location = useLocation();

  if (checking) return <PageLoader label="Checking your session…" />;
  if (!admin) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}
