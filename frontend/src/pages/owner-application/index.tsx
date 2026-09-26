import { Navigate, Outlet } from 'react-router-dom';
import { useUserStore, type AuthState } from '@/store/userStore';

export type OwnerApplicationContext = {
  authState: AuthState;
  setAuthState: (newAuthState: AuthState | null) => void;
};

export default function OwnerApplication() {
  const authState = useUserStore((state) => state.authState);
  const setAuthState = useUserStore((state) => state.setAuthState);
  if (!authState) return <Navigate to="/auth/login" replace />;
  return <Outlet context={{ authState, setAuthState }} />;
}
