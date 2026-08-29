import { useUserStore } from '@/store/userStore';

export default function Index() {
  const authState = useUserStore((state) => state.authState);
  return (
    <div>
      <h1>welcome {authState ? authState.user.username : 'guest'}</h1>
    </div>
  );
}
