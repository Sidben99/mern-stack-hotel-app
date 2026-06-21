import { login } from '@/api/auth';
import useMutationWrapper from '../useMutationWrapper';
import type { LoginType } from '../../../../shared/schemes/user/loginSchema.ts';
export default function useLogin() {
  const { data, isPending, mutate, mutateAsync } = useMutationWrapper(
    (loginCredentials: LoginType) => login(loginCredentials),
    false,
  );
  return { data, isPending, mutate, mutateAsync };
}
