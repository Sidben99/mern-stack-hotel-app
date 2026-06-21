import { Link } from 'react-router-dom';
import Container from './container';
import Logo from '../logo';
import { Button } from '../ui/button';
export default function Footer() {
  return (
    <footer>
      <div className="py-16 border-2 border-t-gray-200">
        <Container>
          <div className="flex justify-between items-center">
            <div>
              <Logo></Logo>
              <p className="mt-3.5 font-light">
                We kaboom your beauty holiday
                <br />
                instantly and memorable.
              </p>
            </div>
            <div className="text-center">
              <p className="font-medium text-lg">become hotel owner</p>
              <Link to="/auth/register" className="block mt-3.5">
                <Button className=" font-medium text-sm">register now</Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
