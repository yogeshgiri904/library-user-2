import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { useAuth } from '../hooks/useAuth';
import { Skeleton } from './ui';

export function AppShell() {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen bg-paper p-5"><Skeleton className="h-44" /><Skeleton className="mt-4 h-28" /><Skeleton className="mt-4 h-72" /></div>;
  }
  if (!session) return <Navigate to="/login" replace state={{ from: location }} />;

  return (
    <div className="min-h-screen bg-paper bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,.20),transparent_25%),radial-gradient(circle_at_top_right,rgba(34,197,94,.13),transparent_26%)]">
      <Outlet />
      <BottomNav />
    </div>
  );
}
