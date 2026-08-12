import {
  CreditCardIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Profile from './profile';
import { useState } from 'react';
import useLogout from '@/hooks/auth/useLogout';
import { useUserStore } from '@/store/userStore';
export default function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate } = useLogout();
  const navigate = useNavigate();
  const auth = useUserStore((state) => state.authState);
  const setAuthState = useUserStore((state) => state.setAuthState);
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger>
        <Profile user={auth!.user!} isOpen={isOpen}></Profile>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <UserIcon />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CreditCardIcon />
          Billing
        </DropdownMenuItem>
        <DropdownMenuItem>
          <SettingsIcon />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => {
            mutate(null, {
              onSuccess() {
                setAuthState(null);
                navigate('/', { replace: true });
              },
            });
          }}
        >
          <LogOutIcon />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
