import { forgetPassword } from '@/api/auth';
import useMutationWrapper from '../useMutationWrapper';
import type { ForgetPassword } from '@lankaStay/shared/schemes/auth/forgetPasswordSchema';
export default function useForgetPassword() {
  const { isPending, mutate } = useMutationWrapper((email: ForgetPassword) =>
    forgetPassword(email),
  );
  return { isPending, mutate };
}
