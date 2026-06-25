import { Navigate, Outlet } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { toast } from 'sonner';
import { useEffect } from 'react';

export default function ProtectedRoute() {
  const authState = useUserStore((state) => state.authState);

  useEffect(() => {
    if (!authState) {
      toast.error('unauthorized access');
    }
  }, [authState]);

  if (!authState) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
}
