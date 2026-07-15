import { register } from '@/api/auth';
import useMutationWrapper from '../useMutationWrapper';
import type { RegisterType } from '@lankaStay/shared/schemes/user/registerSchema.ts';
export default function useRegister() {
  const { data, isPending, mutate } = useMutationWrapper(
    (registerCredentials: RegisterType) => register(registerCredentials),
  );
  return { data, isPending, mutate };
}
