import { Outlet } from 'react-router-dom';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Container from '@/components/layout/container';
export default function Layout() {
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
