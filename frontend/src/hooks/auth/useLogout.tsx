import { logout } from '@/api/auth';
import useMutationWrapper from '../useMutationWrapper';
export default function useLogout() {
  const { isSuccess, isPending, mutate } = useMutationWrapper(
    () => logout(),
    false,
  );
  return { isPending, mutate, isSuccess };
}
