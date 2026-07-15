import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import routesConfig from '@/routes';
export default function RenderScreen({ initPath }: { initPath: string }) {
  const router = createMemoryRouter(routesConfig, {
    initialEntries: [initPath],
  });

  return (
    <QueryClientProvider client={new QueryClient()}>
      <RouterProvider router={router} />
      <Toaster></Toaster>
    </QueryClientProvider>
  );
}
