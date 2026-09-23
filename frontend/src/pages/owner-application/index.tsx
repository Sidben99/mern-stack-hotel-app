import { Navigate, Outlet } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
export default function OwnerApplication() {
  const authState = useUserStore((state) => state.authState);
  if (!authState) return <Navigate to="/auth/login" replace />;
  return <Outlet />;
}