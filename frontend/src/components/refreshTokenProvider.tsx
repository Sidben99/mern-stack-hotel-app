import { Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { refreshAccessToken } from '@/api/auth';
import { useUserStore } from '@/store/userStore';
import { FullPageLoader } from '@/components/ui/fullPageLoader';

export default function RefreshTokenProvider() {
  const { isLoading } = useQuery({
    queryKey: ['refreshAccessToken'],
    queryFn: async () => {
      const res = await refreshAccessToken();
      useUserStore.setState({ authState: res.data });
      return res;
    },
    retry: false,
  });
  if (isLoading) return <FullPageLoader />;

  return <Outlet />;
}
