import { Navigate, Outlet } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { ROLES } from '@lankaStay/shared/consts/roles';
export default function ProtectedRoute({ roles }: { roles: ROLES[] }) {
  const authState = useUserStore((state) => state.authState);

  useEffect(() => {
    if (!authState) {
      toast.error('unauthorized access');
    }
    if (authState && !roles.includes(authState.user.role)) {
      toast.error('forbidden access');
    }
  }, [authState, roles]);

  if (!authState) {
    return <Navigate to="/auth/login" replace />;
  }
  if (authState && !roles.includes(authState.user.role)) {
    return <div> forbidden access </div>;
  }
  return <Outlet />;
}
