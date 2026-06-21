import { register } from '@/api/auth';
import useMutationWrapper from '../useMutationWrapper';
import type { RegisterType } from '../../../../shared/schemes/user/registerSchema.ts';
export default function useRegister() {
  const { data, isPending, mutateAsync } = useMutationWrapper(
    (registerCredentials: RegisterType) => register(registerCredentials),
  );
  return { data, isPending, mutateAsync };
}
