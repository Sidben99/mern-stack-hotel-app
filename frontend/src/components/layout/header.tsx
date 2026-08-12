import { Link } from 'react-router-dom';
import Logo from '../logo';
import { Button } from '../ui/button';
import Container from './container';
import { useUserStore } from '@/store/userStore';
import ProfileMenu from '../profileMenu';
export default function Header() {
  const auth = useUserStore((state) => state.authState);
  console.log('auth  ', auth);
  console.log('avatar : ', auth?.user.avatar);
  return (
    <header className="py-5 border-b border-solid border-gray-300">
      <Container>
        <nav className="flex justify-between items-center">
          <Logo></Logo>
          <ul className=" flex gap-8 items-center text-lg ">
            <Link to={'/home'}>home</Link>
            <Link to={'/hotels'}>hotels</Link>
            <Link to={'/rooms'}>rooms</Link>
            <Link to={'/about'}>about</Link>
            <Link to={'/contact'}>contact</Link>
            {auth ? (
              <ProfileMenu></ProfileMenu>
            ) : (
              <Link to={'/auth/login'}>
                <Button className="text-xl font-medium">login</Button>
              </Link>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
