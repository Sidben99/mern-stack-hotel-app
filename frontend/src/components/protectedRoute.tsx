import { Navigate, Outlet } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { useQuery } from '@tanstack/react-query';
import { refreshAccessToken } from '@/api/auth';
import { FullPageLoader } from './ui/fullPageLoader';
import ApiError from '../../../shared/utils/ApiError';
import { toast } from 'sonner';
export default function ProtectedRoute() {
  const { isLoading, data, error } = useQuery({
    queryKey: ['refreshAccessToken'],
    queryFn: () => refreshAccessToken(),
    retry: false,
  });
  if (isLoading) return <FullPageLoader></FullPageLoader>;
  if (data) {
    useUserStore.setState({ authState: data.data });
  }
  if (error) {
    if (error instanceof ApiError) {
      toast.error(error.message);
      return <Navigate to="/auth/login" />;
    }
  }
  return <Outlet />;
}
