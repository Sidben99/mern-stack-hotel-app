import { Outlet } from 'react-router-dom';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Container from '@/components/layout/container';
import { useQuery } from '@tanstack/react-query';
import { refreshAccessToken } from '@/api/auth';
import { useUserStore } from '@/store/userStore';
import { FullPageLoader } from '@/components/ui/fullPageLoader';

export default function Layout() {
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header></Header>
      <main className="flex-1 flex flex-col">
        <Container className="flex-1">
          <Outlet></Outlet>
        </Container>
      </main>
      <Footer></Footer>
    </div>
  );
}
