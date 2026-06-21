import useMutationWrapper from '../useMutationWrapper';
import type {
  ResetPasswordDataType,
  ResetPasswordTokenType,
} from '../../../../shared/schemes/user/resetPasswordSchema.ts';

import { resetPassword } from '@/api/auth';
export default function useResetPassword() {
  const { isPending, mutate } = useMutationWrapper(
    (newPasswordNToken: ResetPasswordDataType & ResetPasswordTokenType) =>
      resetPassword(newPasswordNToken),
  );
  return { isPending, mutate };
}
